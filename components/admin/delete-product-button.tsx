'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteProduct } from '@/app/admin/products/actions';
import { useState } from 'react';
import { toast } from 'sonner';

export function DeleteProductButton({ id, productName }: { id: string; productName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProduct(id);
      if (result.message === 'Deleted Product.') {
        toast.success(`Product "${productName}" deleted successfully`);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium gap-2 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 cursor-pointer">
          <Trash2 className="w-3.5 h-3.5" />
          Delete Product
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-slate-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-slate-900">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            This will permanently delete{' '}
            <span className="font-bold text-slate-900">&quot;{productName}&quot;</span>. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-xl font-bold h-11">Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl font-bold h-11 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Confirm Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
