import { Link } from 'wouter';
import { useLatestArticles } from '@/hooks/useArticles';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function LatestNews() {
  const { data: articles, isLoading } = useLatestArticles(5);

  return (
    <section className="bg-white rounded-lg shadow-md mb-8 sticky top-24">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold font-serif">Latest Updates</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))
        ) : (
          articles?.map(article => (
            <article key={article.id} className="p-4 hover:bg-gray-100 transition">
              <span className="text-xs font-semibold text-blue-600 mb-1 block">
                {getTimeAgo(new Date(article.publishedAt))}
              </span>
              <h3 className="font-bold mb-1">
                <Link href={`/article/${article.slug}`} className="hover:text-blue-600 transition">
                  {article.title}
                </Link>
              </h3>
              <p className="text-gray-500 text-sm line-clamp-1">{article.excerpt}</p>
            </article>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Link href="/latest" className="text-blue-600 font-semibold hover:underline flex justify-center items-center">
          View All Updates <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? 'Yesterday' : `${diffInDays} days ago`;
  }
  
  return format(date, 'MMM d, yyyy');
}
