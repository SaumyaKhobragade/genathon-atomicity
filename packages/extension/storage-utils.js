// Storage utility functions for Sparky Extension

/**
 * Export all data from storage
 * @returns {Promise<Object>} All stored data
 */
export async function exportAllData() {
  try {
    const data = await chrome.storage.local.get(null);
    return {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      data: data
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

/**
 * Export data as JSON file
 */
export async function downloadDataAsJSON() {
  try {
    const exportData = await exportAllData();
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `memory-lane-export-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error('Error downloading data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Import data from JSON
 * @param {Object} importData - Data to import
 * @returns {Promise<Object>} Import result
 */
export async function importData(importData) {
  try {
    if (!importData.data) {
      throw new Error('Invalid import data format');
    }
    
    await chrome.storage.local.set(importData.data);
    return { success: true };
  } catch (error) {
    console.error('Error importing data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all saved content items
 * @returns {Promise<Array>} Array of saved content
 */
export async function getAllSavedContent() {
  try {
    const result = await chrome.storage.local.get(['savedContent']);
    return result.savedContent || [];
  } catch (error) {
    console.error('Error getting saved content:', error);
    return [];
  }
}

/**
 * Get content item by ID
 * @param {string} id - Content ID
 * @returns {Promise<Object|null>} Content item or null
 */
export async function getContentById(id) {
  try {
    const content = await getAllSavedContent();
    return content.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error getting content by ID:', error);
    return null;
  }
}

/**
 * Get screenshot for content item
 * @param {string} id - Content ID
 * @returns {Promise<string|null>} Screenshot data URL or null
 */
export async function getScreenshot(id) {
  try {
    const result = await chrome.storage.local.get(['screenshots']);
    const screenshots = result.screenshots || {};
    return screenshots[id] || null;
  } catch (error) {
    console.error('Error getting screenshot:', error);
    return null;
  }
}

/**
 * Get thumbnail for content item
 * @param {string} id - Content ID
 * @returns {Promise<string|null>} Thumbnail data URL or null
 */
export async function getThumbnail(id) {
  try {
    const result = await chrome.storage.local.get(['thumbnails']);
    const thumbnails = result.thumbnails || {};
    return thumbnails[id] || null;
  } catch (error) {
    console.error('Error getting thumbnail:', error);
    return null;
  }
}

/**
 * Get AI analysis for content item
 * @param {string} id - Content ID
 * @returns {Promise<Object|null>} AI analysis or null
 */
export async function getAIAnalysis(id) {
  try {
    const result = await chrome.storage.local.get(['aiAnalysis']);
    const aiAnalysis = result.aiAnalysis || {};
    return aiAnalysis[id] || null;
  } catch (error) {
    console.error('Error getting AI analysis:', error);
    return null;
  }
}

/**
 * Get browsing history
 * @param {number} limit - Maximum number of entries to return
 * @returns {Promise<Array>} Array of history entries
 */
export async function getBrowsingHistory(limit = 100) {
  try {
    const result = await chrome.storage.local.get(['browsingHistory']);
    const history = result.browsingHistory || [];
    return history.slice(-limit);
  } catch (error) {
    console.error('Error getting browsing history:', error);
    return [];
  }
}

/**
 * Search saved content
 * @param {string} query - Search query
 * @param {Object} filters - Optional filters (category, tags, dateRange)
 * @returns {Promise<Array>} Matching content items
 */
export async function searchContent(query, filters = {}) {
  try {
    const content = await getAllSavedContent();
    const lowerQuery = query.toLowerCase();
    
    return content.filter(item => {
      // Text search
      const matchesQuery = !query || 
        item.content.toLowerCase().includes(lowerQuery) ||
        item.title.toLowerCase().includes(lowerQuery) ||
        item.url.toLowerCase().includes(lowerQuery);
      
      // Category filter
      const matchesCategory = !filters.category || 
        item.category === filters.category;
      
      // Tags filter
      const matchesTags = !filters.tags || 
        filters.tags.some(tag => item.tags.includes(tag));
      
      // Date range filter
      const matchesDateRange = !filters.dateRange || (
        new Date(item.timestamp) >= new Date(filters.dateRange.start) &&
        new Date(item.timestamp) <= new Date(filters.dateRange.end)
      );
      
      return matchesQuery && matchesCategory && matchesTags && matchesDateRange;
    });
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}

/**
 * Delete content item
 * @param {string} id - Content ID
 * @returns {Promise<Object>} Delete result
 */
export async function deleteContent(id) {
  try {
    // Remove from saved content
    const result = await chrome.storage.local.get([
      'savedContent',
      'screenshots',
      'thumbnails',
      'aiAnalysis'
    ]);
    
    const savedContent = result.savedContent || [];
    const screenshots = result.screenshots || {};
    const thumbnails = result.thumbnails || {};
    const aiAnalysis = result.aiAnalysis || {};
    
    // Filter out the item
    const updatedContent = savedContent.filter(item => item.id !== id);
    
    // Remove associated data
    delete screenshots[id];
    delete thumbnails[id];
    delete aiAnalysis[id];
    
    await chrome.storage.local.set({
      savedContent: updatedContent,
      screenshots,
      thumbnails,
      aiAnalysis
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting content:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Clear all data
 * @returns {Promise<Object>} Clear result
 */
export async function clearAllData() {
  try {
    await chrome.storage.local.clear();
    await initializeStorage();
    return { success: true };
  } catch (error) {
    console.error('Error clearing data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get storage statistics
 * @returns {Promise<Object>} Storage stats
 */
export async function getStorageStats() {
  try {
    const bytesInUse = await chrome.storage.local.getBytesInUse();
    const result = await chrome.storage.local.get(['savedContent', 'storageStats']);
    
    const itemCount = result.savedContent?.length || 0;
    const bytesUsed = result.storageStats?.bytesUsed || bytesInUse;
    
    return {
      bytesUsed,
      megabytesUsed: (bytesUsed / (1024 * 1024)).toFixed(2),
      itemCount,
      percentUsed: ((bytesUsed / (80 * 1024 * 1024)) * 100).toFixed(1),
      lastUpdated: result.storageStats?.lastUpdated || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      bytesUsed: 0,
      megabytesUsed: '0.00',
      itemCount: 0,
      percentUsed: '0.0',
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Get content statistics
 * @returns {Promise<Object>} Content statistics
 */
export async function getContentStats() {
  try {
    const content = await getAllSavedContent();
    const result = await chrome.storage.local.get(['browsingHistory']);
    const history = result.browsingHistory || [];
    
    // Count by type
    const typeCount = content.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    
    // Count by category
    const categoryCount = content.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    
    // Most used tags
    const tagFreq = {};
    content.forEach(item => {
      item.tags.forEach(tag => {
        tagFreq[tag] = (tagFreq[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
    
    return {
      totalItems: content.length,
      byType: typeCount,
      byCategory: categoryCount,
      topTags,
      historyEntries: history.length,
      oldestItem: content.length > 0 ? content[0].timestamp : null,
      newestItem: content.length > 0 ? content[content.length - 1].timestamp : null
    };
  } catch (error) {
    console.error('Error getting content stats:', error);
    return {
      totalItems: 0,
      byType: {},
      byCategory: {},
      topTags: [],
      historyEntries: 0,
      oldestItem: null,
      newestItem: null
    };
  }
}

/**
 * Prepare data for website sync
 * @param {Array<string>} contentIds - Optional array of content IDs to sync (all if empty)
 * @returns {Promise<Object>} Data formatted for website API
 */
export async function prepareDataForSync(contentIds = []) {
  try {
    const allContent = await getAllSavedContent();
    const contentToSync = contentIds.length > 0
      ? allContent.filter(item => contentIds.includes(item.id))
      : allContent;
    
    const syncData = await Promise.all(contentToSync.map(async (item) => {
      const thumbnail = await getThumbnail(item.id);
      const analysis = await getAIAnalysis(item.id);
      
      return {
        id: item.id,
        type: item.type,
        content: item.content,
        context: item.context,
        url: item.url,
        title: item.title,
        timestamp: item.timestamp,
        tags: item.tags,
        category: item.category,
        metadata: item.metadata,
        thumbnail: thumbnail,
        analysis: analysis
      };
    }));
    
    return {
      version: '1.0.0',
      syncDate: new Date().toISOString(),
      itemCount: syncData.length,
      items: syncData
    };
  } catch (error) {
    console.error('Error preparing data for sync:', error);
    throw error;
  }
}

// Initialize storage structure if needed
async function initializeStorage() {
  const STORAGE_KEYS = {
    SAVED_CONTENT: 'savedContent',
    SCREENSHOTS: 'screenshots',
    THUMBNAILS: 'thumbnails',
    BROWSING_HISTORY: 'browsingHistory',
    AI_ANALYSIS: 'aiAnalysis',
    ACTIVE_TABS: 'activeTabs',
    STORAGE_STATS: 'storageStats'
  };

  const result = await chrome.storage.local.get(Object.values(STORAGE_KEYS));
  
  const updates = {};
  if (!result[STORAGE_KEYS.SAVED_CONTENT]) updates[STORAGE_KEYS.SAVED_CONTENT] = [];
  if (!result[STORAGE_KEYS.SCREENSHOTS]) updates[STORAGE_KEYS.SCREENSHOTS] = {};
  if (!result[STORAGE_KEYS.THUMBNAILS]) updates[STORAGE_KEYS.THUMBNAILS] = {};
  if (!result[STORAGE_KEYS.BROWSING_HISTORY]) updates[STORAGE_KEYS.BROWSING_HISTORY] = [];
  if (!result[STORAGE_KEYS.AI_ANALYSIS]) updates[STORAGE_KEYS.AI_ANALYSIS] = {};
  if (!result[STORAGE_KEYS.ACTIVE_TABS]) updates[STORAGE_KEYS.ACTIVE_TABS] = {};
  if (!result[STORAGE_KEYS.STORAGE_STATS]) {
    updates[STORAGE_KEYS.STORAGE_STATS] = {
      bytesUsed: 0,
      itemCount: 0,
      lastUpdated: new Date().toISOString()
    };
  }
  
  if (Object.keys(updates).length > 0) {
    await chrome.storage.local.set(updates);
  }
}
