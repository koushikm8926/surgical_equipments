'use client';

import { useActionState, useState, useEffect } from 'react';
import { upsertProduct } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, X, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface ProductData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  image_url?: string;
  is_featured?: boolean;
}

interface ProductFormProps {
  initialData?: ProductData;
  categories: Category[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const [state, action, isPending] = useActionState(upsertProduct, null);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [isUploading, setIsUploading] = useState(false);
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [name, setName] = useState(initialData?.name || '');

  // Auto-generate slug from name
  useEffect(() => {
    if (!initialData && name) {
      setSlug(
        name
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, ''),
      );
    }
  }, [name, initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const supabase = createClient();

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('product-images').getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Error uploading image: ' + message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      {/* Hidden Fields */}
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="image_url" value={imageUrl} />

      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-slate-200/60 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>Enter the name, identity, and details of the product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-slate-700 font-bold text-xs uppercase tracking-wider"
              >
                Product Name
              </Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ergonomic Surgical Scalpel"
                className="h-11 rounded-xl"
                required
              />
              {state?.errors?.name && (
                <p className="text-xs text-red-500 font-medium">{state.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="slug"
                className="text-slate-700 font-bold text-xs uppercase tracking-wider"
              >
                URL Slug
              </Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ergonomic-surgical-scalpel"
                className="h-11 rounded-xl bg-slate-50 border-dashed"
                required
              />
              {state?.errors?.slug && (
                <p className="text-xs text-red-500 font-medium">{state.errors.slug}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-slate-700 font-bold text-xs uppercase tracking-wider"
              >
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={initialData?.description}
                placeholder="Provide a detailed description of the equipment..."
                className="min-h-[200px] rounded-xl leading-relaxed"
                required
              />
              {state?.errors?.description && (
                <p className="text-xs text-red-500 font-medium">{state.errors.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Inventory & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-slate-700 font-bold text-xs uppercase tracking-wider"
              >
                Price (₹)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={initialData?.price}
                placeholder="0.00"
                className="h-11 rounded-xl"
                required
              />
              {state?.errors?.price && (
                <p className="text-xs text-red-500 font-medium">{state.errors.price}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="stock_quantity"
                className="text-slate-700 font-bold text-xs uppercase tracking-wider"
              >
                Stock Quantity
              </Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                defaultValue={initialData?.stock_quantity}
                placeholder="100"
                className="h-11 rounded-xl"
                required
              />
              {state?.errors?.stock_quantity && (
                <p className="text-xs text-red-500 font-medium">{state.errors.stock_quantity}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Info */}
      <div className="space-y-6">
        <Card className="border-slate-200/60 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Product Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
                imageUrl
                  ? 'aspect-square border-none p-0 overflow-hidden'
                  : 'h-48 border-slate-200 bg-slate-50'
              }`}
            >
              {imageUrl ? (
                <>
                  <Image src={imageUrl} alt="Product preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700">Upload Product Image</p>
                    <p className="text-[10px] text-slate-400">PNG, JPG or WEBP (Max. 2MB)</p>
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                    accept="image/*"
                    disabled={isUploading}
                  />
                </div>
              )}
            </div>
            {state?.errors?.image_url && (
              <p className="text-xs text-red-500 font-medium">{state.errors.image_url}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                Category
              </Label>
              <Select
                name="category_id"
                defaultValue={initialData?.category_id || categories[0]?.id}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="rounded-lg">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.category_id && (
                <p className="text-xs text-red-500 font-medium">{state.errors.category_id}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-0.5">
                <Label htmlFor="is_featured" className="text-sm font-bold text-slate-700">
                  Featured Product
                </Label>
                <p className="text-[10px] text-slate-500">Show on homepage</p>
              </div>
              <Switch
                id="is_featured"
                name="is_featured"
                defaultChecked={initialData?.is_featured}
              />
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-6 space-y-3">
          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/25"
            disabled={isPending || isUploading}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save Product'
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full h-11 rounded-xl font-bold text-slate-500"
            asChild
          >
            <Link href="/admin/products">Cancel</Link>
          </Button>
          {state?.message && !state.errors && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {state.message}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
