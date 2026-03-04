import Image from 'next/image';
import {
  Target,
  Eye,
  History,
  Users,
  Award,
  Globe,
  HeartHandshake,
  ShieldCheck,
  Activity,
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Years of Experience', value: '14+' },
    { label: 'Products in Catalog', value: '2,500+' },
    { label: 'Clients Served', value: '1,200+' },
    { label: 'Operating States', value: '22' },
  ];

  const milestones = [
    {
      year: '2010',
      title: 'Foundation',
      description: 'Started as a small distributor of surgical instruments in Kolkata.',
    },
    {
      year: '2014',
      title: 'Expansion',
      description: 'Opened our first dedicated showroom and warehouse for physiotherapy equipment.',
    },
    {
      year: '2018',
      title: 'Institutional Partner',
      description:
        'Became an authorized supplier for major government and private hospital chains.',
    },
    {
      year: '2023',
      title: 'Digital Transformation',
      description: 'Launched our integrated e-commerce platform for seamless procurement.',
    },
  ];

  const values = [
    {
      title: 'Uncompromised Quality',
      description:
        'Every piece of equipment undergoes rigorous quality checks before reaching our clients.',
      icon: ShieldCheck,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Customer Centricity',
      description:
        'We prioritize the needs of medical professionals to provide tools that truly matter.',
      icon: HeartHandshake,
      color: 'bg-red-50 text-red-600',
    },
    {
      title: 'Global Standards',
      description: 'Sourcing the finest technology from international partners across the globe.',
      icon: Globe,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Continuous Innovation',
      description: 'Adapting to the latest trends in medical science and rehabilitation therapy.',
      icon: Activity,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Redefining Medical Excellence Since 2010.
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              We are a leading provider of professional surgical and physiotherapy equipment,
              dedicated to empowering healthcare providers with precision tools that save lives and
              restore mobility.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 rounded-[2.5rem] bg-slate-50 border h-full flex flex-col justify-center">
              <div className="p-4 w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-8 flex items-center justify-center">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                To bridge the gap between advanced medical technology and healthcare facilities by
                providing accessible, high-quality, and reliable equipment that enhances patient
                outcomes.
              </p>
            </div>
            <div className="p-12 rounded-[2.5rem] bg-primary text-primary-foreground h-full flex flex-col justify-center">
              <div className="p-4 w-16 h-16 rounded-2xl bg-white/10 mb-8 flex items-center justify-center">
                <Eye className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-lg opacity-90 leading-relaxed text-white">
                To be the most trusted name in the medical supply industry, recognized for our
                integrity, expertise, and commitment to the medical fraternity across the nation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-20 bg-slate-900 text-white border-y border-white/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm uppercase tracking-widest text-slate-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">The Values We Live By</h2>
            <p className="text-lg text-slate-500">
              Our principles are at the heart of everything we do, ensuring that every piece of
              equipment we deliver meets the highest professional standards.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl border bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`p-4 w-16 h-16 rounded-2xl ${v.color} mb-6 flex items-center justify-center transition-transform group-hover:scale-110`}
                >
                  <v.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <History className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Our Journey</h2>
          </div>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 hidden lg:block -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {milestones.map((m, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-3xl border relative group opacity-100 h-full flex flex-col"
                >
                  {/* Dot */}
                  <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full border-4 border-slate-50 bg-primary hidden lg:block -translate-y-1/2 translate-x-1/2 group-last:hidden" />

                  <span className="text-4xl font-black text-slate-100 absolute bottom-4 right-4 group-hover:text-primary/10 transition-colors uppercase tracking-tighter leading-none">
                    {m.year}
                  </span>
                  <div className="text-primary font-bold text-lg mb-2">{m.year}</div>
                  <h4 className="text-xl font-bold mb-3 text-slate-900">{m.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership / CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto rounded-[3rem] bg-slate-900 p-12 md:p-20 text-center relative overflow-hidden text-white">
            <div className="relative z-10">
              <Users className="w-12 h-12 mx-auto mb-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Expertise is Our Foundation</h2>
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                Led by a team of biomedical engineers and medical equipment specialists, we
                understand the technical nuances of every product we sell.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">
                    Director
                  </p>
                  <p className="text-lg font-bold">Dr. Rajesh Kumar</p>
                </div>
                <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">
                    Head of Engineering
                  </p>
                  <p className="text-lg font-bold">Amit Sharma</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
