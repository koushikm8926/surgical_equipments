import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, FileText, Download, ExternalLink } from 'lucide-react';

export default async function EducationalLibraryPage() {
  const supabase = await createClient();
  const { data: resources } = await supabase
    .from('library_resources')
    .select('*')
    .order('display_order', { ascending: true });

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-5 h-5" />;
      case 'manual':
        return <FileText className="w-5 h-5" />;
      case 'infographic':
        return <Download className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Watch Video';
      case 'manual':
        return 'Read Manual';
      case 'infographic':
        return 'View Infographic';
      default:
        return 'Open Resource';
    }
  };

  const mockResources = [
    {
      id: 'mock-lib-3',
      title: 'Digital TENS Machine Field Manual',
      description:
        'Complete operation manual including safety warnings, electrode placement, and maintenance.',
      type: 'manual',
      url: '#',
      thumbnail_url: null,
      category: 'Equipment Setup',
    },
    {
      id: 'mock-lib-4',
      title: 'Sterilization Guidelines Chart',
      description:
        'Quick-reference infographic for autoclave temperature and pressure settings by material type.',
      type: 'infographic',
      url: '#',
      thumbnail_url:
        'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=800&auto=format&fit=crop',
      category: 'Safety & Maintenance',
    },
  ];

  const displayResources = resources && resources.length > 0 ? resources : mockResources;

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight mb-6">Educational Library.</h1>
            <p className="text-xl text-slate-400">
              Access product manuals and safety infographics for your medical equipment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          {!displayResources || displayResources.length === 0 ? (
            <div className="text-center py-32 rounded-[3rem] bg-white border border-dashed">
              <p className="text-slate-400 font-medium">No library resources available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayResources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-white rounded-[2.5rem] border overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-video bg-slate-100 flex-shrink-0">
                    {resource.thumbnail_url ? (
                      <Image
                        src={resource.thumbnail_url}
                        alt={resource.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-300">
                        {getIcon(resource.type)}
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm flex items-center gap-1.5">
                        {getIcon(resource.type)}
                        {resource.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {resource.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                      {resource.description}
                    </p>
                    <div className="flex items-center text-primary font-bold text-sm mt-auto">
                      {getLabel(resource.type)}
                      <ExternalLink className="ml-2 w-4 h-4 opacity-50" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
