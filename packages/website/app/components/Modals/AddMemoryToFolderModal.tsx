"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

type AddMemoryToFolderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  folderName: string;
  allMemories: MemoryData[];
  existingMemoryIds: string[];
  onAddMemories: (memoryIds: string[]) => void;
};

const AddMemoryToFolderModal = ({
  isOpen,
  onClose,
  folderName,
  allMemories,
  existingMemoryIds,
  onAddMemories,
}: AddMemoryToFolderModalProps) => {
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out memories that are already in the folder
  const availableMemories = allMemories.filter(
    (memory) => !existingMemoryIds.includes(memory.id)
  );

  // Filter by search query
  const filteredMemories = availableMemories.filter(
    (memory) =>
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleMemory = (memoryId: string) => {
    setSelectedMemoryIds((prev) =>
      prev.includes(memoryId)
        ? prev.filter((id) => id !== memoryId)
        : [...prev, memoryId]
    );
  };

  const handleSelectAll = () => {
    setSelectedMemoryIds(filteredMemories.map((m) => m.id));
  };

  const handleClearSelection = () => {
    setSelectedMemoryIds([]);
  };

  const handleAddMemories = () => {
    if (selectedMemoryIds.length > 0) {
      onAddMemories(selectedMemoryIds);
      setSelectedMemoryIds([]);
      setSearchQuery("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedMemoryIds([]);
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="size-5 text-sky-500" />
            Add Memories to "{folderName}"
          </DialogTitle>
          <DialogDescription>
            Select memories to add to this folder. Memories already in the
            folder are not shown.
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Selection Controls */}
        {filteredMemories.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedMemoryIds.length} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                disabled={selectedMemoryIds.length === filteredMemories.length}
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                disabled={selectedMemoryIds.length === 0}
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Memories List */}
        <div className="flex-1 overflow-y-auto space-y-2 border rounded-lg p-4">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {availableMemories.length === 0
                ? "All memories are already in this folder"
                : "No memories found matching your search"}
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <div
                key={memory.id}
                onClick={() => handleToggleMemory(memory.id)}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedMemoryIds.includes(memory.id)
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-950/20"
                    : "hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                <Checkbox
                  checked={selectedMemoryIds.includes(memory.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{memory.icon}</span>
                    <h4 className="font-semibold text-sky-500">
                      {memory.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {memory.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {memory.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMemories}
            disabled={selectedMemoryIds.length === 0}
            className="gap-2"
          >
            <Plus className="size-4" />
            Add{" "}
            {selectedMemoryIds.length > 0 &&
              `(${selectedMemoryIds.length})`}{" "}
            {selectedMemoryIds.length === 1 ? "Memory" : "Memories"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemoryToFolderModal;
