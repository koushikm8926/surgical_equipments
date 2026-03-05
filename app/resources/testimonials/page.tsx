import { createClient } from '@/utils/supabase/server';
import { Star, Quote } from 'lucide-react';

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  const mockTestimonials = [
    {
      id: 'mock-1',
      name: 'Dr. Ayesha Rahman',
      role: 'Chief Surgeon, Metro Heart Institute',
      content:
        'The precision scalpel sets and hemostatic forceps we sourced from SurgicalStore have exceeded our expectations. Excellent grip and durability through multiple sterilization cycles.',
      rating: 5,
    },
    {
      id: 'mock-2',
      name: 'Rajesh Kumar',
      role: 'Procurement Head, City Care Hospital',
      content:
        'We outfitted our entire new post-op ward with their adjustable patient beds. The quality is phenomenal, and the delivery was exactly on schedule. Highly recommended for bulk hospital purchases.',
      rating: 5,
    },
    {
      id: 'mock-3',
      name: 'Dr. Vikram Singh',
      role: 'Lead Physiotherapist, Elite Rehab Center',
      content:
        'The digital TENS machines and ultrasound units have become central to our healing protocols. They are robust, easy for the staff to operate, and yield consistent clinical results.',
      rating: 4,
    },
    {
      id: 'mock-4',
      name: 'Priya Desai',
      role: 'Clinic Manager, Desai Orthopedics',
      content:
        "Their customer service is unmatched. When we needed an urgent replacement part for a surgical trolley, they shipped it overnight. It's rare to find such reliable vendor partners.",
      rating: 5,
    },
  ];

  const displayTestimonials =
    testimonials && testimonials.length > 0 ? testimonials : mockTestimonials;

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight mb-6">Client Testimonials.</h1>
            <p className="text-xl text-slate-400">
              Hear what healthcare professionals and facility managers have to say about our
              equipment and service quality.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          {!displayTestimonials || displayTestimonials.length === 0 ? (
            <div className="text-center py-32 rounded-[3rem] bg-white border border-dashed">
              <p className="text-slate-400 font-medium">No testimonials available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {displayTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white p-10 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group"
                >
                  <Quote className="absolute -top-4 -right-4 w-32 h-32 text-slate-50 opacity-50 group-hover:text-primary/5 transition-colors pointer-events-none" />

                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < (testimonial.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 fill-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-lg text-slate-700 leading-relaxed mb-8 relative z-10 italic">
                    &quot;{testimonial.content}&quot;
                  </p>

                  <div className="mt-auto relative z-10">
                    <h3 className="font-bold text-slate-900">{testimonial.name}</h3>
                    {testimonial.role && (
                      <p className="text-sm text-slate-500 font-medium">{testimonial.role}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
