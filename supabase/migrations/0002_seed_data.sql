-- Seed Categories
INSERT INTO categories (name, slug, description) VALUES
('Surgical Instruments', 'surgical-instruments', 'High-precision tools for surgical procedures including scalpels, forceps, and retractors.'),
('Physiotherapy Equipment', 'physiotherapy-equipment', 'Recovery and rehabilitation gear including therapeutic ultrasound, TENS units, and exercise balls.'),
('Diagnostic Tools', 'diagnostic-tools', 'Medical diagnostic devices such as stethoscopes, blood pressure monitors, and thermometers.'),
('Hospital Furniture', 'hospital-furniture', 'Patient beds, surgical tables, and hospital carts designed for clinical environments.')
ON CONFLICT (slug) DO NOTHING;

-- Seed Products
DO $$
DECLARE
    surgical_id UUID;
    physio_id UUID;
    diagnostic_id UUID;
    furniture_id UUID;
BEGIN
    SELECT id INTO surgical_id FROM categories WHERE slug = 'surgical-instruments';
    SELECT id INTO physio_id FROM categories WHERE slug = 'physiotherapy-equipment';
    SELECT id INTO diagnostic_id FROM categories WHERE slug = 'diagnostic-tools';
    SELECT id INTO furniture_id FROM categories WHERE slug = 'hospital-furniture';

    INSERT INTO products (name, slug, description, price, stock_quantity, category_id, is_featured) VALUES
    ('Precision Scalpel Set', 'precision-scalpel-set', 'Premium stainless steel scalpel set with 10 replaceable blades.', 1250.00, 50, surgical_id, true),
    ('Hemostatic Forceps', 'hemostatic-forceps', 'High-grade stainless steel forceps with locking mechanism.', 850.00, 120, surgical_id, false),
    ('Therapeutic Ultrasound Unit', 'therapeutic-ultrasound', 'Professional-grade ultrasound device for deep tissue therapy.', 15000.00, 15, physio_id, true),
    ('Digital TENS Machine', 'digital-tens-machine', 'Dual-channel TENS unit for pain management and muscle stimulation.', 3500.00, 40, physio_id, false),
    ('Cardiology Stethoscope', 'cardiology-stethoscope', 'High-sensitivity stethoscope for clear cardiovascular acoustics.', 4500.00, 30, diagnostic_id, true),
    ('Electronic Sphygmomanometer', 'electronic-sphygmomanometer', 'Automatic blood pressure monitor with large LCD display.', 2800.00, 60, diagnostic_id, false),
    ('Adjustable Patient Bed', 'adjustable-patient-bed', 'Multi-function manual adjustable hospital bed with side rails.', 35000.00, 10, furniture_id, true),
    ('Surgical Trolley', 'surgical-trolley', 'Mobile stainless steel trolley with two shelves for instrument transport.', 7500.00, 25, furniture_id, false);
END $$;
