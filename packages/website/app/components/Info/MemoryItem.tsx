"use client";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useModalStore } from "@/app/stores/useModalStore";
import { useSelectionStore } from "@/app/stores/useSelectionStore";
import { Bookmark, Heart, Trash2 } from "lucide-react";
import { deleteMemory } from "@/app/services/extensionService";
import { toast } from "sonner";

type MemoryItemProps = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags?: string[];
  date?: Date;
  bookmarked?: boolean;
  favorited?: boolean;
  summary?: string;
  url?: string;
  onToggleBookmark?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
};
const MemoryItem = ({
  id,
  title,
  description,
  icon,
  date,
  tags,
  bookmarked = false,
  favorited = false,
  summary,
  url,
  onToggleBookmark,
  onToggleFavorite,
  onDelete,
}: MemoryItemProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const { selectionMode, isSelected, toggleSelection } = useSelectionStore();
  const selected = isSelected(id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (selectionMode) {
      e.stopPropagation();
      toggleSelection(id);
    } else {
      openModal({ id, title, description, icon, date, tags, summary, url });
    }
  };

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSelection(id);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark?.(id);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteMemory(id);
      if (result.success) {
        toast.success("Memory deleted successfully");
        setShowDeleteDialog(false);
        // Notify parent to refresh data
        onDelete?.(id);
      } else {
        toast.error(`Failed to delete memory: ${result.error}`);
      }
    } catch (error) {
      toast.error("Failed to delete memory");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`border rounded-lg p-2 flex justify-between items-center transition-all duration-300 cursor-pointer relative ${
          selected
            ? "border-sky-500 bg-sky-50 dark:bg-sky-950/20 shadow-md"
            : "hover:shadow-lg"
        }`}
      >
        {/* Selection Checkbox */}
        {selectionMode && (
          <div
            className="absolute top-2 left-2 z-10"
            onClick={handleCheckboxChange}
          >
            <Checkbox checked={selected} className="size-5 border-2" />
          </div>
        )}

        {/* left */}
        <div
          className={`flex items-center gap-2 ${selectionMode ? "ml-8" : ""}`}
        >
          <div>
            <div className="text-3xl mb-2 p-2 bg-accent rounded-lg ">
              {icon}
            </div>
          </div>

          {/* title info */}
          <div>
            <h3 className="text-xl text-sky-500">{title}</h3>
            <p className="text-muted-foreground space-x-3">
              <span>{description}</span>
              <span>{date?.toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <Badge
                key={tag}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteClick}
              className={`transition-colors ${
                favorited
                  ? "text-rose-500 hover:text-rose-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              aria-label={
                favorited ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart className={`size-5 ${favorited ? "fill-current" : ""}`} />
            </Button>

            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmarkClick}
              className={`transition-colors ${
                bookmarked
                  ? "text-amber-500 hover:text-amber-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark
                className={`size-5 ${bookmarked ? "fill-current" : ""}`}
              />
            </Button>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              className="text-gray-400 hover:text-red-600 transition-colors"
              aria-label="Delete memory"
            >
              <Trash2 className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Memory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{title}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemoryItem;
