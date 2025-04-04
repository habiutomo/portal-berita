// Article types
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  categoryId: number;
  author: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  trending: boolean;
  editorsPick: boolean;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Formatted time types
export type TimeFormat = 'relative' | 'absolute';

// Search types
export interface SearchResult {
  articles: Article[];
  query: string;
}
