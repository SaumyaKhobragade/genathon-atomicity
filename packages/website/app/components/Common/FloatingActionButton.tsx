"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check, Bookmark } from "lucide-react";
import { useSelectionStore } from "@/app/stores/useSelectionStore";

type FloatingActionButtonProps = {
  totalMemories: number;
  bookmarkedCount: number;
  onManageClick: () => void;
};

const FloatingActionButton = ({
  totalMemories,
  bookmarkedCount,
  onManageClick,
}: FloatingActionButtonProps) => {
  const { selectedIds, selectionMode } = useSelectionStore();
  const selectedCount = selectedIds.size;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Stats Display */}
      <div className="mb-3 flex flex-col items-end gap-2">
        {/* Total Memories */}
        <div className="bg-background border border-border rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm">
          <div className="size-2 rounded-full bg-sky-500" />
          <span className="font-medium">{totalMemories}</span>
          <span className="text-muted-foreground">memories</span>
        </div>

        {/* Bookmarked */}
        {bookmarkedCount > 0 && (
          <div className="bg-background border border-border rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm">
            <Bookmark className="size-3.5 text-amber-500 fill-amber-500" />
            <span className="font-medium">{bookmarkedCount}</span>
            <span className="text-muted-foreground">bookmarked</span>
          </div>
        )}

        {/* Selected (only in selection mode) */}
        {selectionMode && selectedCount > 0 && (
          <div className="bg-sky-500 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm animate-in slide-in-from-right">
            <Check className="size-3.5" />
            <span className="font-medium">{selectedCount}</span>
            <span>selected</span>
          </div>
        )}
      </div>

      {/* Main Action Button */}
      <Button
        size="lg"
        onClick={onManageClick}
        className="size-14 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200"
      >
        {selectionMode ? (
          <Check className="size-6" />
        ) : (
          <Plus className="size-6" />
        )}
      </Button>
    </div>
  );
};

export default FloatingActionButton;
