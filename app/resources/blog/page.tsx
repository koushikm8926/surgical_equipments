import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default async function BlogListingPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight mb-6">Medical Insights & News.</h1>
            <p className="text-xl text-slate-400">
              Expert articles on surgical technology, rehabilitation trends, and facility
              management.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts?.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col h-full bg-white border rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500"
              >
                <Link
                  href={`/resources/blog/${post.slug}`}
                  className="relative aspect-[16/10] overflow-hidden bg-slate-100 block"
                >
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                      <Image
                        src="/next.svg"
                        alt="placeholder"
                        width={100}
                        height={40}
                        className="opacity-20"
                      />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-primary uppercase tracking-widest shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-medium uppercase tracking-tighter">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.published_at && format(new Date(post.published_at), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/resources/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-slate-500 line-clamp-3 mb-8 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary font-bold group/btn"
                      asChild
                    >
                      <Link href={`/resources/blog/${post.slug}`}>
                        Read More
                        <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {(!posts || posts.length === 0) && (
            <div className="text-center py-32 rounded-[3rem] bg-slate-50 border border-dashed">
              <p className="text-slate-400 font-medium">No blog posts found. Check back later!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
