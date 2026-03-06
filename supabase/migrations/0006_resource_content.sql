-- 0006_resource_content.sql

-- 1. Create Library Resources Table
CREATE TABLE IF NOT EXISTS library_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- video, manual, infographic
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'uncategorized',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for library_resources
ALTER TABLE library_resources ENABLE ROW LEVEL SECURITY;

-- Policies for library_resources
CREATE POLICY "Library resources are viewable by everyone." ON library_resources FOR SELECT USING (true);
CREATE POLICY "Admins can manage library resources" ON library_resources FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- 2. Seed Blog Posts
INSERT INTO posts (title, slug, content, excerpt, category, is_published, published_at, cover_image) VALUES
('The Future of Minimally Invasive Surgery', 'future-of-minimally-invasive-surgery', 
'<p>Minimally invasive surgery (MIS) continues to evolve, bringing unprecedented precision to the operating room. Recent advancements in robotic-assisted systems and enhanced imaging technologies are allowing surgeons to perform complex procedures through incisions smaller than ever before.</p><p>Hospitals upgrading to the latest endoscopic systems report reduced patient recovery times by up to 30%, alongside significantly lower rates of postoperative complications.</p>',
'Explore the latest advancements in robotic-assisted systems and endoscopic technologies transforming the modern operating room.',
'Surgical Technology', true, NOW() - INTERVAL '2 days', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop'),
('Optimizing Patient Recovery with Advanced Physiotherapy', 'optimizing-patient-recovery-physiotherapy', 
'<p>Post-operative rehabilitation is as critical as the surgery itself. The integration of advanced modalities like deep-tissue ultrasound and computerized TENS units has revolutionized physical therapy protocols.</p><p>This article explores how early intervention combined with targeted electrotherapy accelerates tissue healing and muscle reactivation in post-orthopedic patients.</p>',
'Learn how advanced modalities like deep-tissue ultrasound and computerized TENS units accelerate tissue healing.',
'Rehabilitation', true, NOW() - INTERVAL '5 days', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000&auto=format&fit=crop'),
('Essential Maintenance for Hospital Diagnostic Equipment', 'essential-maintenance-diagnostic-equipment', 
'<p>Diagnostic equipment forms the backbone of accurate patient assessment. However, without rigorous maintenance protocols, even the most advanced machines can suffer from calibration drift.</p><p>We discuss the daily, weekly, and monthly checks required for digital sphygmomanometers, vital sign monitors, and other critical diagnostic tools to ensure clinical accuracy and extend equipment lifespan.</p>',
'A comprehensive guide to routine calibration and maintenance of vital sign monitors and diagnostic tools.',
'Facility Management', true, NOW() - INTERVAL '10 days', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- 3. Seed FAQs (Adding to the 4 already seeded in 0003)
INSERT INTO faqs (question, answer, category, display_order) VALUES
('Do you offer leasing or financing options for heavy equipment?', 'Yes, we partner with leading medical financing institutions to offer flexible leasing and EMI options for purchases exceeding ₹5,00,000. Please select "Request a Quote" on the product page to discuss financing.', 'Pricing & Payment', 5),
('Can I request a demo of a product before purchasing?', 'For high-value equipment like ultrasound units and advanced surgical tables, we can arrange an on-site demonstration at your facility or a virtual demonstration with our product specialists.', 'Services', 6),
('What is your return policy for sterile surgical instruments?', 'Due to hygiene and safety regulations, sterile surgical instruments cannot be returned once the packaging is opened. Please verify specifications before confirming your order. Non-sterile furniture and diagnostic tools have a 7-day return window for manufacturing defects.', 'Orders & Returns', 7),
('Do you supply to remote hospitals and clinics?', 'Yes, we have a robust logistics network that covers all major zip codes across India, including remote and rural medical facilities. Additional shipping times may apply.', 'Shipping', 8),
('Are your products certified by medical regulatory bodies?', 'All our equipment is CE certified, and where applicable, FDA approved or compliant with the Central Drugs Standard Control Organisation (CDSCO) guidelines in India.', 'General', 9);

-- 4. Seed Testimonials
INSERT INTO testimonials (name, role, content, rating, is_approved) VALUES
('Dr. Ayesha Rahman', 'Chief Surgeon, Metro Heart Institute', 'The precision scalpel sets and hemostatic forceps we sourced from SurgicalStore have exceeded our expectations. Excellent grip and durability through multiple sterilization cycles.', 5, true),
('Rajesh Kumar', 'Procurement Head, City Care Hospital', 'We outfitted our entire new post-op ward with their adjustable patient beds. The quality is phenomenal, and the delivery was exactly on schedule. Highly recommended for bulk hospital purchases.', 5, true),
('Dr. Vikram Singh', 'Lead Physiotherapist, Elite Rehab Center', 'The digital TENS machines and ultrasound units have become central to our healing protocols. They are robust, easy for the staff to operate, and yield consistent clinical results.', 4, true),
('Priya Desai', 'Clinic Manager, Desai Orthopedics', 'Their customer service is unmatched. When we needed an urgent replacement part for a surgical trolley, they shipped it overnight. It''s rare to find such reliable vendor partners.', 5, true);

-- 5. Seed Library Resources
INSERT INTO library_resources (title, description, type, url, thumbnail_url, category, display_order) VALUES
('Digital TENS Machine Field Manual', 'Complete operation manual including safety warnings, electrode placement, and maintenance.', 'manual', '/placeholder_manual.pdf', NULL, 'Equipment Setup', 3),
('Sterilization Guidelines Chart', 'Quick-reference infographic for autoclave temperature and pressure settings by material type.', 'infographic', '/placeholder_chart.pdf', 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=800&auto=format&fit=crop', 'Safety & Maintenance', 4);
