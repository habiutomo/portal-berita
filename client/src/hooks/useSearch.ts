import { useQuery } from '@tanstack/react-query';
import { Article } from '@/types';

export function useSearchArticles(query: string) {
  return useQuery<Article[]>({
    queryKey: [`/api/search?q=${encodeURIComponent(query)}`],
    enabled: query.length > 0,
  });
}
