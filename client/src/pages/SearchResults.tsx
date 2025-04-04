import { useLocation, Link } from 'wouter';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchArticles } from '@/hooks/useSearch';
import { useCategories } from '@/hooks/useArticles';
import ArticleCard from '@/components/articles/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft } from 'lucide-react';

export default function SearchResults() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  
  const { data: articles, isLoading } = useSearchArticles(submittedQuery);
  const { data: categories } = useCategories();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
  };
  
  const getCategoryForArticle = (categoryId: number) => {
    return categories?.find(category => category.id === categoryId);
  };
  
  return (
    <>
      <Helmet>
        <title>{submittedQuery ? `Search: ${submittedQuery}` : 'Search'} | NewsPortal</title>
        <meta name="description" content={`Search results for ${submittedQuery}`} />
      </Helmet>
      
      <main className="container mx-auto px-4 py-10">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/" className="flex items-center text-gray-500 hover:text-blue-600">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold font-serif mb-6">Search</h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search news..."
              className="w-full py-3 pl-4 pr-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </form>
        
        {submittedQuery && (
          <h2 className="text-xl font-bold mb-6">
            Results for: <span className="text-blue-600">"{submittedQuery}"</span>
          </h2>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
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
        ) : (
          <>
            {!submittedQuery ? (
              <div className="text-center py-10">
                <p className="text-gray-600">Enter a search term to find articles.</p>
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    category={getCategoryForArticle(article.categoryId)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600">No articles found matching "{submittedQuery}".</p>
                <p className="text-gray-500 mt-2">Try different keywords or browse our categories.</p>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
