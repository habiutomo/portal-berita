import { Link } from 'wouter';
import { useTrendingArticles, useCategories } from '@/hooks/useArticles';
import ArticleCard from './ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function TopStories() {
  const { data: articles, isLoading } = useTrendingArticles();
  const { data: categories } = useCategories();
  
  const getCategoryForArticle = (categoryId: number) => {
    return categories?.find(category => category.id === categoryId);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-serif">Top Stories</h2>
        <Link href="/top-stories" className="text-blue-600 font-semibold text-sm hover:underline">View All</Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))
        ) : (
          articles?.slice(0, 3).map(article => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              category={getCategoryForArticle(article.categoryId)}
            />
          ))
        )}
      </div>
    </section>
  );
}
