"use client";
import React, { useState, use, useMemo, useEffect } from "react";

// Import the components from parallel routes
import AnalyticsPage from "./@analytics/page";
import BookmarksPage from "./@bookmarks/page";
import FavoritesPage from "./@favorites/page";
import FoldersPage from "./@folders/page";
import { Clock4Icon, RefreshCw } from "lucide-react";
import MemoryItem from "@/app/components/Info/MemoryItem";
import DetailModal from "@/app/components/Modals/DetailModal";
import FloatingActionButton from "@/app/components/Common/FloatingActionButton";
import BulkActionsModal from "@/app/components/Modals/BulkActionsModal";
import { Button } from "@/components/ui/button";
import { useSelectionStore } from "@/app/stores/useSelectionStore";
import { useSearchStore } from "@/app/stores/useSearchStore";
import {
  getSavedContent,
  convertToDashboardFormat,
  onStorageChange,
  getStorageStats,
  type ExtensionStorageStats,
} from "@/app/services/extensionService";

type MemoryItem = {
  id: string;
  title: string;
  description: string;
  content?: string;
  icon: string;
  date: Date;
  tags: string[];
  bookmarked: boolean;
  favorited: boolean;
  summary?: string;
  url?: string;
  type?: string;
  category?: string;
  timestamp?: string;
};

interface DashboardPageProps {
  searchParams: Promise<{ tab?: string }>;
}

const initialData: MemoryItem[] = [
  {
    id: "memory-1",
    title: "Memory Title",
    description: "This is a brief description of the memory.",
    icon: "🧠",
    date: new Date("2025-10-11T10:30:00"),
    tags: ["tag1", "tag2"],
    bookmarked: false,
    favorited: false,
    summary: undefined,
  },
  {
    id: "memory-2",
    title: "Another Memory",
    description: "This is another brief description of the memory.",
    icon: "📸",
    date: new Date("2025-10-10T15:45:00"),
    tags: ["tag3", "tag4"],
    bookmarked: true,
    favorited: true,
    summary: undefined,
  },
  {
    id: "memory-3",
    title: "Third Memory",
    description: "This is the third brief description of the memory.",
    icon: "🎥",
    date: new Date("2025-10-09T09:20:00"),
    tags: ["tag5", "tag6"],
    bookmarked: false,
    favorited: false,
    summary: undefined,
  },
];

type Folder = {
  id: string;
  name: string;
  color: string;
  memoryIds: string[];
  createdAt: Date;
};

