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
  Award,
  HeartPulse,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { StatsCounter } from '@/components/home/stats-counter';

export default async function Home() {
  const supabase = await createClient();

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

  const stats = [
    { value: '14+', label: 'Years Experience' },
    { value: '2,500+', label: 'Products Available' },
    { value: '1,200+', label: 'Happy Clients' },
    { value: '22', label: 'States Served' },
  ];

  return (
    <>
      {/* ──────────────── HERO ──────────────── */}
      <section className="relative w-full min-h-[700px] flex items-center overflow-hidden bg-slate-950">
        {/* Background Image */}
        <Image
          src="/medical_hero_banner.png"
          alt="Modern Surgical & Physiotherapy Equipment"
          fill
          className="object-cover opacity-40"
          priority
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-[1]" />

        <div className="container relative z-10 mx-auto px-4 md:px-8 py-24">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold bg-primary/15 text-primary border border-primary/25 mb-8 uppercase tracking-widest">
              <HeartPulse className="w-3.5 h-3.5 mr-2" />
              Trusted by 500+ Medical Facilities
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
              Advanced Equipment <br className="hidden md:block" />
              for{' '}
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                Superior Care.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed max-w-lg">
              India&apos;s leading supplier of high-precision surgical instruments and
              state-of-the-art physiotherapy rehabilitation tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="h-14 px-10 text-base font-bold rounded-2xl shadow-lg shadow-primary/25"
                asChild
              >
                <Link href="/products">
                  Explore Catalog
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-base font-bold rounded-2xl bg-white/5 border-white/15 hover:bg-white/10 text-white backdrop-blur-sm"
                asChild
              >
                <Link href="/contact">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── STATS BAR ──────────────── */}
      <section className="relative -mt-16 z-20 container mx-auto px-4 md:px-8">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center relative after:hidden md:after:block after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-10 after:w-px after:bg-slate-100 last:after:hidden"
              >
                <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">
                  <StatsCounter value={stat.value} />
                </div>
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── TRUST BAR ──────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Quality Assured',
                desc: 'ISO & CE Certified Equipment',
                color: 'bg-blue-50 text-blue-600 border-blue-100',
              },
              {
                icon: Truck,
                title: 'Swift Delivery',
                desc: 'Pan-India Logistics Support',
                color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
              },
              {
                icon: Clock,
                title: '24/7 Support',
                desc: 'Expert Technical Assistance',
                color: 'bg-amber-50 text-amber-600 border-amber-100',
              },
              {
                icon: Award,
                title: 'Trusted Partner',
                desc: 'Serving Since 2010',
                color: 'bg-violet-50 text-violet-600 border-violet-100',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 rounded-2xl border bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`p-3.5 rounded-xl ${item.color} border shrink-0`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── FEATURED PRODUCTS ──────────────── */}
      <section className="py-24 bg-slate-50/70">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-2.5 text-primary font-bold mb-3 uppercase tracking-[0.2em] text-[11px]">
                <Sparkles className="w-4 h-4" />
                Premium Selection
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                Featured Equipment
              </h2>
            </div>
            <Link
              href="/products"
              className="group flex items-center text-primary font-bold hover:underline mt-4 md:mt-0 text-sm"
            >
              View All Products
              <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts &&
              featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            {(!featuredProducts || featuredProducts.length === 0) && (
              <div className="col-span-full py-16 text-center text-muted-foreground bg-white rounded-3xl border border-dashed">
                <p className="font-medium">No featured products yet.</p>
                <Link
                  href="/products"
                  className="text-primary font-bold text-sm mt-2 inline-block hover:underline"
                >
                  Browse all equipment →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ──────────────── CATEGORY STRIPS ──────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Browse by Specialty
            </h2>
            <p className="text-lg text-slate-500">
              Specialized equipment for every medical department, meeting the highest professional
              standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Surgical */}
            <Link
              href="/products/category/surgical-instruments"
              className="group relative overflow-hidden rounded-[2rem] bg-slate-900 h-80 flex items-center p-10 md:p-12 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent z-10" />
              <div className="relative z-20 max-w-xs">
                <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-white/20">
                  <Stethoscope className="text-white w-6 h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Surgical Instruments
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Precision blades, scalpels, forceps, and operating theatre essentials.
                </p>
                <div className="flex items-center text-white/80 font-bold text-sm group-hover:text-white transition-colors">
                  Shop Section
                  <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-50 group-hover:scale-110 transition-transform duration-700">
                <Image src="/surgical_category.png" alt="Surgical" fill className="object-cover" />
              </div>
            </Link>

            {/* Physio */}
            <Link
              href="/products/category/physiotherapy-rehab"
              className="group relative overflow-hidden rounded-[2rem] bg-blue-700 h-80 flex items-center p-10 md:p-12 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-700/60 to-transparent z-10" />
              <div className="relative z-20 max-w-xs">
                <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-white/20">
                  <Activity className="text-white w-6 h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Physiotherapy</h3>
                <p className="text-blue-200/80 text-sm mb-6 leading-relaxed">
                  Rehabilitation tools, ultrasound machines, massagers, and mobility aids.
                </p>
                <div className="flex items-center text-white/80 font-bold text-sm group-hover:text-white transition-colors">
                  Shop Section
                  <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-50 group-hover:scale-110 transition-transform duration-700">
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

      {/* ──────────────── CTA SECTION ──────────────── */}
      <section className="py-8 px-4 md:px-8">
        <div className="relative py-24 rounded-[2.5rem] overflow-hidden bg-slate-950">
          {/* Decorative elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[120px]" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
          </div>
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 z-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Upgrade <br className="hidden md:block" />
                Your Medical Facility?
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto mb-12 leading-relaxed">
                Get personalized consultations and competitive wholesale pricing for hospitals,
                clinics, and rehabilitation centres across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="h-14 px-12 text-base font-bold rounded-2xl shadow-lg shadow-primary/30"
                  asChild
                >
                  <Link href="/contact">
                    Get a Free Quote
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-12 text-base font-bold rounded-2xl bg-white/5 border-white/15 hover:bg-white/10 text-white"
                  asChild
                >
                  <Link href="/products">Browse Catalog</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
