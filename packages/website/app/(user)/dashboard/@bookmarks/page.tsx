"use client";
import React from "react";
import { Bookmark, BookmarkX } from "lucide-react";
import MemoryItem from "@/app/components/Info/MemoryItem";

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

type BookmarksPageProps = {
  data?: MemoryData[];
  onToggleBookmark?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const BookmarksPage = ({
  data = [],
  onToggleBookmark,
  onToggleFavorite,
  onDelete,
}: BookmarksPageProps) => {
  const bookmarkedMemories = data
    .filter((item) => item.bookmarked)
    .sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
      const dateB = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
      return dateB - dateA; // Newest first
    });

  return (
    <div className="p-6">
      <div className="shadow-lg p-5 rounded-lg border border-border">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Bookmark className="size-10 text-white bg-amber-500 rounded-lg p-2" />
          <div>
            <h1 className="text-2xl font-bold text-amber-500">
              Bookmarked Memories
            </h1>
            <p className="text-muted-foreground">
              {bookmarkedMemories.length === 0
                ? "No bookmarks yet"
                : `${bookmarkedMemories.length} saved ${
                    bookmarkedMemories.length === 1 ? "memory" : "memories"
                  }`}
            </p>
          </div>
        </div>

        {/* Content */}
        {bookmarkedMemories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookmarkX className="size-20 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Bookmarked Memories
            </h3>
            <p className="text-muted-foreground max-w-md">
              Start bookmarking your favorite memories by clicking the bookmark
              icon on any memory card. They'll appear here for quick access.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarkedMemories.map((item) => (
              <MemoryItem
                key={item.id}
                {...item}
                onToggleBookmark={onToggleBookmark}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
