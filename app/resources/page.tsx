import Link from 'next/link';
import { BookOpen, HelpCircle, Star, ChevronRight, ArrowRight, PlayCircle } from 'lucide-react';

export default function ResourcesPage() {
  const sections = [
    {
      title: 'Medical Blog',
      description: 'Insights into latest surgical techniques and physiotherapy recovery guides.',
      href: '/resources/blog',
      icon: BookOpen,
      color: 'bg-blue-600',
      action: 'Read Articles',
    },
    {
      title: 'Frequently Asked Questions',
      description: 'Quick answers about shipping, warranty, and equipment maintenance.',
      href: '/resources/faqs',
      icon: HelpCircle,
      color: 'bg-primary',
      action: 'View FAQs',
    },
    {
      title: 'Client Testimonials',
      description: 'See what medical professionals say about our equipment and service.',
      href: '/resources/testimonials',
      icon: Star,
      color: 'bg-orange-500',
      action: 'Read Reviews',
    },
    {
      title: 'Educational Library',
      description: 'Instructional videos and infographics for equipment operation.',
      href: '/resources/library',
      icon: PlayCircle,
      color: 'bg-purple-600',
      action: 'Explore Library',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight mb-6">Learning & Support Hub</h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Access educational content, get answers to your questions, and read success stories
              from our partner medical facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Sections Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, idx) => (
              <Link
                key={idx}
                href={section.href}
                className="group relative overflow-hidden rounded-[2.5rem] border bg-white p-12 hover:border-primary/50 transition-colors"
              >
                <div
                  className={`p-4 w-16 h-16 rounded-2xl ${section.color} text-white mb-8 flex items-center justify-center`}
                >
                  <section.icon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{section.title}</h2>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed">{section.description}</p>
                <div className="flex items-center text-primary font-bold">
                  {section.action}{' '}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Preview CTA */}
      <section className="py-24 bg-slate-50 border-y">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold mb-6">Need more specialized help?</h2>
              <p className="text-lg text-slate-600 mb-8">
                Our technical support team is available for one-on-one consultations regarding
                complex hospital setups and equipment maintenance.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
              >
                Contact Support Team
              </Link>
            </div>
            <div className="w-full md:w-1/2 aspect-video rounded-[3rem] bg-slate-200 overflow-hidden relative border shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col gap-4">
                <PlayCircle className="w-16 h-16" />
                <span className="font-bold uppercase tracking-widest text-sm">
                  Introduction Video
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
