"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import useDebounceEffect from "@/hooks/useDebounceeffect";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export default function SearchBar({
  search,
  onSearchChange,
  sortOption,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: SearchBarProps) {
  
  const [input, setInput] = useState(search);

  //Syncing local input state when external search prop changes
  useEffect(() => {
    setInput(search);
  }, [search]);

  useDebounceEffect(input, 1000, onSearchChange);
  
  const sortOptions = [
    { value: "alphabetical", label: "A-Z" },
    { value: "category", label: "Category" },
    { value: "recent", label: "Recent" },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search podcasts by title or category..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-12 w-12 shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-12 px-4 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-32"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:scale-105 px-4 py-2 text-sm",
              selectedCategory === category
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}