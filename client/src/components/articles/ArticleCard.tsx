import { format } from 'date-fns';
import { Article, Category } from '@/types';
import { Link } from 'wouter';

interface ArticleCardProps {
  article: Article;
  category?: Category;
  variant?: 'default' | 'small';
}

export default function ArticleCard({ article, category, variant = 'default' }: ArticleCardProps) {
  const publishedAt = new Date(article.publishedAt);
  const timeAgo = getTimeAgo(publishedAt);
  
  if (variant === 'small') {
    return (
      <article className="flex p-4 gap-3 hover:bg-gray-100 transition">
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
          <span className="text-xs text-gray-500">{article.readTime} min read</span>
        </div>
      </article>
    );
  }
  
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:translate-y-[-5px] transition-transform duration-200">
      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {category && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold py-1 px-2 rounded">
            {category.name}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 font-serif">
          <Link href={`/article/${article.slug}`} className="hover:text-blue-600 transition">
            {article.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center text-xs text-gray-500">
          <time>{timeAgo}</time>
          <span className="mx-2">•</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </article>
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