const initialFolders: Folder[] = [
  {
    id: "folder-1",
    name: "Work Projects",
    color: "bg-blue-500",
    memoryIds: ["memory-1"],
    createdAt: new Date("2025-10-01T10:00:00"),
  },
  {
    id: "folder-2",
    name: "Personal",
    color: "bg-green-500",
    memoryIds: [],
    createdAt: new Date("2025-10-05T14:30:00"),
  },
];

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const [data, setData] = useState(initialData);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [extensionAvailable, setExtensionAvailable] = useState(false);
  const [storageStats, setStorageStats] =
    useState<ExtensionStorageStats | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Unwrap searchParams promise
  const params = use(searchParams);

  const {
    selectedIds,
    selectionMode,
    toggleSelection,
    selectAll,
    clearSelection,
    enterSelectionMode,
    exitSelectionMode,
  } = useSelectionStore();

  const { searchQuery } = useSearchStore();

  const activeTab = params.tab || "home";

  // Load data from extension on mount
  useEffect(() => {
    setIsMounted(true);
    loadExtensionData();

    // Listen for changes in extension storage
    const cleanup = onStorageChange((changes) => {
      console.log("Extension storage changed:", changes);
      if (changes.savedContent) {
        loadExtensionData();
      }
    });

    return cleanup;
  }, []);

  const loadExtensionData = async () => {
    setIsLoading(true);
    try {
      console.log("🔄 Loading extension data...");

      // Check if bridge is available
      const hasBridge =
        typeof window !== "undefined" && (window as any).memoryLaneExtension;
      console.log("🌉 Bridge available:", hasBridge);

      if (hasBridge) {
        const bridge = (window as any).memoryLaneExtension;
        console.log("� Using extension bridge, ID:", bridge.extensionId);

        // Get saved content via bridge
        const contentResponse = await bridge.getSavedContent();
        console.log("� Content response:", contentResponse);

        if (contentResponse.success && contentResponse.data) {
          const savedContent = contentResponse.data;
          const dashboardData = await convertToDashboardFormat(savedContent);
          setData(dashboardData);
          setExtensionAvailable(true);
          console.log(
            "SUCCESS! Loaded",
            dashboardData.length,
            "memories from extension"
          );

          // Get stats
          const statsResponse = await bridge.getStats();
          if (statsResponse.success && statsResponse.data) {
            setStorageStats(statsResponse.data);
          }
        } else {
          console.log("No data from extension:", contentResponse);
          setExtensionAvailable(false);
        }
      } else {
        console.log("❌ Extension bridge not available");
        setExtensionAvailable(false);
      }
    } catch (error) {
      console.error("❌ Error loading extension data:", error);
      setExtensionAvailable(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort memories based on search query (newest first)
  const filteredData = useMemo(() => {
    let filtered = data;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = data.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const descriptionMatch = item.description.toLowerCase().includes(query);
        const tagsMatch = item.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );

        return titleMatch || descriptionMatch || tagsMatch;
      });
    }
    
    // Sort by date - newest first
    return filtered.sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
      const dateB = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [data, searchQuery]);

  const bookmarkedCount = data.filter((item) => item.bookmarked).length;

  const handleFABClick = () => {
    if (selectionMode) {
      setIsBulkModalOpen(true);
    } else {
      enterSelectionMode();
    }
  };

  const handleSelectAll = () => {
    selectAll(data.map((item) => item.id));
  };

  const handleClearSelection = () => {
    clearSelection();
  };

  const handleExitSelectionMode = () => {
    exitSelectionMode();
  };

  const handleApplyTags = (tags: string[]) => {
    console.log(
      "Applying tags to selected memories:",
      tags,
      Array.from(selectedIds)
    );
    // TODO: Implement actual tag application logic
    setIsBulkModalOpen(false);
  };

  const handleOrganizeToFolder = (folderName: string) => {
    if (!folderName.trim()) return;

    // Find existing folder or create new one
    const existingFolder = folders.find(
      (f) => f.name.toLowerCase() === folderName.toLowerCase()
    );

    if (existingFolder) {
      // Add selected memories to existing folder
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === existingFolder.id
            ? {
                ...folder,
                memoryIds: [
                  ...new Set([...folder.memoryIds, ...Array.from(selectedIds)]),
                ],
              }
            : folder
        )
      );
    } else {
      // Create new folder with selected memories
      const newFolder: Folder = {
        id: `folder-${Date.now()}`,
        name: folderName,
        color: `bg-${
          ["blue", "green", "purple", "pink", "orange", "teal"][
            folders.length % 6
          ]
        }-500`,
        memoryIds: Array.from(selectedIds),
        createdAt: new Date(),
      };
      setFolders((prevFolders) => [...prevFolders, newFolder]);
    }

    setIsBulkModalOpen(false);
    clearSelection();
    exitSelectionMode();
  };

  const handleCreateFolder = (folderName: string) => {
    if (!folderName.trim()) return;

    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: folderName,
      color: `bg-${
        ["blue", "green", "purple", "pink", "orange", "teal"][
          folders.length % 6
        ]
      }-500`,
      memoryIds: [],
      createdAt: new Date(),
    };
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  };

  const handleAddMemoryToFolder = (folderId: string, memoryIds: string[]) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              memoryIds: [...new Set([...folder.memoryIds, ...memoryIds])],
            }
          : folder
      )
    );
  };

  const handleRemoveMemoryFromFolder = (folderId: string, memoryId: string) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              memoryIds: folder.memoryIds.filter((id) => id !== memoryId),
            }
          : folder
      )
    );
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders((prevFolders) =>
      prevFolders.filter((folder) => folder.id !== folderId)
    );
  };

  const handleToggleBookmark = (id: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
      )
    );
  };

  const handleToggleFavorite = (id: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, favorited: !item.favorited } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    // Remove the memory from local state
    setData((prevData) => prevData.filter((item) => item.id !== id));
    // Refresh data from extension to ensure consistency
    loadExtensionData();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return <AnalyticsPage />;
      case "bookmarks":
        return (
          <BookmarksPage
            data={filteredData}
            onToggleBookmark={handleToggleBookmark}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        );
      case "favorites":
        return (
          <FavoritesPage
            data={filteredData}
            onToggleFavorite={handleToggleFavorite}
            onToggleBookmark={handleToggleBookmark}
            onDelete={handleDelete}
          />
        );
      case "folders":
        return (
          <FoldersPage
            folders={folders}
            allMemories={filteredData}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
            onAddMemoryToFolder={handleAddMemoryToFolder}
            onRemoveMemoryFromFolder={handleRemoveMemoryFromFolder}
            onToggleBookmark={handleToggleBookmark}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        );
      default:
        return (
          <div className="p-6">
            {/* Extension Status Banner */}
            {!extensionAvailable && !isLoading && (
              <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚠️</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                      Extension Not Connected
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Make sure the Sparky extension is installed and enabled.
                      Showing demo data for now.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Storage Stats */}
            {extensionAvailable && storageStats && (
              <div className="mb-4 p-4 bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💾</div>
                    <div>
                      <h3 className="font-semibold text-sky-900 dark:text-sky-100">
                        Storage Stats
                      </h3>
                      <p className="text-sm text-sky-700 dark:text-sky-300">
                        {storageStats.itemCount} items •{" "}
                        {(storageStats.bytesUsed / (1024 * 1024)).toFixed(2)} MB
                        used
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadExtensionData}
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={`size-4 mr-2 ${
                        isLoading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                </div>
              </div>
            )}

            {/* AI Tags Overview */}
            {extensionAvailable &&
              filteredData.length > 0 &&
              (() => {
                const tagCounts = new Map();
                filteredData.forEach((item) => {
                  item.tags?.forEach((tag) => {
                    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
                  });
                });
                const sortedTags = Array.from(tagCounts.entries())
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 15);

                return sortedTags.length > 0 ? (
                  <div className="mb-4 p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">🏷️</div>
                      <div>
                        <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100">
                          AI-Generated Tags
                        </h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          Smart tags automatically generated from your captured
                          content
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sortedTags.map(([tag, count]) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-white dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/70 transition-colors cursor-default"
                        >
                          {tag}{" "}
                          <span className="text-purple-500 dark:text-purple-400">
                            ({count})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

            <div className="shadow-lg p-5 rounded-lg border border-border">
              {/* heading */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock4Icon className="size-10 text-white bg-[#FFB347] rounded-lg p-1.5" />
                  <div>
                    <h1 className="text-xl font-semibold text-sky-500">
                      {searchQuery
                        ? `Search Results (${filteredData.length})`
                        : extensionAvailable
                        ? "Your Captured Memories"
                        : "Recently Captured (Demo)"}
                    </h1>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? `Found ${filteredData.length} matching memor${
                            filteredData.length === 1 ? "y" : "ies"
                          }`
                        : extensionAvailable
                        ? "Synced from your browser extension"
                        : "Install the extension to see your real memories"}
                    </p>
                  </div>
                </div>

                {/* Selection Controls */}
                {selectionMode && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearSelection}
                      disabled={selectedIds.size === 0}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleExitSelectionMode}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {/* Memory items */}
              <div className="mt-4 space-y-3">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <RefreshCw className="size-12 text-sky-500 animate-spin" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Loading your memories...
                    </p>
                  </div>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <MemoryItem
                      key={item.id}
                      {...item}
                      onToggleBookmark={handleToggleBookmark}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-blue-400/20 blur-3xl rounded-full" />
                      <Clock4Icon className="size-16 text-muted-foreground/50 relative" />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-foreground">
                      No memories found
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                      {searchQuery
                        ? `No memories match "${searchQuery}". Try a different search term.`
                        : extensionAvailable
                        ? "Start capturing memories with the browser extension to see them here."
                        : "Install the Sparky extension to capture and sync your browsing memories."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Render content based on active tab */}
      <div className="mt-4">{renderContent()}</div>

      {/* Detail Modal */}
      <DetailModal />

      {/* Bulk Actions Modal */}
      <BulkActionsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onApplyTags={handleApplyTags}
        onOrganizeToFolder={handleOrganizeToFolder}
      />

      {/* Floating Action Button */}
      <FloatingActionButton
        totalMemories={data.length}
        bookmarkedCount={bookmarkedCount}
        onManageClick={handleFABClick}
      />
    </div>
  );
}
