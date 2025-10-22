// Background service worker for Sparky

// Ensure chrome APIs are available
if (typeof chrome === "undefined") {
  console.error("Chrome APIs not available");
}

// Storage keys
const STORAGE_KEYS = {
  SAVED_CONTENT: "savedContent",
  SCREENSHOTS: "screenshots",
  THUMBNAILS: "thumbnails",
  BROWSING_HISTORY: "browsingHistory",
  AI_ANALYSIS: "aiAnalysis",
  ACTIVE_TABS: "activeTabs",
  STORAGE_STATS: "storageStats",
};

// Constants
const MAX_HISTORY_ENTRIES = 1000;
const THUMBNAIL_SIZE = 50;
const SCREENSHOT_QUALITY = 0.8;

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log("Sparky installed");
  initializeStorage();
  setupAlarms();
});

// Initialize storage structure
async function initializeStorage() {
  const result = await chrome.storage.local.get(Object.values(STORAGE_KEYS));

  if (!result[STORAGE_KEYS.SAVED_CONTENT]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.SAVED_CONTENT]: [] });
  }
  if (!result[STORAGE_KEYS.SCREENSHOTS]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.SCREENSHOTS]: {} });
  }
  if (!result[STORAGE_KEYS.THUMBNAILS]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.THUMBNAILS]: {} });
  }
  if (!result[STORAGE_KEYS.BROWSING_HISTORY]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.BROWSING_HISTORY]: [] });
  }
  if (!result[STORAGE_KEYS.AI_ANALYSIS]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.AI_ANALYSIS]: {} });
  }
  if (!result[STORAGE_KEYS.ACTIVE_TABS]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.ACTIVE_TABS]: {} });
  }
  if (!result[STORAGE_KEYS.STORAGE_STATS]) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.STORAGE_STATS]: {
        bytesUsed: 0,
        itemCount: 0,
        lastUpdated: new Date().toISOString(),
      },
    });
  }
}

// Setup periodic alarms
function setupAlarms() {
  if (!chrome.alarms) {
    console.warn("chrome.alarms API not available");
    return;
  }
  // Update storage stats every hour
  chrome.alarms.create("updateStats", { periodInMinutes: 60 });

  // Clean old history entries every 24 hours
  chrome.alarms.create("cleanHistory", { periodInMinutes: 1440 });
}

// Track tab updates for automatic page tracking
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // Track the page visit
    await trackPageVisit(tab);
  }
});

// Track page visits
async function trackPageVisit(tab) {
  try {
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.BROWSING_HISTORY,
    ]);
    const history = result[STORAGE_KEYS.BROWSING_HISTORY] || [];

    const visitData = {
      id: Date.now().toString(),
      url: tab.url,
      title: tab.title || "Untitled",
      timestamp: new Date().toISOString(),
      favIconUrl: tab.favIconUrl || null,
    };

    // Add to history
    history.unshift(visitData); // Add to beginning

    // Keep only recent entries
    const trimmedHistory = history.slice(0, MAX_HISTORY_ENTRIES);

    await chrome.storage.local.set({
      [STORAGE_KEYS.BROWSING_HISTORY]: trimmedHistory,
    });

    // Update active tabs tracking
    const activeTabsResult = await chrome.storage.local.get([
      STORAGE_KEYS.ACTIVE_TABS,
    ]);
    const activeTabs = activeTabsResult[STORAGE_KEYS.ACTIVE_TABS] || {};

    activeTabs[tab.id] = {
      url: tab.url,
      title: tab.title,
      lastVisit: new Date().toISOString(),
    };

    await chrome.storage.local.set({ [STORAGE_KEYS.ACTIVE_TABS]: activeTabs });
  } catch (error) {
    console.error("Error tracking page visit:", error);
  }
}

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener(async (tabId) => {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.ACTIVE_TABS]);
    const activeTabs = result[STORAGE_KEYS.ACTIVE_TABS] || {};

    delete activeTabs[tabId];

    await chrome.storage.local.set({ [STORAGE_KEYS.ACTIVE_TABS]: activeTabs });
  } catch (error) {
    console.error("Error cleaning up tab:", error);
  }
});

// Handle alarms
try {
  if (chrome.alarms) {
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === "updateStats") {
        updateStorageStats();
      } else if (alarm.name === "cleanHistory") {
        cleanOldHistory();
      }
    });
  }
} catch (error) {
  console.warn("Could not set up alarms:", error);
}

