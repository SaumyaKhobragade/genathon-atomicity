"use client";
import React from "react";
import { Heart, HeartOff } from "lucide-react";
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

type FavoritesPageProps = {
  data?: MemoryData[];
  onToggleFavorite?: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const FavoritesPage = ({
  data = [],
  onToggleFavorite,
  onToggleBookmark,
  onDelete,
}: FavoritesPageProps) => {
  const favoritedMemories = data
    .filter((item) => item.favorited)
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
          <Heart className="size-10 text-white bg-rose-500 rounded-lg p-2 fill-current" />
          <div>
            <h1 className="text-2xl font-bold text-rose-500">
              Favorite Memories
            </h1>
            <p className="text-muted-foreground">
              {favoritedMemories.length === 0
                ? "No favorites yet"
                : `${favoritedMemories.length} favorite ${
                    favoritedMemories.length === 1 ? "memory" : "memories"
                  }`}
            </p>
          </div>
        </div>

        {/* Content */}
        {favoritedMemories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <HeartOff className="size-20 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Favorite Memories Yet
            </h3>
            <p className="text-muted-foreground max-w-md">
              Mark your most cherished memories as favorites by clicking the
              heart icon on any memory card. They'll appear here for easy access
              to what matters most.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favoritedMemories.map((item) => (
              <MemoryItem
                key={item.id}
                {...item}
                onToggleFavorite={onToggleFavorite}
                onToggleBookmark={onToggleBookmark}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
