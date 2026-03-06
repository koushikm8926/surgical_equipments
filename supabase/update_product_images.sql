-- Update product images with generated demo images
-- Run this in your Supabase SQL Editor

UPDATE public.products SET image_url = '/products/scalpel.png' WHERE slug = 'precision-scalpel-set';
UPDATE public.products SET image_url = '/products/forceps.png' WHERE slug = 'hemostatic-forceps';
UPDATE public.products SET image_url = '/products/ultrasound.png' WHERE slug = 'therapeutic-ultrasound';
UPDATE public.products SET image_url = '/products/tens.png' WHERE slug = 'digital-tens-machine';
UPDATE public.products SET image_url = '/products/stethoscope.png' WHERE slug = 'cardiology-stethoscope';
UPDATE public.products SET image_url = '/products/sphygmo.png' WHERE slug = 'electronic-sphygmomanometer';
UPDATE public.products SET image_url = '/products/bed.png' WHERE slug = 'adjustable-patient-bed';
UPDATE public.products SET image_url = '/products/trolley.png' WHERE slug = 'surgical-trolley';
