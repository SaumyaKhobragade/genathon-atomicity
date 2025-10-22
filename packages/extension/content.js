// Content script for capturing page content and handling selections

// Settings for automatic capture
let autoCapture = {
  enabled: false,
  delay: 3000, // Wait 3 seconds after page load
  minContentLength: 100 // Minimum content length to capture
};

// Load settings from storage
chrome.storage.local.get(['autoCapture'], (result) => {
  if (result.autoCapture) {
    autoCapture = { ...autoCapture, ...result.autoCapture };
  }
  
  // If auto-capture is enabled, capture page after delay
  if (autoCapture.enabled) {
    setTimeout(() => {
      capturePageAutomatically();
    }, autoCapture.delay);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureSelection') {
    captureSelection().then(sendResponse);
    return true; // Keep the message channel open for async response
  } else if (request.action === 'capturePage') {
    captureFullPage().then(sendResponse);
    return true;
  } else if (request.action === 'updateAutoCapture') {
    autoCapture = { ...autoCapture, ...request.settings };
    sendResponse({ success: true });
    return true;
  }
});

// Floating capture button
let floatingButton = null;
let floatingButtonTimeout = null;

// Create floating capture button
function createFloatingButton() {
  if (floatingButton) return floatingButton;

  const button = document.createElement('button');
  button.id = 'sparky-floating-capture-btn';
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
    </svg>
    Capture
  `;
  
  // Styling
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: '999999',
    display: 'none',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    opacity: '0',
    transform: 'translateY(10px)'
  });

  // Hover effect
  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#5568d3';
    button.style.transform = 'translateY(0) scale(1.05)';
    button.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#667eea';
    button.style.transform = 'translateY(0) scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
  });

  // Click handler
  button.addEventListener('click', async () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (!selectedText) {
      showFloatingNotification('Please select some text first', 'warning');
      return;
    }

    // Visual feedback
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0110 10" stroke-opacity="0.75"/>
      </svg>
      Capturing...
    `;
    button.style.pointerEvents = 'none';

    try {
      const result = await captureSelection();
      
      if (result.success) {
        showFloatingNotification('✓ Text captured successfully!', 'success');
        hideFloatingButton();
      } else {
        showFloatingNotification('Failed to capture: ' + (result.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error capturing selection:', error);
      showFloatingNotification('Error capturing text', 'error');
    } finally {
      // Reset button
      button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        Capture
      `;
      button.style.pointerEvents = 'auto';
    }
  });

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    #sparky-floating-capture-btn {
      display: flex !important;
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(button);
  floatingButton = button;
  return button;
}

// Show floating button with animation
function showFloatingButton() {
  const button = createFloatingButton();
  
  // Clear any existing timeout
  if (floatingButtonTimeout) {
    clearTimeout(floatingButtonTimeout);
  }

  // Show button with animation
  button.style.display = 'flex';
  setTimeout(() => {
    button.style.opacity = '1';
    button.style.transform = 'translateY(0)';
  }, 10);

  // Auto-hide after 5 seconds of no interaction
  floatingButtonTimeout = setTimeout(() => {
    hideFloatingButton();
  }, 5000);
}

// Hide floating button with animation
function hideFloatingButton() {
  if (!floatingButton) return;
  
  floatingButton.style.opacity = '0';
  floatingButton.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    if (floatingButton) {
      floatingButton.style.display = 'none';
    }
  }, 300);
}

// Show floating notification
function showFloatingNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.textContent = message;
  
  const colors = {
    success: { bg: '#10b981', border: '#059669' },
    error: { bg: '#ef4444', border: '#dc2626' },
    warning: { bg: '#f59e0b', border: '#d97706' }
  };
  
  const color = colors[type] || colors.success;
  
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '1000000',
    padding: '12px 24px',
    backgroundColor: color.bg,
    color: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderLeft: `4px solid ${color.border}`,
    opacity: '0',
    transform: 'translateY(-10px)',
    transition: 'all 0.3s ease'
  });
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Listen for text selection
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText && selectedText.length > 5) {
    showFloatingButton();
  } else {
    // Keep button visible if it's already shown and user is hovering over it
    if (floatingButton && floatingButton.matches(':hover')) {
      return;
    }
    if (floatingButtonTimeout) {
      clearTimeout(floatingButtonTimeout);
    }
    floatingButtonTimeout = setTimeout(() => {
      hideFloatingButton();
    }, 500);
  }
});

// Hide button when clicking elsewhere
document.addEventListener('click', (e) => {
  if (floatingButton && !floatingButton.contains(e.target)) {
    const selection = window.getSelection();
    if (!selection.toString().trim()) {
      hideFloatingButton();
    }
  }
});


// Capture selected text
async function captureSelection() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (!selectedText) {
    return { success: false, error: 'No text selected' };
  }

  try {
    // Get surrounding context
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const context = getContext(container);

    // Capture screenshot of selection area
    const screenshot = await captureScreenshot();

    const contentData = {
      id: Date.now().toString(),
      type: 'selection',
      content: selectedText,
      context: context,
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      tags: extractTags(selectedText),
      category: categorizeContent(selectedText),
      screenshot: screenshot
    };

    // Send to background for processing
    chrome.runtime.sendMessage({
      action: 'saveContent',
      data: contentData
    });

    return { success: true };
  } catch (error) {
    console.error('Error capturing selection:', error);
    return { success: false, error: error.message };
  }
}

// Capture full page content
async function captureFullPage() {
  try {
    // Get main content
    const mainContent = extractMainContent();
    
    // Capture screenshot
    const screenshot = await captureScreenshot();

    const contentData = {
      id: Date.now().toString(),
      type: 'page',
      content: mainContent,
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      tags: extractTagsFromPage(),
      category: categorizeContent(mainContent),
      screenshot: screenshot,
      metadata: {
        description: getMetaDescription(),
        keywords: getMetaKeywords(),
        author: getMetaAuthor()
      }
    };

    // Send to background for processing
    chrome.runtime.sendMessage({
      action: 'saveContent',
      data: contentData
    });

    return { success: true };
  } catch (error) {
    console.error('Error capturing page:', error);
    return { success: false, error: error.message };
  }
}

// Extract main content from page
function extractMainContent() {
  // Try to find main content area
  const mainSelectors = ['main', 'article', '[role="main"]', '.content', '#content'];
  
  for (const selector of mainSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      return cleanText(element.innerText);
    }
  }
  
  // Fallback to body content
  return cleanText(document.body.innerText);
}

// Get context around selected element
function getContext(element) {
  let contextElement = element.parentElement;
  let depth = 0;
  
  while (contextElement && depth < 3) {
    if (contextElement.tagName === 'P' || contextElement.tagName === 'DIV' || 
        contextElement.tagName === 'ARTICLE' || contextElement.tagName === 'SECTION') {
      return cleanText(contextElement.innerText).substring(0, 500);
    }
    contextElement = contextElement.parentElement;
    depth++;
  }
  
  return '';
}

// Clean text content
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim()
    .substring(0, 10000); // Limit to 10KB
}

// Extract tags from text
function extractTags(text) {
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  
  const wordFreq = {};
  words.forEach(word => {
    word = word.replace(/[^a-z0-9]/g, '');
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

// Extract tags from page
function extractTagsFromPage() {
  const tags = new Set();
  
  // Get meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.content.split(',').forEach(tag => tags.add(tag.trim().toLowerCase()));
  }
  
  // Get from title
  document.title.split(/[\s\-|]+/).forEach(word => {
    if (word.length > 3) tags.add(word.toLowerCase());
  });
  
  // Get from headings
  document.querySelectorAll('h1, h2, h3').forEach(heading => {
    heading.innerText.split(/\s+/).forEach(word => {
      word = word.replace(/[^a-z0-9]/gi, '').toLowerCase();
      if (word.length > 3) tags.add(word);
    });
  });
  
  return Array.from(tags).slice(0, 10);
}

// Categorize content
function categorizeContent(text) {
  const categories = {
    'technology': ['code', 'programming', 'software', 'tech', 'api', 'database', 'algorithm'],
    'business': ['market', 'business', 'finance', 'company', 'revenue', 'sales'],
    'science': ['research', 'study', 'experiment', 'data', 'analysis', 'theory'],
    'education': ['learn', 'tutorial', 'course', 'lesson', 'guide', 'teaching'],
    'news': ['news', 'report', 'breaking', 'update', 'announced'],
    'entertainment': ['movie', 'music', 'game', 'show', 'entertainment', 'video']
  };
  
  const lowerText = text.toLowerCase();
  let maxScore = 0;
  let category = 'general';
  
  for (const [cat, keywords] of Object.entries(categories)) {
    let score = 0;
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = lowerText.match(regex);
      if (matches) score += matches.length;
    });
    
    if (score > maxScore) {
      maxScore = score;
      category = cat;
    }
  }
  
  return category;
}

// Capture screenshot
async function captureScreenshot() {
  try {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'captureScreenshot' }, (response) => {
        resolve(response?.screenshot || null);
      });
    });
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
}

// Get meta description
function getMetaDescription() {
  const meta = document.querySelector('meta[name="description"]');
  return meta ? meta.content : '';
}

// Get meta keywords
function getMetaKeywords() {
  const meta = document.querySelector('meta[name="keywords"]');
  return meta ? meta.content : '';
}

// Get meta author
function getMetaAuthor() {
  const meta = document.querySelector('meta[name="author"]');
  return meta ? meta.content : '';
}

// Automatic page capture
async function capturePageAutomatically() {
  try {
    // Don't capture on certain URLs
    const excludedDomains = ['chrome://', 'chrome-extension://', 'about:', 'edge://'];
    if (excludedDomains.some(domain => window.location.href.startsWith(domain))) {
      return;
    }

    // Get main content
    const mainContent = extractMainContent();
    
    // Check minimum content length
    if (mainContent.length < autoCapture.minContentLength) {
      console.log('Content too short for automatic capture');
      return;
    }

    // Capture screenshot
    const screenshot = await captureScreenshot();

    const contentData = {
      id: Date.now().toString(),
      type: 'auto-page',
      content: mainContent,
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      tags: extractTagsFromPage(),
      category: categorizeContent(mainContent),
      screenshot: screenshot,
      metadata: {
        description: getMetaDescription(),
        keywords: getMetaKeywords(),
        author: getMetaAuthor()
      },
      auto: true // Mark as automatically captured
    };

    // Send to background for processing
    chrome.runtime.sendMessage({
      action: 'saveContent',
      data: contentData
    }, (response) => {
      if (response?.success) {
        console.log('Page automatically captured:', document.title);
      }
    });

  } catch (error) {
    console.error('Error in automatic capture:', error);
  }
}

// Listen for page visibility changes to capture when user returns to tab
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && autoCapture.enabled) {
    // User returned to this tab, optionally capture again
    // Uncomment if you want to recapture on tab focus
    // setTimeout(() => capturePageAutomatically(), autoCapture.delay);
  }
});
