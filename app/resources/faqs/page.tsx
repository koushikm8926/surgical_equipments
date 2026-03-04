import { createClient } from '@/utils/supabase/server';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function FAQsPage() {
  const supabase = await createClient();
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight mb-6 text-white">Common Questions.</h1>
            <p className="text-xl text-slate-400">
              Everything you need to know about our products, ordering process, and support.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs?.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border rounded-[2rem] px-8 py-2 bg-slate-50/50 data-[state=open]:bg-white data-[state=open]:shadow-xl transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-lg font-bold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base leading-relaxed pb-8">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA */}
          <div className="mt-20 p-12 rounded-[3rem] bg-primary/5 border border-primary/20 text-center">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              If you cannot find the answer you are looking for, please feel free to send us a
              direct message.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:opacity-90 transition-opacity"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
