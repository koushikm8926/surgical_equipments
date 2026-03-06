import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items }: { items: { productId: string; quantity: number }[] } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items format' }, { status: 400 });
    }

    // Prepare items for insertion/upsert
    // items shape: { productId: string, quantity: number }
    const cartItems = items.map((item) => ({
      user_id: user.id,
      product_id: item.productId,
      quantity: item.quantity as number,
    }));

    if (cartItems.length > 0) {
      // Upsert cart items: if (user_id, product_id) exists, update quantity or keep existing
      // Based on MILESTONE_6_DETAILS.md: "higher qty wins"

      // First, get existing cart items for this user
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', user.id);

      const existingMap = new Map<string, number>(
        existingItems?.map((i: { product_id: string; quantity: number }) => [
          i.product_id,
          i.quantity,
        ]) || [],
      );

      const finalItems = cartItems.map((item) => {
        const existingQty = existingMap.get(item.product_id) || 0;
        return {
          ...item,
          quantity: Math.max(item.quantity, existingQty),
        };
      });

      const { error } = await supabase
        .from('cart_items')
        .upsert(finalItems, { onConflict: 'user_id, product_id' });

      if (error) throw error;
    }

    // Return the full merged cart from the database
    const { data: mergedItems, error: fetchError } = await supabase
      .from('cart_items')
      .select(
        `
                quantity,
                product:products(*)
            `,
      )
      .eq('user_id', user.id);

    if (fetchError) throw fetchError;

    return NextResponse.json({ items: mergedItems });
  } catch (error: unknown) {
    console.error('Cart sync error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
