import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, User, Tag, Share2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .single();

  if (!post) return {};

  return {
    title: `${post.title} | Resources`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from('posts').select('*').eq('slug', slug).single();

  if (!post) notFound();

  // Fetch recent posts for sidebar
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('title, slug, published_at')
    .eq('is_published', true)
    .neq('id', post.id)
    .limit(3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Article Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 md:px-8">
          <Link
            href="/resources/blog"
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-12 group"
          >
            <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Articles
          </Link>
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-xs font-bold text-primary uppercase tracking-widest border border-primary/30">
                {post.category}
              </span>
              <span className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                <Calendar className="w-4 h-4" />
                {post.published_at && format(new Date(post.published_at), 'MMMM dd, yyyy')}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-8">
              {post.title}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">{post.excerpt}</p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Article Content */}
            <div className="lg:col-span-8">
              {post.cover_image && (
                <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden border mb-16 shadow-2xl">
                  <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                </div>
              )}

              <div
                className="prose prose-slate prose-lg max-w-none 
                  prose-headings:font-bold prose-headings:tracking-tight 
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-a:text-primary prose-a:font-bold
                  prose-img:rounded-[2rem] prose-img:border prose-img:shadow-lg"
              >
                {/* Since we don't have a markdown parser here, we'll just display original content or a placeholder. 
                      In a real app, you'd use react-markdown or similar. */}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              <div className="mt-20 pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4 text-sm text-slate-500 font-bold uppercase tracking-widest">
                  <Share2 className="w-5 h-5 text-primary" />
                  Share this Article
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" className="rounded-full px-6">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full px-6">
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full px-6">
                    Facebook
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
              {/* Recent Articles */}
              <div className="p-10 rounded-[2.5rem] bg-slate-50 border">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Recent Articles
                </h3>
                <div className="space-y-8">
                  {recentPosts?.map((rp) => (
                    <Link key={rp.slug} href={`/resources/blog/${rp.slug}`} className="group block">
                      <div className="text-xs text-primary font-bold uppercase tracking-tighter mb-2">
                        {rp.published_at && format(new Date(rp.published_at), 'MMM dd')}
                      </div>
                      <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {rp.title}
                      </h4>
                    </Link>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="mt-8 p-0 h-auto font-bold text-primary group"
                  asChild
                >
                  <Link href="/resources/blog">
                    View all posts{' '}
                    <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {/* Consultation CTA */}
              <div className="p-10 rounded-[2.5rem] bg-primary text-primary-foreground relative overflow-hidden group">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">Equipment Consultation</h3>
                  <p className="text-sm opacity-90 mb-8 leading-relaxed">
                    Need help selecting the right tools for your specific medical facility or clinic
                    setup?
                  </p>
                  <Button
                    className="w-full bg-white text-primary font-bold hover:bg-slate-100 h-12 rounded-xl"
                    asChild
                  >
                    <Link href="/contact">Book Now</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

const BookOpen = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);
