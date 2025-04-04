import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { useArticleBySlug, useCategoryBySlug, useArticlesByCategory } from '@/hooks/useArticles';
import { format } from 'date-fns';
import { Share, Bookmark, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import ArticleCard from '@/components/articles/ArticleCard';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useArticleBySlug(slug);
  const { toast } = useToast();
  
  // Get category info
  const categorySlug = article ? 
    (useArticleBySlug(slug).data?.categoryId) ? 
      (useCategoryBySlug(useArticleBySlug(slug).data?.categoryId.toString()).data?.slug) : null
    : null;
  
  const { data: relatedArticles } = useArticlesByCategory(categorySlug || undefined);
  
  // Toast handlers
  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      }).catch(error => console.log('Error sharing:', error));
    } else {
      toast({
        title: "Share",
        description: "Sharing options would appear here in a real application",
      });
    }
  };
  
  const handleBookmark = () => {
    toast({
      title: "Bookmarked",
      description: "Article saved to your bookmarks",
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <div className="flex items-center mb-8">
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-80 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const publishedDate = new Date(article.publishedAt);
  
  return (
    <>
      <Helmet>
        <title>{article.title} | NewsPortal</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>
      
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/" className="flex items-center text-gray-500 hover:text-blue-600">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">{article.title}</h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <span>By <span className="font-semibold">{article.author}</span></span>
              <span className="mx-2">•</span>
              <time>{format(publishedDate, 'MMMM d, yyyy')}</time>
              <span className="mx-2">•</span>
              <span>{article.readTime} min read</span>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleShare}
                className="rounded-full h-8 w-8"
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleBookmark}
                className="rounded-full h-8 w-8"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden mb-8">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
          
          <div 
            className="prose max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 1 && (
            <div className="border-t border-gray-200 pt-10">
              <h2 className="text-2xl font-bold font-serif mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles
                  .filter(a => a.id !== article.id)
                  .slice(0, 2)
                  .map(relatedArticle => (
                    <ArticleCard 
                      key={relatedArticle.id} 
                      article={relatedArticle} 
                    />
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
