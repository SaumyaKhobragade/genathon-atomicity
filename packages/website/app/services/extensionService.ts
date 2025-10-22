// Service to interact with Chrome Extension storage
// This can work in two ways:
// 1. Direct access if running as extension page
// 2. Via messages if the extension provides an API

export interface ExtensionMemory {
  id: string;
  type: "selection" | "page" | "note";
  content: string;
  context?: string;
  url: string;
  title: string;
  timestamp: string;
  tags: string[];
  category: string;
  metadata?: {
    description?: string;
    keywords?: string;
    author?: string;
  };
  analysisId?: string;
}

export interface ExtensionScreenshot {
  [id: string]: string; // base64 data URL
}

export interface ExtensionThumbnail {
  [id: string]: string; // base64 data URL
}

export interface ExtensionAIAnalysis {
  id: string;
  summary: string;
  keywords: string[];
  tags?: string[];
  sentiment: "positive" | "negative" | "neutral";
  importanceScore: number;
  emotionalProfile: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  learningValue: number;
  topics: string[];
  timestamp: string;
}

export interface ExtensionStorageStats {
  bytesUsed: number;
  itemCount: number;
  lastUpdated: string;
}

export interface ExtensionData {
  savedContent: ExtensionMemory[];
  screenshots: ExtensionScreenshot;
  thumbnails: ExtensionThumbnail;
  aiAnalysis: { [id: string]: ExtensionAIAnalysis };
  storageStats: ExtensionStorageStats;
}

// Check if Chrome extension API is available
const isExtensionAvailable = (): boolean => {
  // Check if the extension bridge is available (injected by content script)
  if (typeof window !== "undefined" && (window as any).memoryLaneExtension) {
    return true;
  }

  // Fallback: check if chrome API is available (shouldn't work from website)
  return (
    typeof chrome !== "undefined" &&
    chrome.storage &&
    chrome.storage.local !== undefined
  );
};

// Wait for extension bridge to be ready
const waitForExtension = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).memoryLaneExtension) {
      resolve(true);
      return;
    }

    // Wait for the bridge to load
    const timeout = setTimeout(() => {
      window.removeEventListener("memoryLaneExtensionReady", handler);
      resolve(false);
    }, 2000);

    const handler = () => {
      clearTimeout(timeout);
      resolve(true);
    };

    window.addEventListener("memoryLaneExtensionReady", handler, {
      once: true,
    });
  });
};

// Get all data from extension storage
export const getExtensionData = async (): Promise<ExtensionData | null> => {
  if (!isExtensionAvailable()) {
    console.warn("Chrome extension API not available");
    return null;
  }

  try {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        [
          "savedContent",
          "screenshots",
          "thumbnails",
          "aiAnalysis",
          "storageStats",
        ],
        (result) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error fetching extension data:",
              chrome.runtime.lastError
            );
            resolve(null);
            return;
          }

          resolve({
            savedContent: result.savedContent || [],
            screenshots: result.screenshots || {},
            thumbnails: result.thumbnails || {},
            aiAnalysis: result.aiAnalysis || {},
            storageStats: result.storageStats || {
              bytesUsed: 0,
              itemCount: 0,
              lastUpdated: new Date().toISOString(),
            },
          });
        }
      );
    });
  } catch (error) {
    console.error("Error accessing extension storage:", error);
    return null;
  }
};

// Get only saved content
export const getSavedContent = async (): Promise<ExtensionMemory[]> => {
  try {
    // Wait for extension to be ready
    const ready = await waitForExtension();
    if (!ready) {
      console.log("⚠️ Extension not available");
      return [];
    }

    const bridge = (window as any).memoryLaneExtension;
    if (!bridge) {
      console.log("⚠️ Extension bridge not found");
      return [];
    }

    const response = await bridge.getSavedContent();
    console.log("📦 Extension response:", response);

    if (response.success) {
      return response.data || [];
    }

    return [];
  } catch (error) {
    console.error("❌ Error getting saved content:", error);
    return [];
  }
};

// Get screenshot for a specific memory
export const getScreenshot = async (id: string): Promise<string | null> => {
  if (!isExtensionAvailable()) {
    return null;
  }

  try {
    return new Promise((resolve) => {
      chrome.storage.local.get(["screenshots"], (result) => {
        if (chrome.runtime.lastError) {
          console.error("Error fetching screenshot:", chrome.runtime.lastError);
          resolve(null);
          return;
        }
        const screenshots = result.screenshots || {};
        resolve(screenshots[id] || null);
      });
    });
  } catch (error) {
    console.error("Error accessing screenshot:", error);
    return null;
  }
};

// Get thumbnail for a specific memory
export const getThumbnail = async (id: string): Promise<string | null> => {
  if (!isExtensionAvailable()) {
    return null;
  }

  try {
    return new Promise((resolve) => {
      chrome.storage.local.get(["thumbnails"], (result) => {
        if (chrome.runtime.lastError) {
          console.error("Error fetching thumbnail:", chrome.runtime.lastError);
          resolve(null);
          return;
        }
        const thumbnails = result.thumbnails || {};
        resolve(thumbnails[id] || null);
      });
    });
  } catch (error) {
    console.error("Error accessing thumbnail:", error);
    return null;
  }
};