// Listen for messages (from popup, content scripts, and bridge)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveContent") {
    saveContent(request.data).then(sendResponse);
    return true;
  } else if (request.action === "captureScreenshot") {
    captureScreenshot(sender.tab.id).then(sendResponse);
    return true;
  } else if (request.action === "getStats") {
    getStorageStats()
      .then((stats) => {
        sendResponse({ success: true, data: stats });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  } else if (request.action === "getSavedContent") {
    // Request from bridge.js to get saved content
    chrome.storage.local
      .get([STORAGE_KEYS.SAVED_CONTENT])
      .then((result) => {
        sendResponse({
          success: true,
          data: result[STORAGE_KEYS.SAVED_CONTENT] || [],
        });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  } else if (request.action === "getData") {
    // Request from bridge.js to get all data
    chrome.storage.local
      .get(null)
      .then((data) => {
        sendResponse({ success: true, data: data });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  } else if (request.action === "clearAllData") {
    // Clear all extension data
    clearAllData().then(sendResponse);
    return true;
  } else if (request.action === "updateMemory") {
    // Update a memory item
    updateMemory(request.id, request.updates).then(sendResponse);
    return true;
  } else if (request.action === "deleteMemory") {
    // Delete a memory item
    console.log("[Background] Received deleteMemory request:", request);
    deleteMemory(request.id).then((response) => {
      console.log("[Background] deleteMemory response:", response);
      sendResponse(response);
    });
    return true;
  }
  return true;
});

// Save captured content
async function saveContent(data) {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.SAVED_CONTENT]);
    const savedContent = result[STORAGE_KEYS.SAVED_CONTENT] || [];

    // Process screenshot
    if (data.screenshot) {
      await saveScreenshot(data.id, data.screenshot);
      await saveThumbnail(data.id, data.screenshot);
      delete data.screenshot; // Remove from main data to save space
    }

    // Perform AI analysis
    const analysis = await performAIAnalysis(data);
    await saveAIAnalysis(data.id, analysis);

    // Add to saved content WITH the summary from analysis
    savedContent.push({
      ...data,
      analysisId: data.id,
      summary: analysis.summary, // ADD SUMMARY HERE!
      keywords: analysis.keywords,
      sentiment: analysis.sentiment,
      importanceScore: analysis.importanceScore,
    });

    await chrome.storage.local.set({
      [STORAGE_KEYS.SAVED_CONTENT]: savedContent,
    });
    await updateStorageStats();

    return { success: true, id: data.id };
  } catch (error) {
    console.error("Error saving content:", error);
    return { success: false, error: error.message };
  }
}

// Capture screenshot of current tab
async function captureScreenshot(tabId) {
  try {
    const screenshot = await chrome.tabs.captureVisibleTab(null, {
      format: "jpeg",
      quality: Math.floor(SCREENSHOT_QUALITY * 100),
    });

    return { screenshot };
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    return { screenshot: null };
  }
}

// Save screenshot
async function saveScreenshot(id, dataUrl) {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.SCREENSHOTS]);
    const screenshots = result[STORAGE_KEYS.SCREENSHOTS] || {};
    screenshots[id] = dataUrl;
    await chrome.storage.local.set({ [STORAGE_KEYS.SCREENSHOTS]: screenshots });
  } catch (error) {
    console.error("Error saving screenshot:", error);
  }
}

// Create and save thumbnail
async function saveThumbnail(id, dataUrl) {
  try {
    const thumbnail = await createThumbnail(
      dataUrl,
      THUMBNAIL_SIZE,
      THUMBNAIL_SIZE
    );
    const result = await chrome.storage.local.get([STORAGE_KEYS.THUMBNAILS]);
    const thumbnails = result[STORAGE_KEYS.THUMBNAILS] || {};
    thumbnails[id] = thumbnail;
    await chrome.storage.local.set({ [STORAGE_KEYS.THUMBNAILS]: thumbnails });
  } catch (error) {
    console.error("Error saving thumbnail:", error);
  }
}

