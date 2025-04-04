import { Link } from 'wouter';
import { useCategories } from '@/hooks/useArticles';

const TRENDING_TOPICS = [
  "#ClimateAction",
  "#TechInnovation",
  "#GlobalEconomy",
  "#HealthcareReform",
  "#SpaceExploration",
  "#SportsHighlights",
  "#DigitalPrivacy",
  "#MovieReleases",
  "#RenewableEnergy"
];

export default function TrendingTopics() {
  const { data: categories } = useCategories();
  
  return (
    <section className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h2 className="text-xl font-bold font-serif mb-4">Trending Topics</h2>
      
      <div className="flex flex-wrap gap-2">
        {categories?.map(category => (
          <Link 
            key={category.id}
            href={`/category/${category.slug}`} 
            className="bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-blue-600 hover:text-white transition"
          >
            #{category.name}
          </Link>
        ))}
        
        {TRENDING_TOPICS.map(topic => (
          <Link 
            key={topic}
            href={`/search?q=${encodeURIComponent(topic.substring(1))}`}
            className="bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-blue-600 hover:text-white transition"
          >
            {topic}
          </Link>
        ))}
      </div>
    </section>
  );
}