// Get AI analysis for a specific memory
export const getAIAnalysis = async (
  id: string
): Promise<ExtensionAIAnalysis | null> => {
  if (!isExtensionAvailable()) {
    return null;
  }

  try {
    return new Promise((resolve) => {
      chrome.storage.local.get(["aiAnalysis"], (result) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error fetching AI analysis:",
            chrome.runtime.lastError
          );
          resolve(null);
          return;
        }
        const aiAnalysis = result.aiAnalysis || {};
        resolve(aiAnalysis[id] || null);
      });
    });
  } catch (error) {
    console.error("Error accessing AI analysis:", error);
    return null;
  }
};

// Get storage statistics
export const getStorageStats =
  async (): Promise<ExtensionStorageStats | null> => {
    try {
      const ready = await waitForExtension();
      if (!ready) {
        return null;
      }

      const bridge = (window as any).memoryLaneExtension;
      if (!bridge) {
        return null;
      }

      const response = await bridge.getStats();
      if (response.success) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Error accessing storage stats:", error);
      return null;
    }
  };

// Listen for changes in extension storage
export const onStorageChange = (
  callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void
): (() => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const bridge = (window as any).memoryLaneExtension;
  if (!bridge) {
    console.log("Extension bridge not available for storage listener");
    return () => {};
  }

  try {
    bridge.onStorageChange(callback);
    return () => {
      console.log("Storage change listener removed");
    };
  } catch (error) {
    console.error("Error setting up storage change listener:", error);
    return () => {};
  }
};

// Convert extension memory to dashboard format with AI data
export const convertToDashboardFormat = async (
  memories: ExtensionMemory[]
): Promise<
  Array<{
    id: string;
    title: string;
    description: string;
    content: string;
    summary?: string;
    icon: string;
    date: Date;
    tags: string[];
    bookmarked: boolean;
    favorited: boolean;
    url?: string;
    type?: string;
    category?: string;
    timestamp: string;
  }>
> => {
  // Get AI analysis data if available
  let aiAnalysisData: { [id: string]: ExtensionAIAnalysis } = {};

  try {
    const ready = await waitForExtension();
    if (ready) {
      const bridge = (window as any).memoryLaneExtension;
      const response = await bridge.getAllData?.();
      if (response?.success && response.data?.aiAnalysis) {
        aiAnalysisData = response.data.aiAnalysis;
      }
    }
  } catch (error) {
    console.warn("Could not fetch AI analysis:", error);
  }

  return memories.map((memory) => {
    const aiAnalysis = aiAnalysisData[memory.analysisId || memory.id];

    return {
      id: memory.id,
      title: memory.title,
      description:
        memory.content.substring(0, 150) +
        (memory.content.length > 150 ? "..." : ""),
      content: memory.content,
      summary: aiAnalysis?.summary,
      icon: getIconForType(memory.type, memory.category),
      date: new Date(memory.timestamp),
      tags: aiAnalysis?.tags || memory.tags,
      bookmarked: false,
      favorited: false,
      url: memory.url,
      type: memory.type,
      category: memory.category,
      timestamp: memory.timestamp,
    };
  });
};

// Get icon based on type and category
const getIconForType = (type: string, category: string): string => {
  // Type-based icons
  if (type === "note") return "📝";
  if (type === "selection") return "✂️";
  if (type === "page") return "📄";

  // Category-based icons
  switch (category) {
    case "technology":
      return "💻";
    case "business":
      return "💼";
    case "science":
      return "🔬";
    case "education":
      return "📚";
    case "news":
      return "📰";
    case "entertainment":
      return "🎬";
    default:
      return "📌";
  }
};

// Export data as JSON (for backup/sync)
export const exportExtensionData = async (): Promise<string | null> => {
  const data = await getExtensionData();
  if (!data) return null;

  const exportData = {
    exportDate: new Date().toISOString(),
    version: "1.0.0",
    data: data,
  };

  return JSON.stringify(exportData, null, 2);
};

// Download exported data as file
export const downloadExtensionData = async (): Promise<void> => {
  const dataStr = await exportExtensionData();
  if (!dataStr) {
    console.error("No data to export");
    return;
  }

  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `memory-lane-export-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Update a memory item
export const updateMemory = async (
  id: string,
  updates: Partial<ExtensionMemory>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const ready = await waitForExtension();
    if (!ready) {
      return { success: false, error: "Extension not available" };
    }

    const bridge = (window as any).memoryLaneExtension;
    if (!bridge?.sendMessage) {
      return { success: false, error: "Extension bridge not available" };
    }

    const response = await bridge.sendMessage("updateMemory", { id, updates });

    if (response?.success) {
      console.log("Memory updated successfully:", response);
      return { success: true };
    } else {
      return { success: false, error: response?.error || "Update failed" };
    }
  } catch (error) {
    console.error("Error updating memory:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Delete a memory item
export const deleteMemory = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("[deleteMemory] Starting delete for ID:", id);
    const ready = await waitForExtension();
    if (!ready) {
      console.error("[deleteMemory] Extension not ready");
      return { success: false, error: "Extension not available" };
    }

    const bridge = (window as any).memoryLaneExtension;
    if (!bridge?.sendMessage) {
      console.error("[deleteMemory] Bridge sendMessage not available");
      return { success: false, error: "Extension bridge not available" };
    }

    console.log("[deleteMemory] Sending delete request via bridge");
    const response = await bridge.sendMessage("deleteMemory", { id });
    console.log("[deleteMemory] Response received:", response);

    if (response?.success) {
      console.log("Memory deleted successfully:", response);
      return { success: true };
    } else {
      console.error("[deleteMemory] Delete failed:", response?.error);
      return { success: false, error: response?.error || "Delete failed" };
    }
  } catch (error) {
    console.error("Error deleting memory:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