// Create thumbnail from image
async function createThumbnail(dataUrl, width, height) {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Create image bitmap from blob
    const imageBitmap = await createImageBitmap(blob);

    // Create canvas and draw resized image
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageBitmap, 0, 0, width, height);

    // Convert to blob and then to data URL
    const thumbnailBlob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: 0.7,
    });

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(thumbnailBlob);
    });
  } catch (error) {
    console.error("Error creating thumbnail:", error);
    return dataUrl; // Return original if thumbnail creation fails
  }
}

// Perform AI analysis (simplified version)
async function performAIAnalysis(data) {
  const content = data.content || "";
  const title = data.title || "";
  const url = data.url || "";

  const summary = generateSmartSummary(content, title);

  // Debug log to verify summary is different from content
  console.log("=== AI Analysis ===");
  console.log("Content length:", content.length);
  console.log("Summary length:", summary.length);
  console.log("Summary:", summary.substring(0, 100));

  return {
    id: data.id,
    summary: summary,
    keywords: extractKeywords(content),
    tags: generateSmartTags(content, url, title),
    sentiment: analyzeSentiment(content),
    importanceScore: calculateImportance(content),
    emotionalProfile: analyzeEmotion(content),
    learningValue: calculateLearningValue(data),
    topics: data.tags || [],
    timestamp: new Date().toISOString(),
  };
}

// Generate smart summary using sentence scoring
function generateSmartSummary(text, title = "") {
  if (!text || text.length < 50) {
    return text || "No content available for summary.";
  }

  // Clean the text first
  const cleanedText = text.replace(/\s+/g, " ").replace(/\n+/g, " ").trim();

  // If text is already short, just return it truncated
  if (cleanedText.length <= 300) {
    return cleanedText;
  }

  // Split into sentences (improved regex)
  const sentences = cleanedText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => {
      // Filter out very short or very long sentences
      const words = s.split(/\s+/).length;
      return words >= 5 && words <= 50 && s.length >= 30 && s.length <= 500;
    });

  if (sentences.length === 0) {
    // Fallback: just take first 300 chars
    return cleanedText.substring(0, 297) + "...";
  }

  if (sentences.length === 1) {
    // Only one good sentence, return it
    const sentence = sentences[0];
    return sentence.length > 300
      ? sentence.substring(0, 297) + "..."
      : sentence;
  }

  // Important keywords for scoring
  const importantKeywords = [
    "important",
    "key",
    "main",
    "significant",
    "critical",
    "essential",
    "note",
    "remember",
    "summary",
    "conclusion",
    "result",
    "finding",
    "solution",
    "answer",
    "explained",
    "guide",
    "tutorial",
    "how to",
    "because",
    "therefore",
    "however",
    "shows",
    "demonstrates",
    "reveals",
  ];

  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter(
      (w) => w.length > 3 && !["this", "that", "with", "from"].includes(w)
    );

  // Score each sentence
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;
    const lowerSentence = sentence.toLowerCase();
    const words = sentence.split(/\s+/);

    // Position score (first and last sentences often more important)
    if (index === 0) score += 5;
    else if (index === 1) score += 3;
    else if (index === sentences.length - 1) score += 2;

    // Length score (prefer sentences with 10-25 words)
    const wordCount = words.length;
    if (wordCount >= 10 && wordCount <= 25) score += 4;
    else if (wordCount >= 8 && wordCount <= 30) score += 2;
    else if (wordCount >= 5 && wordCount <= 35) score += 1;

    // Keyword density (important signal words)
    importantKeywords.forEach((keyword) => {
      if (lowerSentence.includes(keyword)) score += 2;
    });

    // Contains numbers or data (often important facts)
    const numberMatches = sentence.match(/\d+/g);
    if (numberMatches) score += numberMatches.length * 0.5;

    // Title word relevance (content related to title is important)
    titleWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(sentence)) score += 1.5;
    });

    // Penalize questions (usually less informative in summaries)
    if (sentence.includes("?")) score -= 1;

    // Bonus for sentences with proper nouns (names, places - often key info)
    const properNouns = sentence.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
    if (properNouns && properNouns.length > 0)
      score += properNouns.length * 0.3;

    return { sentence, score, index };
  });

  // Sort by score and take top 2-3 sentences
  const numSentences = sentences.length < 5 ? 2 : 3;
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, numSentences)
    .sort((a, b) => a.index - b.index); // Restore original order for coherence

  let summary = topSentences.map((s) => s.sentence).join(" ");

  // Ensure it ends properly
  if (!summary.match(/[.!?]$/)) {
    summary += ".";
  }

  // Limit to ~300 characters max
  if (summary.length > 300) {
    // Try to cut at a sentence boundary
    const cutPoint = summary.lastIndexOf(".", 297);
    if (cutPoint > 150) {
      summary = summary.substring(0, cutPoint + 1);
    } else {
      summary = summary.substring(0, 297) + "...";
    }
  }

  // Final check - if summary is still too similar to original (>90% match),
  // create a more aggressive summary
  const similarityRatio = summary.length / cleanedText.length;
  if (similarityRatio > 0.9) {
    // Just take the first sentence or first 300 chars
    const firstSentence = sentences[0];
    summary =
      firstSentence.length > 300
        ? firstSentence.substring(0, 297) + "..."
        : firstSentence;
  }

  return summary;
}

