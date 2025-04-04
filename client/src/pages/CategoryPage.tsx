import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { useCategoryBySlug, useArticlesByCategory } from '@/hooks/useArticles';
import ArticleCard from '@/components/articles/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: isCategoryLoading } = useCategoryBySlug(slug);
  const { data: articles, isLoading: isArticlesLoading } = useArticlesByCategory(slug);
  
  const isLoading = isCategoryLoading || isArticlesLoading;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <p className="mb-8 text-gray-600">The category you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{category.name} News | NewsPortal</title>
        <meta name="description" content={`Latest ${category.name} news and updates.`} />
      </Helmet>
      
      <main className="container mx-auto px-4 py-10">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/" className="flex items-center text-gray-500 hover:text-blue-600">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold font-serif mb-8">{category.name} News</h1>
        
        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                category={category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600">No articles found in this category.</p>
          </div>
        )}
      </main>
    </>
  );
}
