import { Link } from 'wouter';
import { format } from 'date-fns';
import { Article, Category } from '@/types';
import { Share, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FeaturedStoryProps {
  article: Article;
  category?: Category;
}

export default function FeaturedStory({ article, category }: FeaturedStoryProps) {
  const { toast } = useToast();
  const publishedAt = new Date(article.publishedAt);
  const timeAgo = getTimeAgo(publishedAt);
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: `/article/${article.slug}`
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
  
  return (
    <section className="mb-10">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="order-2 md:order-1">
          {category && (
            <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded mb-3">
              {category.name.toUpperCase()}
            </span>
          )}
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 leading-tight">
            <Link href={`/article/${article.slug}`} className="hover:text-blue-600 transition">
              {article.title}
            </Link>
          </h2>
          <p className="text-gray-600 mb-4 text-lg">
            {article.excerpt}
          </p>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>By <Link href="#" className="font-semibold hover:text-blue-600">{article.author}</Link></span>
            <span className="mx-2">•</span>
            <time>{timeAgo}</time>
            <span className="mx-2">•</span>
            <span>{article.readTime} min read</span>
          </div>
          <div className="flex space-x-3">
            <Button asChild>
              <Link href={`/article/${article.slug}`}>
                Read Full Story
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleShare}
              className="rounded-full"
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleBookmark}
              className="rounded-full"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Link href={`/article/${article.slug}`}>
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-auto transition-transform duration-500 hover:scale-105"
              />
            </Link>
          </div>
        </div>
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