// Generate smart tags based on content analysis
function generateSmartTags(content, url = "", title = "") {
  const tags = new Set();
  const lowerContent = content.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const combinedText = lowerContent + " " + lowerTitle;

  // Tech-related patterns
  const techPatterns = {
    javascript: /\b(javascript|js|node\.?js|react|vue|angular)\b/i,
    python: /\b(python|django|flask|pandas|numpy)\b/i,
    java: /\b(java|spring|maven|gradle)\b/i,
    "web-dev": /\b(html|css|frontend|backend|fullstack)\b/i,
    database: /\b(sql|database|mongodb|postgres|mysql)\b/i,
    devops: /\b(docker|kubernetes|ci\/cd|devops|aws|cloud)\b/i,
    "ai-ml": /\b(ai|machine learning|ml|deep learning|neural network)\b/i,
    mobile: /\b(android|ios|mobile|app development|react native)\b/i,
  };

  // Content type patterns
  const contentPatterns = {
    tutorial: /\b(tutorial|how to|guide|step by step|learn)\b/i,
    documentation: /\b(documentation|docs|reference|api|specification)\b/i,
    article: /\b(article|blog|post|story)\b/i,
    code: /\b(code|snippet|example|implementation|function)\b/i,
    question: /\b(question|problem|issue|help|error)\b/i,
    discussion: /\b(discussion|opinion|thoughts|debate)\b/i,
  };

  // Check tech patterns
  Object.entries(techPatterns).forEach(([tag, pattern]) => {
    if (pattern.test(combinedText)) {
      tags.add(tag);
    }
  });

  // Check content patterns
  Object.entries(contentPatterns).forEach(([tag, pattern]) => {
    if (pattern.test(combinedText)) {
      tags.add(tag);
    }
  });

  // Extract domain from URL
  if (url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace("www.", "");

      if (domain.includes("github.com")) tags.add("github");
      else if (domain.includes("stackoverflow.com")) tags.add("stackoverflow");
      else if (domain.includes("medium.com")) tags.add("medium");
      else if (domain.includes("dev.to")) tags.add("dev.to");
      else if (domain.includes("reddit.com")) tags.add("reddit");
      else if (domain.includes("youtube.com")) tags.add("youtube");
    } catch (e) {
      // Invalid URL, skip
    }
  }

  // Extract hashtags from content
  const hashtags = content.match(/#[\w]+/g);
  if (hashtags) {
    hashtags.slice(0, 3).forEach((tag) => {
      tags.add(tag.substring(1).toLowerCase());
    });
  }

  // Extract keywords for additional tags
  const keywords = extractKeywords(content);
  keywords.slice(0, 3).forEach((keyword) => {
    if (keyword.length > 3 && keyword.length < 15) {
      tags.add(keyword);
    }
  });

  // Return array of tags (max 10)
  return Array.from(tags).slice(0, 10);
}

