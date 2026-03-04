'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category')?.split(',') || [],
  );
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('in_stock') === 'true');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    } else {
      params.delete('category');
    }

    if (inStockOnly) {
      params.set('in_stock', 'true');
    } else {
      params.delete('in_stock');
    }

    params.set('min_price', priceRange[0].toString());
    params.set('max_price', priceRange[1].toString());

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedCategories([]);
    setInStockOnly(false);
    router.push('/products');
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug],
    );
  };

  return (
    <Card className="h-fit sticky top-20">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Category
          </Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category.id}`}
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => toggleCategory(category.slug)}
                />
                <Label
                  htmlFor={`cat-${category.id}`}
                  className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Price Range
            </Label>
            <span className="text-xs font-medium">
              ₹{priceRange[0]} - ₹{priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={[0, 50000]}
            max={50000}
            step={500}
            value={priceRange}
            onValueChange={setPriceRange}
            className="py-4"
          />
        </div>

        {/* Stock Status */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked: boolean | 'indeterminate') =>
              setInStockOnly(checked === true)
            }
          />
          <Label htmlFor="in-stock" className="text-sm font-semibold cursor-pointer leading-none">
            In Stock Only
          </Label>
        </div>

        <div className="pt-4 space-y-2">
          <Button className="w-full" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button variant="ghost" className="w-full" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
