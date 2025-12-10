'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SortOption {
  value: string;
  label: string;
}

interface PriceRange {
  value: string;
  label: string;
}

interface ExploreFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  handleClearFilters: () => void;
  sortOptions: SortOption[];
  priceRanges: PriceRange[];
}

export default function ExploreFilters({
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  handleClearFilters,
  sortOptions,
  priceRanges,
}: ExploreFiltersProps) {
  return (
    <section className="bg-gray-100 border-b py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>
    </section>
  );
}