// Extract keywords
function extractKeywords(text) {
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "was",
    "are",
    "were",
  ]);

  const wordFreq = {};
  words.forEach((word) => {
    word = word.replace(/[^a-z0-9]/g, "");
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

// Analyze sentiment
function analyzeSentiment(text) {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "love",
    "like",
    "best",
    "happy",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "hate",
    "worst",
    "poor",
    "disappointing",
    "sad",
    "angry",
  ];

  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach((word) => {
    const matches = lowerText.match(new RegExp(word, "g"));
    if (matches) positiveCount += matches.length;
  });

  negativeWords.forEach((word) => {
    const matches = lowerText.match(new RegExp(word, "g"));
    if (matches) negativeCount += matches.length;
  });

  const total = positiveCount + negativeCount;
  if (total === 0) return "neutral";

  const score = (positiveCount - negativeCount) / total;
  if (score > 0.2) return "positive";
  if (score < -0.2) return "negative";
  return "neutral";
}

// Calculate importance score
function calculateImportance(text) {
  const length = text.length;
  const hasLinks = text.includes("http");
  const hasNumbers = /\d/.test(text);

  let score = Math.min(length / 1000, 5);
  if (hasLinks) score += 2;
  if (hasNumbers) score += 1;

  return Math.min(Math.round(score), 10);
}

// Analyze emotion
function analyzeEmotion(text) {
  const emotions = {
    joy: ["happy", "joy", "excited", "wonderful", "amazing", "love"],
    sadness: ["sad", "unhappy", "depressed", "down", "blue"],
    anger: ["angry", "mad", "furious", "annoyed", "irritated"],
    fear: ["afraid", "scared", "worried", "anxious", "nervous"],
    surprise: ["surprised", "shocked", "amazed", "astonished"],
  };

  const profile = {};
  const lowerText = text.toLowerCase();

  for (const [emotion, words] of Object.entries(emotions)) {
    let count = 0;
    words.forEach((word) => {
      const matches = lowerText.match(new RegExp(word, "g"));
      if (matches) count += matches.length;
    });
    profile[emotion] = count;
  }

  return profile;
}

// Calculate learning value
function calculateLearningValue(data) {
  let value = 5;

  if (data.type === "note") value += 2;
  if (data.category === "education" || data.category === "science") value += 3;
  if (data.category === "technology") value += 2;
  if (data.content && data.content.length > 500) value += 1;

  return Math.min(value, 10);
}

// Save AI analysis
async function saveAIAnalysis(id, analysis) {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.AI_ANALYSIS]);
    const aiAnalysis = result[STORAGE_KEYS.AI_ANALYSIS] || {};
    aiAnalysis[id] = analysis;
    await chrome.storage.local.set({ [STORAGE_KEYS.AI_ANALYSIS]: aiAnalysis });
  } catch (error) {
    console.error("Error saving AI analysis:", error);
  }
}

// Track tab activity
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    await trackTabActivity(tab);
  } catch (error) {
    console.error("Error tracking tab activity:", error);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    await trackPageVisit(tab);
  }
});

// Track tab activity
async function trackTabActivity(tab) {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.ACTIVE_TABS]);
    const activeTabs = result[STORAGE_KEYS.ACTIVE_TABS] || {};

    // Calculate time spent on previous tab
    for (const [tabId, tabData] of Object.entries(activeTabs)) {
      if (tabData.active) {
        const timeSpent = Date.now() - tabData.startTime;
        tabData.totalTime = (tabData.totalTime || 0) + timeSpent;
        tabData.active = false;
      }
    }

    // Set current tab as active
    activeTabs[tab.id] = {
      url: tab.url,
      title: tab.title,
      startTime: Date.now(),
      active: true,
      totalTime: activeTabs[tab.id]?.totalTime || 0,
    };

    await chrome.storage.local.set({ [STORAGE_KEYS.ACTIVE_TABS]: activeTabs });
  } catch (error) {
    console.error("Error tracking tab activity:", error);
  }
}

// Track page visit
async function trackPageVisit(tab) {
  try {
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.BROWSING_HISTORY,
    ]);
    let history = result[STORAGE_KEYS.BROWSING_HISTORY] || [];

    const visit = {
      url: tab.url,
      title: tab.title,
      timestamp: new Date().toISOString(),
      domain: new URL(tab.url).hostname,
    };

    history.push(visit);

    // Keep only last 1000 entries
    if (history.length > MAX_HISTORY_ENTRIES) {
      history = history.slice(-MAX_HISTORY_ENTRIES);
    }

    await chrome.storage.local.set({
      [STORAGE_KEYS.BROWSING_HISTORY]: history,
    });
  } catch (error) {
    console.error("Error tracking page visit:", error);
  }
}

