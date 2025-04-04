import { Link } from 'wouter';
import { Article, Category } from '@/types';
import ArticleCard from './ArticleCard';
import { ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CategorySectionProps {
  category: Category;
  articles: Article[];
  isLoading?: boolean;
}

export default function CategorySection({ category, articles, isLoading = false }: CategorySectionProps) {
  return (
    <section className="mb-10">
      <div className="border-b border-gray-200 mb-6">
        <h2 className="inline-block text-xl font-bold font-serif pb-3 border-b-2 border-blue-600">{category.name}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array(2).fill(0).map((_, i) => (
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
          articles.slice(0, 2).map(article => (
            <ArticleCard 
              key={article.id} 
              article={article} 
            />
          ))
        )}
      </div>
      
      <div className="mt-6 text-center">
        <Link 
          href={`/category/${category.slug}`} 
          className="inline-flex items-center text-blue-600 font-semibold hover:underline"
        >
          More {category.name} News
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
