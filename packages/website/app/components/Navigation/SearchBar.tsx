"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSearchStore } from "@/app/stores/useSearchStore";
import { useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    setIsSearching,
    clearSearch,
  } = useSearchStore();

  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Sync with URL params on mount
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setLocalQuery(query);
      setSearchQuery(query);
    }
  }, [searchParams, setSearchQuery]);

  const handleSearch = () => {
    if (!localQuery.trim()) return;

    setIsSearching(true);
    setSearchQuery(localQuery);

    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", localQuery);
    router.push(`/dashboard?${params.toString()}`);

    // Simulate search (replace with actual search logic)
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleClear = () => {
    setLocalQuery("");
    clearSearch();
    
    // Remove search param from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const newUrl = params.toString() 
      ? `/dashboard?${params.toString()}` 
      : "/dashboard";
    router.push(newUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className="flex items-center">
      <div className="relative w-full">
        {/* left icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="text-muted-foreground animate-spin size-5" />
          ) : (
            <Search className="text-muted-foreground size-5" />
          )}
        </div>

        {/* input with left padding to avoid overlap */}
        <Input
          placeholder="Search memories, tags, emotions..."
          className="pl-10 pr-32 w-full focus:ring-2 focus:ring-sky-500 transition-all"
          aria-label="Search"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Clear button (visible when there's text) */}
        {localQuery && (
          <div className="absolute inset-y-0 right-24 flex items-center pr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="size-7 hover:bg-gray-200 dark:hover:bg-gray-800"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </Button>
          </div>
        )}

        {/* button inside input on the right */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-1">
          <Button
            size="sm"
            className="rounded-md cursor-pointer gradient px-4"
            onClick={handleSearch}
            disabled={!localQuery.trim() || isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
