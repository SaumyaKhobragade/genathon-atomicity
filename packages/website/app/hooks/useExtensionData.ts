// Custom React hook for accessing Chrome Extension data
import { useState, useEffect } from 'react';
import {
  getSavedContent,
  getStorageStats,
  onStorageChange,
  convertToDashboardFormat,
  type ExtensionMemory,
  type ExtensionStorageStats,
} from '@/app/services/extensionService';

export interface DashboardMemory {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: Date;
  tags: string[];
  bookmarked: boolean;
  favorited: boolean;
  url?: string;
  type?: string;
  category?: string;
}

export const useExtensionData = () => {
  const [memories, setMemories] = useState<DashboardMemory[]>([]);
  const [rawMemories, setRawMemories] = useState<ExtensionMemory[]>([]);
  const [storageStats, setStorageStats] = useState<ExtensionStorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const savedContent = await getSavedContent();
      const stats = await getStorageStats();

      if (savedContent && savedContent.length > 0) {
        setRawMemories(savedContent);
        const dashboardData = await convertToDashboardFormat(savedContent);
        setMemories(dashboardData);
        setIsAvailable(true);
        console.log(`✅ Loaded ${dashboardData.length} memories from extension`);
      } else {
        setIsAvailable(false);
        setMemories([]);
        setRawMemories([]);
        console.log('ℹ️ No extension data available');
      }

      if (stats) {
        setStorageStats(stats);
      }
    } catch (err) {
      console.error('❌ Error loading extension data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load extension data');
      setIsAvailable(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for changes in extension storage
    const cleanup = onStorageChange((changes) => {
      console.log('🔄 Extension storage changed:', Object.keys(changes));
      
      if (changes.savedContent || changes.storageStats) {
        loadData();
      }
    });

    return cleanup;
  }, []);

  const refresh = () => {
    loadData();
  };

  return {
    memories,
    rawMemories,
    storageStats,
    isLoading,
    isAvailable,
    error,
    refresh,
  };
};