// Update storage statistics
async function updateStorageStats() {
  try {
    const bytesInUse = await chrome.storage.local.getBytesInUse();
    const result = await chrome.storage.local.get([STORAGE_KEYS.SAVED_CONTENT]);
    const itemCount = result[STORAGE_KEYS.SAVED_CONTENT]?.length || 0;

    await chrome.storage.local.set({
      [STORAGE_KEYS.STORAGE_STATS]: {
        bytesUsed: bytesInUse,
        itemCount: itemCount,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating storage stats:", error);
  }
}

// Get storage statistics
async function getStorageStats() {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.STORAGE_STATS]);
    return result[STORAGE_KEYS.STORAGE_STATS] || { bytesUsed: 0, itemCount: 0 };
  } catch (error) {
    console.error("Error getting storage stats:", error);
    return { bytesUsed: 0, itemCount: 0 };
  }
}

// Clean old history entries
async function cleanOldHistory() {
  try {
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.BROWSING_HISTORY,
    ]);
    let history = result[STORAGE_KEYS.BROWSING_HISTORY] || [];

    if (history.length > MAX_HISTORY_ENTRIES) {
      history = history.slice(-MAX_HISTORY_ENTRIES);
      await chrome.storage.local.set({
        [STORAGE_KEYS.BROWSING_HISTORY]: history,
      });
    }
  } catch (error) {
    console.error("Error cleaning history:", error);
  }
}

// Update a memory item
async function updateMemory(id, updates) {
  try {
    console.log("Updating memory:", id, updates);

    const result = await chrome.storage.local.get([STORAGE_KEYS.SAVED_CONTENT]);
    const savedContent = result[STORAGE_KEYS.SAVED_CONTENT] || [];

    // Find the memory item
    const index = savedContent.findIndex((item) => item.id === id);
    if (index === -1) {
      return { success: false, error: "Memory not found" };
    }

    // Update the memory item with new values
    savedContent[index] = {
      ...savedContent[index],
      ...updates,
    };

    // Save updated content
    await chrome.storage.local.set({
      [STORAGE_KEYS.SAVED_CONTENT]: savedContent,
    });

    console.log("Memory updated successfully");
    return {
      success: true,
      message: "Memory updated successfully",
      memory: savedContent[index],
    };
  } catch (error) {
    console.error("Error updating memory:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Delete a memory item
async function deleteMemory(id) {
  try {
    console.log("Deleting memory:", id);

    const result = await chrome.storage.local.get([
      STORAGE_KEYS.SAVED_CONTENT,
      STORAGE_KEYS.SCREENSHOTS,
      STORAGE_KEYS.THUMBNAILS,
      STORAGE_KEYS.AI_ANALYSIS,
    ]);

    const savedContent = result[STORAGE_KEYS.SAVED_CONTENT] || [];
    const screenshots = result[STORAGE_KEYS.SCREENSHOTS] || {};
    const thumbnails = result[STORAGE_KEYS.THUMBNAILS] || {};
    const aiAnalysis = result[STORAGE_KEYS.AI_ANALYSIS] || {};

    // Find and remove the memory item
    const index = savedContent.findIndex((item) => item.id === id);
    if (index === -1) {
      return { success: false, error: "Memory not found" };
    }

    // Remove memory from array
    savedContent.splice(index, 1);

    // Remove associated screenshot, thumbnail, and AI analysis
    delete screenshots[id];
    delete thumbnails[id];
    delete aiAnalysis[id];

    // Save updated content
    await chrome.storage.local.set({
      [STORAGE_KEYS.SAVED_CONTENT]: savedContent,
      [STORAGE_KEYS.SCREENSHOTS]: screenshots,
      [STORAGE_KEYS.THUMBNAILS]: thumbnails,
      [STORAGE_KEYS.AI_ANALYSIS]: aiAnalysis,
    });

    // Update storage stats
    await updateStorageStats();

    console.log("Memory deleted successfully");
    return {
      success: true,
      message: "Memory deleted successfully",
      id: id,
    };
  } catch (error) {
    console.error("Error deleting memory:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Clear all extension data
async function clearAllData() {
  try {
    console.log("Clearing all extension data...");

    // Clear all storage
    await chrome.storage.local.clear();

    // Reinitialize with empty values
    await initializeStorage();

    console.log("All extension data cleared successfully");

    return {
      success: true,
      message: "All data cleared successfully",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error clearing all data:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
