import { useQuery } from '@tanstack/react-query';
import { Article, Category } from '@/types';

export function useAllArticles() {
  return useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });
}

export function useFeaturedArticles() {
  return useQuery<Article[]>({
    queryKey: ['/api/articles/featured'],
  });
}

export function useTrendingArticles() {
  return useQuery<Article[]>({
    queryKey: ['/api/articles/trending'],
  });
}

export function useLatestArticles(limit: number = 10) {
  return useQuery<Article[]>({
    queryKey: [`/api/articles/latest?limit=${limit}`],
  });
}

export function useEditorsPickArticles() {
  return useQuery<Article[]>({
    queryKey: ['/api/articles/editors-picks'],
  });
}

export function useArticleBySlug(slug: string | undefined) {
  return useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
}

export function useCategoryBySlug(slug: string | undefined) {
  return useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
    enabled: !!slug,
  });
}

export function useArticlesByCategory(categorySlug: string | undefined) {
  return useQuery<Article[]>({
    queryKey: [`/api/categories/${categorySlug}/articles`],
    enabled: !!categorySlug,
  });
}
