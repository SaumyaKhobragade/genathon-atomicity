"use client";
import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  FolderPlus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import MemoryItem from "@/app/components/Info/MemoryItem";
import AddMemoryToFolderModal from "@/app/components/Modals/AddMemoryToFolderModal";

type MemoryData = {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: Date;
  tags: string[];
  bookmarked: boolean;
  favorited: boolean;
};

type FolderType = {
  id: string;
  name: string;
  color: string;
  memoryIds: string[];
  createdAt: Date;
};

type FoldersPageProps = {
  folders?: FolderType[];
  allMemories?: MemoryData[];
  onCreateFolder?: (folderName: string) => void;
  onDeleteFolder?: (folderId: string) => void;
  onAddMemoryToFolder?: (folderId: string, memoryIds: string[]) => void;
  onRemoveMemoryFromFolder?: (folderId: string, memoryId: string) => void;
  onToggleBookmark?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const FoldersPage = ({
  folders = [],
  allMemories = [],
  onCreateFolder,
  onDeleteFolder,
  onAddMemoryToFolder,
  onRemoveMemoryFromFolder,
  onToggleBookmark,
  onToggleFavorite,
  onDelete,
}: FoldersPageProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [addMemoryModalState, setAddMemoryModalState] = useState<{
    isOpen: boolean;
    folderId: string;
    folderName: string;
  }>({ isOpen: false, folderId: "", folderName: "" });
  const [deleteFolderModalState, setDeleteFolderModalState] = useState<{
    isOpen: boolean;
    folderId: string;
    folderName: string;
  }>({ isOpen: false, folderId: "", folderName: "" });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() && onCreateFolder) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setIsCreateFolderOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateFolder();
    }
  };

  const openAddMemoryModal = (folderId: string, folderName: string) => {
    setAddMemoryModalState({ isOpen: true, folderId, folderName });
  };

  const handleAddMemories = (memoryIds: string[]) => {
    if (onAddMemoryToFolder && addMemoryModalState.folderId) {
      onAddMemoryToFolder(addMemoryModalState.folderId, memoryIds);
    }
  };

  const openDeleteFolderModal = (folderId: string, folderName: string) => {
    setDeleteFolderModalState({ isOpen: true, folderId, folderName });
  };

  const handleConfirmDeleteFolder = () => {
    if (onDeleteFolder && deleteFolderModalState.folderId) {
      onDeleteFolder(deleteFolderModalState.folderId);
      setDeleteFolderModalState({ isOpen: false, folderId: "", folderName: "" });
    }
  };

  const getFolderMemories = (memoryIds: string[]) => {
    return memoryIds
      .map((id) => allMemories.find((m) => m.id === id))
      .filter((m): m is MemoryData => m !== undefined)
      .sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
        const dateB = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
        return dateB - dateA; // Newest first
      });
  };

  return (
    <div className="p-6">
      <div className="shadow-xl p-6 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/20">
        {/* Enhanced Header with Gradient */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-violet-500 blur-lg opacity-30 rounded-2xl"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl p-3 shadow-lg">
                <FolderOpen className="size-10 text-white" strokeWidth={2} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                My Folders
              </h1>
              <p className="text-muted-foreground font-medium mt-1">
                {folders.length === 0
                  ? "No folders yet — create your first one"
                  : `${folders.length} ${
                      folders.length === 1 ? "folder" : "folders"
                    } organizing your memories`}
              </p>
            </div>
          </div>

          {/* Enhanced Create Folder Button */}
          <Button
            onClick={() => setIsCreateFolderOpen(true)}
            className="gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-6 text-base font-semibold"
          >
            <FolderPlus className="size-5" strokeWidth={2.5} />
            New Folder
          </Button>
        </div>

        {/* Content */}
        {folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-400 blur-2xl opacity-20 rounded-full"></div>
              <Folder
                className="size-24 text-indigo-400 mb-6 relative"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              No Folders Yet
            </h3>
            <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
              Create folders to organize your memories by project, category, or
              any way you like. Click the "New Folder" button to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {folders.map((folder) => {
              const isExpanded = expandedFolders.has(folder.id);
              const folderMemories = getFolderMemories(folder.memoryIds);

              // Enhanced color mapping
              const colorMap: Record<
                string,
                {
                  gradient: string;
                  border: string;
                  text: string;
                  bg: string;
                  icon: string;
                }
              > = {
                "bg-blue-500": {
                  gradient: "from-blue-400 to-blue-600",
                  border: "border-blue-500",
                  text: "text-blue-600",
                  bg: "bg-blue-50 dark:bg-blue-950/20",
                  icon: "text-blue-500",
                },
                "bg-green-500": {
                  gradient: "from-green-400 to-emerald-600",
                  border: "border-green-500",
                  text: "text-green-600",
                  bg: "bg-green-50 dark:bg-green-950/20",
                  icon: "text-green-500",
                },
                "bg-purple-500": {
                  gradient: "from-purple-400 to-purple-600",
                  border: "border-purple-500",
                  text: "text-purple-600",
                  bg: "bg-purple-50 dark:bg-purple-950/20",
                  icon: "text-purple-500",
                },
                "bg-pink-500": {
                  gradient: "from-pink-400 to-pink-600",
                  border: "border-pink-500",
                  text: "text-pink-600",
                  bg: "bg-pink-50 dark:bg-pink-950/20",
                  icon: "text-pink-500",
                },
                "bg-orange-500": {
                  gradient: "from-orange-400 to-orange-600",
                  border: "border-orange-500",
                  text: "text-orange-600",
                  bg: "bg-orange-50 dark:bg-orange-950/20",
                  icon: "text-orange-500",
                },
                "bg-teal-500": {
                  gradient: "from-teal-400 to-teal-600",
                  border: "border-teal-500",
                  text: "text-teal-600",
                  bg: "bg-teal-50 dark:bg-teal-950/20",
                  icon: "text-teal-500",
                },
              };

              const colors = colorMap[folder.color] || colorMap["bg-blue-500"];

              return (
                <div
                  key={folder.id}
                  className={`group border-2 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
                    colors.border
                  } ${
                    isExpanded
                      ? "ring-2 ring-offset-2 " +
                        colors.border.replace("border-", "ring-")
                      : ""
                  }`}
                >
                  {/* Folder Header with Gradient */}
                  <div
                    className={`relative ${colors.bg} backdrop-blur-sm p-5 cursor-pointer hover:brightness-95 transition-all duration-200`}
                    onClick={() => toggleFolder(folder.id)}
                  >
                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
                    ></div>

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Animated folder icon */}
                        <div
                          className={`relative p-3 rounded-xl ${colors.bg} border ${colors.border} shadow-sm group-hover:scale-110 transition-transform duration-200`}
                        >
                          {isExpanded ? (
                            <FolderOpen
                              className={`size-7 ${colors.icon}`}
                              strokeWidth={2}
                            />
                          ) : (
                            <Folder
                              className={`size-7 ${colors.icon}`}
                              strokeWidth={2}
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className={`text-xl font-bold ${colors.text}`}>
                              {folder.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 p-0 hover:bg-white/50 dark:hover:bg-black/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFolder(folder.id);
                              }}
                            >
                              {isExpanded ? (
                                <ChevronDown
                                  className={`size-5 ${colors.text}`}
                                  strokeWidth={2.5}
                                />
                              ) : (
                                <ChevronRight
                                  className={`size-5 ${colors.text}`}
                                  strokeWidth={2.5}
                                />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium text-muted-foreground">
                              {folder.memoryIds.length}{" "}
                              {folder.memoryIds.length === 1
                                ? "memory"
                                : "memories"}
                            </span>
                            <span className="text-xs text-muted-foreground/60">
                              • Created{" "}
                              {folder.createdAt.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions with improved styling */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddMemoryModal(folder.id, folder.name);
                          }}
                          className={`gap-2 bg-gradient-to-r ${colors.gradient} text-white shadow-md hover:shadow-lg transition-all duration-200`}
                        >
                          <Plus className="size-4" strokeWidth={2.5} />
                          Add Memory
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteFolderModal(folder.id, folder.name);
                          }}
                          className="size-9 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-950/40 transition-all duration-200"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Folder Contents with enhanced styling */}
                  {isExpanded && (
                    <div className="p-5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t-2 border-dashed border-gray-200 dark:border-gray-800">
                      {folderMemories.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center size-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <Plus className="size-8 text-gray-400" />
                          </div>
                          <p className="text-muted-foreground mb-3 font-medium">
                            No memories in this folder yet
                          </p>
                          <Button
                            variant="outline"
                            onClick={() =>
                              openAddMemoryModal(folder.id, folder.name)
                            }
                            className={`gap-2 ${colors.border} ${colors.text} hover:${colors.bg}`}
                          >
                            <Plus className="size-4" />
                            Add your first memory
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {folderMemories.map((memory, index) => (
                            <div
                              key={memory.id}
                              className="relative group animate-in slide-in-from-left duration-300"
                            >
                              <MemoryItem
                                {...memory}
                                onToggleBookmark={onToggleBookmark}
                                onToggleFavorite={onToggleFavorite}
                                onDelete={onDelete}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  onRemoveMemoryFromFolder?.(
                                    folder.id,
                                    memory.id
                                  )
                                }
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 size-9 bg-white dark:bg-gray-800 shadow-lg border-2 border-red-200 hover:border-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                                aria-label="Remove from folder"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg">
                <FolderPlus className="size-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Create New Folder
              </span>
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Enter a name for your new folder. You can add memories to it later
              or organize existing ones.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <Input
              placeholder="Folder name (e.g., Work, Personal, Travel)"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="h-12 text-base border-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateFolderOpen(false);
                setNewFolderName("");
              }}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-md"
            >
              <FolderPlus className="size-4" strokeWidth={2.5} />
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Memory to Folder Modal */}
      <AddMemoryToFolderModal
        isOpen={addMemoryModalState.isOpen}
        onClose={() =>
          setAddMemoryModalState({
            isOpen: false,
            folderId: "",
            folderName: "",
          })
        }
        folderName={addMemoryModalState.folderName}
        allMemories={allMemories}
        existingMemoryIds={
          folders.find((f) => f.id === addMemoryModalState.folderId)
            ?.memoryIds || []
        }
        onAddMemories={handleAddMemories}
      />

      {/* Delete Folder Confirmation Modal */}
      <Dialog
        open={deleteFolderModalState.isOpen}
        onOpenChange={(open) =>
          !open &&
          setDeleteFolderModalState({ isOpen: false, folderId: "", folderName: "" })
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Trash2 className="size-5" />
              Delete Folder?
            </DialogTitle>
            <DialogDescription asChild>
              <div className="pt-4 space-y-3">
                <p className="text-base">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    &quot;{deleteFolderModalState.folderName}&quot;
                  </span>
                  ?
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Note:</strong> The memories inside this folder will not be
                    deleted. They will remain accessible in your main dashboard.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteFolderModalState({
                  isOpen: false,
                  folderId: "",
                  folderName: "",
                })
              }
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDeleteFolder}
              className="flex-1 sm:flex-none gap-2 bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="size-4" />
              Delete Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoldersPage;
