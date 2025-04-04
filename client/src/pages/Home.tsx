import { Helmet } from 'react-helmet';
import { useFeaturedArticles, useCategories, useArticlesByCategory } from '@/hooks/useArticles';
import FeaturedStory from '@/components/articles/FeaturedStory';
import TopStories from '@/components/articles/TopStories';
import CategorySection from '@/components/articles/CategorySection';
import LatestNews from '@/components/articles/LatestNews';
import NewsletterSignup from '@/components/utils/NewsletterSignup';
import TrendingTopics from '@/components/utils/TrendingTopics';
import EditorsPicks from '@/components/articles/EditorsPicks';

export default function Home() {
  const { data: featuredArticles, isLoading: isFeaturedLoading } = useFeaturedArticles();
  const { data: categories } = useCategories();
  
  // Get articles for Politics and Technology categories
  const politicsCat = categories?.find(c => c.slug === 'politics');
  const techCat = categories?.find(c => c.slug === 'technology');
  
  const { data: politicsArticles, isLoading: isPoliticsLoading } = useArticlesByCategory(politicsCat?.slug);
  const { data: techArticles, isLoading: isTechLoading } = useArticlesByCategory(techCat?.slug);

  return (
    <>
      <Helmet>
        <title>NewsPortal - Stay Informed with the Latest News</title>
        <meta name="description" content="Get the latest breaking news, in-depth analysis and updates from around the world." />
      </Helmet>
      
      <main className="container mx-auto px-4 py-6">
        {/* Featured Story */}
        {isFeaturedLoading ? (
          <div>Loading featured story...</div>
        ) : featuredArticles && featuredArticles.length > 0 ? (
          <FeaturedStory 
            article={featuredArticles[0]} 
            category={
              categories?.find(c => c.id === featuredArticles[0].categoryId)
            }
          />
        ) : null}

        {/* Top Stories */}
        <TopStories />

        {/* Two column layout for main content and sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2">
            {/* Politics Section */}
            {politicsCat && politicsArticles && (
              <CategorySection 
                category={politicsCat} 
                articles={politicsArticles}
                isLoading={isPoliticsLoading}
              />
            )}

            {/* Technology Section */}
            {techCat && techArticles && (
              <CategorySection 
                category={techCat} 
                articles={techArticles}
                isLoading={isTechLoading}
              />
            )}
          </div>
          
          {/* Sidebar column */}
          <div className="lg:col-span-1">
            {/* Latest News */}
            <LatestNews />
            
            {/* Newsletter */}
            <NewsletterSignup />
            
            {/* Trending Topics */}
            <TrendingTopics />
            
            {/* Editor's Picks */}
            <EditorsPicks />
          </div>
        </div>
      </main>
    </>
  );
}
