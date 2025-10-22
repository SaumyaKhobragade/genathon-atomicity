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
import { useModalStore } from "@/app/stores/useModalStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  TagIcon,
  X,
  Plus,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { updateMemory } from "@/app/services/extensionService";
import { toast } from "sonner";

const DetailModal = () => {
  const { isOpen, closeModal, memoryData, updateMemoryTags } = useModalStore();
  const [newTag, setNewTag] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRemoveTag = async (tagToRemove: string) => {
    if (memoryData?.tags && memoryData.id) {
      const updatedTags = memoryData.tags.filter((tag) => tag !== tagToRemove);

      // Update local state first
      updateMemoryTags(updatedTags);

      // Persist to extension storage
      setIsUpdating(true);
      try {
        const result = await updateMemory(memoryData.id, { tags: updatedTags });
        if (result.success) {
          toast.success("Tag removed successfully");
        } else {
          toast.error(`Failed to remove tag: ${result.error}`);
          // Revert on failure
          updateMemoryTags(memoryData.tags);
        }
      } catch (error) {
        toast.error("Failed to remove tag");
        // Revert on error
        updateMemoryTags(memoryData.tags);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleAddTag = async () => {
    if (newTag.trim() && memoryData) {
      const trimmedTag = newTag.trim();
      // Prevent duplicate tags
      if (!memoryData.tags?.includes(trimmedTag)) {
        const updatedTags = [...(memoryData.tags || []), trimmedTag];

        // Update local state first
        updateMemoryTags(updatedTags);
        setNewTag("");

        // Persist to extension storage
        setIsUpdating(true);
        try {
          const result = await updateMemory(memoryData.id, {
            tags: updatedTags,
          });
          if (result.success) {
            toast.success("Tag added successfully");
          } else {
            toast.error(`Failed to add tag: ${result.error}`);
            // Revert on failure
            updateMemoryTags(memoryData.tags || []);
            setNewTag(trimmedTag); // Restore the tag input
          }
        } catch (error) {
          toast.error("Failed to add tag");
          // Revert on error
          updateMemoryTags(memoryData.tags || []);
          setNewTag(trimmedTag); // Restore the tag input
        } finally {
          setIsUpdating(false);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Memory Details</DialogTitle>
          <DialogDescription>
            View and manage your captured memory information
          </DialogDescription>
        </DialogHeader>

        {memoryData && (
          <div className="space-y-6 py-4">
            {/* Icon and Title Section */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="text-6xl p-3 bg-accent rounded-xl flex items-center justify-center">
                  {memoryData.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                {memoryData.url ? (
                  <a
                    href={memoryData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl font-bold text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 mb-2 inline-flex items-center gap-2 group transition-colors"
                  >
                    {memoryData.title}
                    <ExternalLink className="size-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <h3 className="text-2xl font-bold text-sky-500 mb-2">
                    {memoryData.title}
                  </h3>
                )}
                <p className="text-muted-foreground leading-relaxed">
                  {memoryData.description}
                </p>
              </div>
            </div>

            <Separator />

            {/* AI Summary Section */}
            {memoryData.summary && (
              <>
                <div className="p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-purple-950/30 border border-purple-200 dark:border-purple-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                      AI Generated Summary
                    </span>
                  </div>
                  <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                    {memoryData.summary}
                  </p>
                </div>
                <Separator />
              </>
            )}

            {/* Date Section */}
            {memoryData.date && (
              <div className="flex items-center gap-3 text-sm">
                <CalendarIcon className="size-5 text-muted-foreground" />
                <div>
                  <span className="font-medium text-foreground">
                    Captured on:
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {memoryData.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Tags Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TagIcon className="size-4 text-muted-foreground" />
                <span>Tags</span>
              </div>

              {/* Display existing tags */}
              {memoryData.tags && memoryData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 ml-6">
                  {memoryData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="px-3 py-1 text-xs font-medium flex items-center gap-1.5 hover:bg-secondary/80 transition-colors"
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

              {/* Add new tag input */}
              <div className="flex gap-2 ml-6">
                <Input
                  type="text"
                  placeholder="Add a new tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                  disabled={isUpdating}
                />
                <Button
                  size="sm"
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || isUpdating}
                  className="gap-1.5"
                >
                  <Plus className="size-4" />
                  {isUpdating ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button variant="default">Edit Memory</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
