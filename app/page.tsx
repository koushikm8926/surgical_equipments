import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { ProductCard } from '@/components/products/product-card';
import {
  Stethoscope,
  Activity,
  ShieldCheck,
  Truck,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();

  // Fetch Featured Products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(
      `
      *,
      categories (
        name
      )
    `,
    )
    .eq('is_featured', true)
    .limit(4);

  // Fetch Categories
  const { data: categories } = await supabase.from('categories').select('*').limit(4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center overflow-hidden bg-slate-900">
        <Image
          src="/medical_hero_banner.png"
          alt="Modern Surgical & Physiotherapy Equipment"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/20 text-primary-foreground border border-primary/30 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
              Trusted by 500+ Medical Facilities
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Advanced Equipment for{' '}
              <span className="text-primary italic font-light">Superior Care.</span>
            </h1>
            <p className="text-xl text-slate-200 mb-10 leading-relaxed max-w-lg">
              Leading supplier of high-precision surgical instruments and state-of-the-art
              physiotherapy rehabilitation tools in India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-lg" asChild>
                <Link href="/products">Explore Catalog</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg bg-white/5 border-white/20 hover:bg-white/10 text-white"
                asChild
              >
                <Link href="/contact">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar / Why Choose Us */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Quality Assured</h3>
                <p className="text-sm text-slate-500">ISO & CE Certified Equipment</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Swift Delivery</h3>
                <p className="text-sm text-slate-500">Pan-India Logistics Support</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">24/7 Support</h3>
                <p className="text-sm text-slate-500">Expert Technical Assistance</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Trusted Partner</h3>
                <p className="text-sm text-slate-500">Serving Since 2010</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-primary font-semibold mb-2 uppercase tracking-widest text-xs">
                <div className="h-px w-8 bg-primary" />
                Premium Selection
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                Featured Equipment
              </h2>
            </div>
            <Link
              href="/products"
              className="group flex items-center text-primary font-semibold hover:underline mt-4 md:mt-0"
            >
              View All Products
              <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts &&
              featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            {!featuredProducts ||
              (featuredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground bg-white rounded-3xl border border-dashed">
                  Visit our catalog to explore all equipment.
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Browse by Specialty
            </h2>
            <p className="text-lg text-slate-500">
              We provide specialized equipment for various medical departments, ensuring the highest
              standards of precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Surgical Strip */}
            <Link
              href="/products/category/surgical-instruments"
              className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 h-80 flex items-center p-12"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10" />
              <div className="relative z-20 max-w-xs">
                <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Stethoscope className="text-white w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Surgical Instruments</h3>
                <p className="text-slate-300 mb-6">
                  Precision blades, scalpels, and theatre equipment.
                </p>
                <div className="flex items-center text-white font-medium">
                  Shop Section <ChevronRight className="ml-2 w-4 h-4" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-60 group-hover:scale-105 transition-transform duration-700">
                <Image src="/surgical_category.png" alt="Surgical" fill className="object-cover" />
              </div>
            </Link>

            {/* Physio Strip */}
            <Link
              href="/products/category/physiotherapy-rehab"
              className="group relative overflow-hidden rounded-[2.5rem] bg-blue-600 h-80 flex items-center p-12"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600/40 to-transparent z-10" />
              <div className="relative z-20 max-w-xs">
                <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Activity className="text-white w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Physiotherapy</h3>
                <p className="text-blue-100 mb-6">
                  Rehabilitation tools, massagers, and mobility aids.
                </p>
                <div className="flex items-center text-white font-medium">
                  Shop Section <ChevronRight className="ml-2 w-4 h-4" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-60 group-hover:scale-105 transition-transform duration-700">
                <Image
                  src="/physio_category.png"
                  alt="Physiotherapy"
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Overlay */}
      <section className="relative py-24 mx-4 md:mx-8 mb-24 rounded-[3rem] overflow-hidden bg-slate-900 border border-white/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-50" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Upgrade Your Facility with Quality.
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get personalized consultations and wholesale pricing for hospital and clinic setups
            across India.
          </p>
          <Button size="lg" className="h-14 px-12 text-lg rounded-full" asChild>
            <Link href="/contact">Inquiry Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
