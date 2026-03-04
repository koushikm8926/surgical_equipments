import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import { ContactForm } from '@/components/contact/contact-form';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 98765 43210',
      sub: 'Mon-Sat, 10am-7pm',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@surgicalstore.in',
      sub: 'Response within 24 hours',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Medical Plaza, Sector 5',
      sub: 'Kolkata, WB - 700091',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: '10:00 AM - 07:00 PM',
      sub: 'Closed on Sundays',
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-primary font-semibold mb-6 uppercase tracking-widest text-sm">
              <div className="h-px w-8 bg-primary" />
              Contact Us
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
              We are here to help you equip the future.
            </h1>
            <p className="text-xl text-slate-400">
              Have questions about a product or need a bulk quote for your facility? Reach out and
              our experts will get back to you shortly.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Detail Cards */}
            <div>
              <h2 className="text-3xl font-bold mb-10">Get in Touch</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {contactInfo.map((item, i) => (
                  <div key={i} className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50">
                    <div
                      className={`p-4 w-14 h-14 rounded-2xl ${item.color} mb-6 flex items-center justify-center`}
                    >
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-900 font-medium">{item.details}</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-tight font-bold">
                      {item.sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="relative h-80 w-full rounded-[2.5rem] overflow-hidden bg-slate-100 border">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col gap-2">
                  <MapPin className="w-10 h-10" />
                  <span className="font-medium">Interactive Map Integration</span>
                </div>
                {/* Google Maps Embed would go here */}
              </div>
            </div>

            {/* Contact Form Content */}
            <div className="bg-white p-4 rounded-[3rem] border shadow-2xl shadow-slate-200/50">
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Send us a Message</h2>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
