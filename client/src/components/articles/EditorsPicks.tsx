import { Link } from 'wouter';
import { useEditorsPickArticles } from '@/hooks/useArticles';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditorsPicks() {
  const { data: articles, isLoading } = useEditorsPickArticles();

  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold font-serif">Editor's Picks</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex p-4 gap-3">
              <Skeleton className="flex-shrink-0 w-20 h-20 rounded-md" />
              <div className="flex-grow">
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))
        ) : (
          articles?.slice(0, 3).map(article => (
            <article key={article.id} className="flex p-4 gap-3 hover:bg-gray-100 transition">
              <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold mb-1 text-sm">
                  <Link href={`/article/${article.slug}`} className="hover:text-blue-600 transition">
                    {article.title}
                  </Link>
                </h3>
                <span className="text-xs text-gray-500">Long read • {article.readTime} min</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
