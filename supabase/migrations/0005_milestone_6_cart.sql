-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id    UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders schema extension
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Profiles schema extension
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- contact_submissions extension for quote requests
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS quantity_requested INTEGER,
ADD COLUMN IF NOT EXISTS institution_name TEXT;
