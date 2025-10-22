"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X, FolderPlus, Tag as TagIcon } from "lucide-react";
import { useSelectionStore } from "@/app/stores/useSelectionStore";

type BulkActionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApplyTags: (tags: string[]) => void;
  onOrganizeToFolder: (folderName: string) => void;
};

const BulkActionsModal = ({
  isOpen,
  onClose,
  onApplyTags,
  onOrganizeToFolder,
}: BulkActionsModalProps) => {
  const { selectedIds, clearSelection } = useSelectionStore();
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [folderName, setFolderName] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleApplyTags = () => {
    if (tags.length > 0) {
      onApplyTags(tags);
      setTags([]);
    }
  };

  const handleOrganizeToFolder = () => {
    if (folderName.trim()) {
      onOrganizeToFolder(folderName.trim());
      setFolderName("");
    }
  };

  const handleClose = () => {
    setTags([]);
    setFolderName("");
    setNewTag("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bulk Actions</DialogTitle>
          <DialogDescription>
            Manage {selectedIds.size} selected{" "}
            {selectedIds.size === 1 ? "memory" : "memories"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add Tags Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TagIcon className="size-4 text-muted-foreground" />
              <Label className="text-base font-semibold">Add Tags</Label>
            </div>

            {/* Display tags to be added */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 ml-6">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 text-xs font-medium flex items-center gap-1.5"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive transition-colors"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Input for new tags */}
            <div className="flex gap-2 ml-6">
              <Input
                type="text"
                placeholder="Enter tag name..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddTag)}
              />
              <Button
                size="sm"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                variant="outline"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            {tags.length > 0 && (
              <Button
                onClick={handleApplyTags}
                className="ml-6 w-[calc(100%-1.5rem)]"
              >
                Apply {tags.length} {tags.length === 1 ? "Tag" : "Tags"} to
                Selected
              </Button>
            )}
          </div>

          <Separator />

          {/* Organize to Folder Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FolderPlus className="size-4 text-muted-foreground" />
              <Label className="text-base font-semibold">
                Organize to Folder
              </Label>
            </div>

            <div className="space-y-2 ml-6">
              <Input
                type="text"
                placeholder="Enter folder name..."
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleOrganizeToFolder)}
              />
              <Button
                onClick={handleOrganizeToFolder}
                disabled={!folderName.trim()}
                className="w-full"
                variant="secondary"
              >
                <FolderPlus className="size-4 mr-2" />
                Move to Folder
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              clearSelection();
              handleClose();
            }}
          >
            Clear Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkActionsModal;
