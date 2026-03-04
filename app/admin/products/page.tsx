import { createClient } from '@/utils/supabase/server';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/format';

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select(
      `
      *,
      categories (
        name
      )
    `,
    )
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your inventory, pricing, and product details.
          </p>
        </div>
        <Button className="rounded-xl h-11 px-6 gap-2" asChild>
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search products by name or SKU..."
            className="pl-10 h-11 rounded-xl bg-white border-slate-200"
          />
        </div>
        <Button variant="outline" className="h-11 rounded-xl gap-2 px-4 bg-white border-slate-200">
          <Filter className="w-4 h-4 text-slate-500" />
          More Filters
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                Product Name
              </TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                Category
              </TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                Price
              </TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                Stock
              </TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                Status
              </TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className="border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                      <Image
                        src={product.image_url || '/placeholder_product.png'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">{product.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        UID: {product.id.slice(0, 8)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-lg bg-slate-50 border-slate-100 text-slate-600 font-bold text-[10px]"
                    >
                      {product.categories?.name || 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-slate-900 text-sm">
                      {formatPrice(product.price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${product.stock_quantity < 10 ? 'text-red-600' : 'text-slate-700'}`}
                      >
                        {product.stock_quantity}
                      </span>
                      {product.stock_quantity < 10 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`rounded-xl px-2.5 font-bold text-[10px] uppercase tracking-wider ${
                        product.stock_quantity > 0
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-red-50 text-red-600 border-red-100'
                      }`}
                    >
                      {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-slate-100"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-xl p-1 shadow-xl border-slate-200"
                      >
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 px-3 py-2 font-bold">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          className="rounded-lg px-3 py-2 text-sm font-medium gap-2 cursor-pointer"
                          asChild
                        >
                          <Link href={`/admin/products/${product.id}`}>
                            <Edit className="w-3.5 h-3.5 text-slate-400" />
                            Edit Product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-lg px-3 py-2 text-sm font-medium gap-2 cursor-pointer"
                          asChild
                        >
                          <Link href={`/products/${product.slug}`} target="_blank">
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            View on Store
                          </Link>
                        </DropdownMenuItem>
                        <div className="h-px bg-slate-100 my-1" />
                        <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium gap-2 text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Package className="w-10 h-10 opacity-20" />
                    <p className="font-medium text-sm">No products found in the catalog.</p>
                    <Button variant="link" className="font-bold" asChild>
                      <Link href="/admin/products/new">Add first product →</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-slate-500 font-medium">
          Showing <span className="text-slate-800 font-bold">{products?.length || 0}</span> of{' '}
          <span className="text-slate-800 font-bold">{products?.length || 0}</span> products
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-lg h-9 font-bold px-4" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg h-9 font-bold px-4" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
