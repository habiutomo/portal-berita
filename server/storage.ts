import { articles, type Article, type InsertArticle } from "@shared/schema";
import { categories, type Category, type InsertCategory } from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Articles
  getArticles(): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getFeaturedArticles(): Promise<Article[]>;
  getTrendingArticles(): Promise<Article[]>;
  getLatestArticles(limit?: number): Promise<Article[]>;
  getEditorsPickArticles(): Promise<Article[]>;
  getArticlesByCategory(categoryId: number): Promise<Article[]>;
  getArticlesByCategorySlug(categorySlug: string): Promise<Article[]>;
  searchArticles(query: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Users (keeping the original functionality)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private categories: Map<number, Category>;
  
  // Track current IDs for each entity
  private currentUserId: number;
  private currentArticleId: number;
  private currentCategoryId: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.categories = new Map();
    
    this.currentUserId = 1;
    this.currentArticleId = 1;
    this.currentCategoryId = 1;
    
    // Initialize with some sample categories
    // We're calling async method in constructor, which is generally not recommended,
    // but this is a simple demo app so we'll make it work
    this.initializeData().catch(err => {
      console.error("Error initializing data:", err);
    });
  }

  private async initializeData() {
    // Create categories
    const categoryData: InsertCategory[] = [
      { name: "Politics", slug: "politics" },
      { name: "Business", slug: "business" },
      { name: "Technology", slug: "technology" },
      { name: "Science", slug: "science" },
      { name: "Health", slug: "health" },
      { name: "Sports", slug: "sports" },
      { name: "Entertainment", slug: "entertainment" },
      { name: "World", slug: "world" },
      { name: "Lifestyle", slug: "lifestyle" },
      { name: "Opinion", slug: "opinion" }
    ];
    
    // Create categories and store their IDs
    const categoryIds: Record<string, number> = {};
    
    // Create categories sequentially (cannot use forEach with async functions)
    for (const cat of categoryData) {
      const category = await this.createCategory(cat);
      categoryIds[cat.slug] = category.id;
    }
    
    // Create sample articles
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const yesterdayDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    
    // Main featured article
    await this.createArticle({
      title: "Global Climate Summit Reaches Landmark Agreement on Emissions",
      slug: "global-climate-summit-agreement",
      excerpt: "World leaders have agreed to an unprecedented reduction in carbon emissions, setting new targets that could dramatically slow climate change over the next decade.",
      content: `<p>In a historic moment for international climate policy, world leaders at the Global Climate Summit have reached a landmark agreement to significantly reduce carbon emissions worldwide.</p>
      <p>The agreement, which comes after intense negotiations, commits nations to cut their carbon emissions by an unprecedented 50% by 2030, with a goal of achieving net-zero emissions by 2050.</p>
      <p>"This is a turning point for our planet," said United Nations Secretary-General in his closing remarks. "For the first time, we have a truly global commitment that matches the scale of the crisis we face."</p>
      <p>The agreement includes provisions for financial support to developing nations to help them transition to clean energy sources and adapt to the impacts of climate change that are already being felt around the world.</p>
      <p>Climate scientists have welcomed the deal, calling it "ambitious but necessary" given the accelerating pace of global warming and its effects, which include more frequent and severe weather events, rising sea levels, and threats to biodiversity.</p>
      <p>The summit also saw the launch of several major initiatives to boost renewable energy adoption, protect forests, and develop new technologies for carbon capture and storage.</p>
      <p>Implementation of the agreement will be monitored through a robust reporting system, with countries required to provide regular updates on their progress towards meeting their emissions reduction targets.</p>
      <p>However, some environmental groups have expressed concern that the agreement still falls short of what is needed to limit global warming to 1.5 degrees Celsius above pre-industrial levels, as recommended by the Intergovernmental Panel on Climate Change.</p>
      <p>"While this is a significant step forward, we need to be clear that more ambitious action will be required in the coming years," said the director of a leading environmental organization.</p>
      <p>The next Global Climate Summit is scheduled for two years from now, where countries will be expected to further strengthen their commitments based on the latest scientific assessments.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1623865611284-35a562c6949c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      categoryId: categoryIds["world"],
      author: "Sarah Johnson",
      publishedAt: threeHoursAgo,
      readTime: 5,
      featured: true,
      trending: true,
      editorsPick: false
    });
    
    // Top stories
    await this.createArticle({
      title: "Tech Giant Unveils Revolutionary AI Assistant for Healthcare",
      slug: "tech-ai-assistant-healthcare",
      excerpt: "The new AI system can analyze medical records and help doctors diagnose complex conditions with greater accuracy than previous technologies.",
      content: `<p>One of the world's leading technology companies has unveiled a groundbreaking artificial intelligence assistant specifically designed for healthcare professionals, potentially transforming how medical diagnoses are made.</p>
      <p>The AI system, which has been in development for over three years, can analyze patient medical records, lab results, and imaging studies to help doctors identify patterns and make connections that might otherwise be missed.</p>
      <p>In clinical trials, the system demonstrated a remarkable 90% accuracy rate in diagnosing complex conditions, outperforming many experienced physicians in certain specialized areas.</p>
      <p>"This isn't about replacing doctors," said the company's Chief Medical Officer. "It's about giving them a powerful new tool that can help them make better decisions faster, especially in complex cases where multiple factors need to be considered."</p>
      <p>The AI assistant has been trained on millions of anonymized medical records and has the ability to stay current with the latest medical research by continuously scanning and incorporating findings from newly published studies.</p>
      <p>Healthcare providers who have participated in early testing of the system report that it has helped them identify rare conditions and unexpected drug interactions that might otherwise have been overlooked.</p>
      <p>The technology has received preliminary approval from regulatory authorities for use as a decision-support tool, though final clearance is still pending additional real-world testing.</p>
      <p>Privacy advocates have raised concerns about the handling of sensitive medical data, though the company insists that robust protections are in place to ensure patient confidentiality and compliance with healthcare privacy laws.</p>
      <p>The system is expected to be deployed initially in major academic medical centers before being rolled out more broadly to hospitals and clinics nationwide.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1586880244406-8b640d5ba770?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["technology"],
      author: "Michael Chen",
      publishedAt: this.fiveHoursAgo,
      readTime: 4,
      featured: false,
      trending: true,
      editorsPick: false
    });
    
    await this.createArticle({
      title: "Markets Surge as Inflation Numbers Show Promising Decline",
      slug: "markets-surge-inflation-decline",
      excerpt: "Investors responded positively as the latest economic data suggests inflation may finally be under control after months of concern.",
      content: `<p>Stock markets worldwide experienced a significant rally today as newly released economic data indicated a larger-than-expected decline in inflation rates across major economies.</p>
      <p>The Consumer Price Index (CPI) report showed inflation decreased to 3.2% annually, down from 4.1% the previous month and well below the 3.6% forecast by economists.</p>
      <p>Major stock indices responded with enthusiasm, with the S&P 500 gaining 2.3%, the Nasdaq Composite up 2.9%, and European markets posting similar gains.</p>
      <p>"This is the clearest sign yet that the central banks' monetary tightening policies are working," said a chief economist at a leading investment firm. "The data suggests we may be able to achieve the much-desired 'soft landing' where inflation is brought under control without triggering a recession."</p>
      <p>The bond market also reacted strongly, with yields falling as investors adjusted their expectations regarding future interest rate decisions by the Federal Reserve and other central banks.</p>
      <p>Particularly notable was the performance of technology and growth stocks, which had been hit hardest during the inflation fears of recent months. Several major tech companies saw their share prices rise by 4% or more.</p>
      <p>Consumer sentiment data released alongside the inflation figures also showed improvement, with households reporting increased optimism about economic conditions and their personal financial situations.</p>
      <p>However, some market analysts cautioned against excessive optimism, noting that one month of positive data does not necessarily indicate a long-term trend.</p>
      <p>"We're certainly encouraged by these numbers, but we'll need to see sustained improvement over several months before concluding that the inflation problem has been solved," commented a Federal Reserve official who requested anonymity.</p>
      <p>The next set of inflation data is eagerly anticipated by investors and policymakers alike, as it will help determine whether today's market rally represents the beginning of a new bull market or merely a temporary reprieve.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["business"],
      author: "Jennifer Wu",
      publishedAt: yesterdayDate,
      readTime: 3,
      featured: false,
      trending: true,
      editorsPick: false
    });
    
    await this.createArticle({
      title: "Underdog Team Makes Historic Championship Run",
      slug: "underdog-team-championship-run",
      excerpt: "Against all odds, the team has secured their place in the finals after a season that began with predictions of failure from most analysts.",
      content: `<p>In what sports commentators are already calling one of the greatest underdog stories in recent memory, a team that was widely predicted to finish at the bottom of the standings has secured their place in the championship finals.</p>
      <p>The remarkable journey began at the start of the season when the team was rated as having less than a 1% chance of making the playoffs according to most analytical models. They had lost several key players to free agency and trades, and their roster was composed primarily of young, unproven talent and veterans considered past their prime.</p>
      <p>"Nobody believed in us except the guys in our locker room," said the team captain after their semifinal victory. "We used all that doubt as motivation every single day."</p>
      <p>Their success has been attributed to a combination of innovative tactical approaches from their first-year head coach, unexpected breakout performances from rookie players, and a team chemistry that has become the envy of the league.</p>
      <p>Particularly notable has been their performance in close games, where they've shown remarkable resilience, winning an unprecedented 15 games this season by 5 points or fewer.</p>
      <p>The team's journey has captivated fans nationwide, with their merchandise sales increasing by over 300% since the playoffs began and television ratings for their games reaching record highs.</p>
      <p>"What we're witnessing is more than just sports," commented a prominent sports psychologist. "It's a powerful example of how collective belief and determination can overcome seemingly insurmountable odds, and that resonates with people far beyond the world of athletics."</p>
      <p>The championship finals begin next week, where they will face the defending champions who have dominated the league for the past three seasons. Despite their incredible run, the underdog team once again finds themselves as heavy underdogs according to oddsmakers.</p>
      <p>"That's just fine with us," smiled their coach when informed of the betting lines. "Being underdogs is where we're most comfortable."</p>`,
      imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["sports"],
      author: "Marcus Johnson",
      publishedAt: this.oneDayAgo,
      readTime: 4,
      featured: false,
      trending: true,
      editorsPick: false
    });
    
    // Category articles - Politics
    await this.createArticle({
      title: "Senate Passes Landmark Infrastructure Bill",
      slug: "senate-passes-infrastructure-bill",
      excerpt: "The $1.2 trillion package includes funding for roads, bridges, public transit, broadband, and other critical infrastructure needs.",
      content: `<p>After months of negotiation and debate, the Senate has passed a landmark $1.2 trillion infrastructure bill, representing one of the largest investments in the nation's infrastructure in decades.</p>
      <p>The bipartisan legislation, which passed with a vote of 69-30, allocates funding for a wide range of infrastructure projects across the country, including $110 billion for roads and bridges, $66 billion for passenger and freight rail, $65 billion for broadband internet, and $55 billion for water infrastructure.</p>
      <p>"This is a historic day for our country," said the Senate Majority Leader following the vote. "This bill will create good-paying jobs, help American businesses compete in the 21st century, and make our economy stronger and more resilient for generations to come."</p>
      <p>The bill's passage represents a significant legislative victory for the administration, which had made infrastructure investment a central campaign promise and a top priority upon taking office.</p>
      <p>In addition to traditional infrastructure projects, the legislation includes substantial funding for addressing climate change, with $7.5 billion allocated for electric vehicle charging stations and $5 billion for electric school buses.</p>
      <p>The bill also provides $65 billion to modernize the nation's electrical grid, which experts say is essential for increasing renewable energy capacity and improving resilience against extreme weather events.</p>
      <p>The legislation now moves to the House of Representatives, where it faces a more uncertain path. Progressive members have expressed concerns that the bill doesn't go far enough in addressing climate change and social equity issues, while some moderate members have raised concerns about the overall cost.</p>
      <p>House leadership has indicated that they plan to link the infrastructure bill to a larger reconciliation package containing additional spending priorities, a strategy that could complicate its final passage.</p>
      <p>If signed into law, the infrastructure investments would be implemented over the next five years, with some projects beginning as soon as 2022.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["politics"],
      author: "Robert Anderson",
      publishedAt: twoDaysAgo,
      readTime: 5,
      featured: false,
      trending: false,
      editorsPick: false
    });
    
    await this.createArticle({
      title: "New Poll Shows Shifting Voter Priorities Ahead of Midterms",
      slug: "new-poll-voter-priorities-midterms",
      excerpt: "Economy and healthcare remain top concerns, but environmental issues are gaining prominence among younger voters.",
      content: `<p>A newly released national poll indicates significant shifts in voter priorities ahead of the upcoming midterm elections, with economic concerns remaining dominant but other issues gaining ground among specific demographic groups.</p>
      <p>The survey, conducted by a leading polling organization, found that 42% of likely voters identified the economy as their top concern, followed by healthcare at 18% and immigration at
      <p>environmental concerns and climate change policy have surged in importance, particularly among voters under 35, where it now ranks as the second most important issue behind the economy. This represents a 12-point increase from similar polling conducted just two years ago.</p>
      <p>"What we're seeing is a significant generational divide in issue priorities," explained the polling director. "Younger voters are increasingly viewing climate policy as an existential issue that will define their future, while older voters remain more focused on traditional economic and healthcare concerns."</p>
      <p>The poll also found growing concern about democratic institutions and election integrity across the political spectrum, though with different emphases depending on party affiliation.</p>
      <p>Another notable finding was the increased importance of affordable housing, which has risen to become a top-five issue nationally and ranks even higher in urban areas and coastal states where housing costs have risen dramatically.</p>
      <p>Political strategists from both major parties are studying the results closely as they refine their messaging for the upcoming campaign season.</p>
      <p>"These shifts in voter priorities could have significant implications for which party performs better in the midterms," commented a political science professor not involved in conducting the poll. "The party that best aligns its platform and messaging with these evolving concerns will have an advantage."</p>
      <p>The poll surveyed 2,500 likely voters nationwide and has a margin of error of ±2.2 percentage points.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["politics"],
      author: "Amanda Chen",
      publishedAt: threeDaysAgo,
      readTime: 4,
      featured: false,
      trending: false,
      editorsPick: true
    });
    
    // Category articles - Technology
    await this.createArticle({
      title: "Major Security Vulnerability Discovered in Popular Software",
      slug: "security-vulnerability-popular-software",
      excerpt: "Experts urge immediate updates as researchers find critical flaw that could allow unauthorized access to sensitive data.",
      content: `<p>Cybersecurity researchers have discovered a critical security vulnerability in widely used software that could potentially expose sensitive data for millions of users worldwide.</p>
      <p>The vulnerability, which has been assigned the highest severity rating by the National Vulnerability Database, affects all versions of the software released in the past three years and is already being actively exploited by malicious actors according to multiple security firms.</p>
      <p>"This is as serious as it gets," said the chief security officer at a leading cybersecurity company. "The vulnerability allows attackers to gain complete control of affected systems with minimal effort and without requiring any user interaction."</p>
      <p>The software vendor has released an emergency patch to address the vulnerability and is urging all users to update immediately. Major government agencies, including the Cybersecurity and Infrastructure Security Agency, have issued rare emergency directives requiring all federal agencies to patch their systems within 24 hours.</p>
      <p>Security experts are particularly concerned because the affected software is used across multiple industries, including banking, healthcare, energy, and government sectors. Organizations that process sensitive personal data or operate critical infrastructure are at particularly high risk.</p>
      <p>Initial reports indicate that several high-profile breaches reported in recent weeks may be connected to this vulnerability, though investigations are still ongoing.</p>
      <p>For individual users, security professionals recommend installing all available updates immediately, enabling two-factor authentication on all accounts where available, and monitoring financial statements and credit reports for any suspicious activity.</p>
      <p>The discovery has renewed calls from security advocates for improved vulnerability disclosure processes and increased investment in secure software development practices.</p>
      <p>"This incident highlights the critical importance of incorporating security at every stage of software development, rather than treating it as an afterthought," commented a professor of computer security at a major technology university.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["technology"],
      author: "David Wong",
      publishedAt: this.oneDayAgo,
      readTime: 3,
      featured: false,
      trending: false,
      editorsPick: false
    });
    
    await this.createArticle({
      title: "Breakthrough in Battery Technology Could Extend EV Range",
      slug: "battery-technology-breakthrough-ev-range",
      excerpt: "New developments promise to double the range of electric vehicles while reducing charging time to just 10 minutes.",
      content: `<p>Scientists at a leading research laboratory have announced a breakthrough in battery technology that could potentially revolutionize the electric vehicle industry by dramatically increasing range and reducing charging times.</p>
      <p>The new battery design, which utilizes a novel solid-state electrolyte and silicon-based anode, has demonstrated energy density more than twice that of current lithium-ion batteries in laboratory testing, potentially allowing electric vehicles to travel up to 600 miles on a single charge.</p>
      <p>Even more impressively, the technology supports ultra-fast charging, with prototype batteries reaching 80% capacity in just 10 minutes without significant degradation or safety concerns.</p>
      <p>"This represents a step-change in what's possible for electric vehicles," said the lead researcher. "The two biggest barriers to EV adoption have been range anxiety and charging time. This technology addresses both challenges simultaneously."</p>
      <p>In addition to improved performance, the new batteries are expected to be safer than current designs, with virtually no risk of the thermal runaway issues that have caused fires in some lithium-ion batteries. They also use fewer rare earth materials, potentially reducing environmental impact and manufacturing costs.</p>
      <p>Several major automakers have already expressed interest in the technology, with one leading electric vehicle manufacturer announcing a strategic partnership to accelerate commercialization.</p>
      <p>Industry analysts suggest that if the technology can be successfully scaled up for mass production, it could accelerate the transition away from internal combustion engines and help countries meet their carbon reduction targets years ahead of current projections.</p>
      <p>"The impact could extend well beyond personal transportation," noted an energy policy expert. "These batteries could also transform grid storage, making renewable energy more reliable and enabling the electrification of sectors that have been difficult to decarbonize, such as heavy transport and shipping."</p>
      <p>The researchers caution that it typically takes 5-7 years to move from laboratory breakthrough to commercial production, but they believe this timeline could be accelerated with sufficient investment and industry collaboration.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["technology"],
      author: "Jessica Park",
      publishedAt: twoDaysAgo,
      readTime: 4,
      featured: false,
      trending: false,
      editorsPick: true
    });
    
    // Latest articles
    await this.createArticle({
      title: "US Federal Reserve Signals Potential Interest Rate Changes",
      slug: "federal-reserve-interest-rate-changes",
      excerpt: "Markets react as Fed chair comments on inflation trends during press conference.",
      content: `<p>The Federal Reserve has signaled a potential shift in its interest rate policy following its latest meeting, causing significant movements in financial markets.</p>
      <p>During a closely watched press conference, the Fed Chair indicated that the central bank is closely monitoring recent inflation data and may adjust its monetary policy approach if current trends continue.</p>
      <p>"We remain committed to our dual mandate of maximum employment and price stability," the Chair stated. "Recent data suggests we may be reaching a point where some adjustment to our policy stance could be warranted."</p>
      <p>While stopping short of explicitly announcing future rate changes, analysts interpreted the comments as suggesting that a rate cut could come sooner than previously expected if inflation continues to moderate.</p>
      <p>Markets responded immediately to the remarks, with the S&P 500 gaining 1.2% and Treasury yields declining across maturities. The dollar weakened against major currencies, particularly the euro and yen.</p>
      <p>The central bank's latest economic projections, released alongside the policy statement, showed a slightly more optimistic outlook for inflation compared to previous forecasts, while maintaining a cautious view on economic growth.</p>
      <p>Several Fed officials have recently expressed concern about overtightening monetary policy, suggesting a growing debate within the Federal Open Market Committee about the appropriate path forward.</p>
      <p>Economists at major financial institutions are now revising their rate forecasts, with several moving up their predictions for the first rate cut by one quarter.</p>
      <p>"The tone has definitely shifted," commented a chief economist at a major bank. "While they're being careful not to commit to a specific timeline, the door is now clearly open for policy easing if the data cooperates."</p>`,
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["business"],
      author: "Thomas Williams",
      publishedAt: this.tenMinutesAgo,
      readTime: 3,
      featured: false,
      trending: false,
      editorsPick: false
    });
    
    await this.createArticle({
      title: "Scientists Identify Promising Treatment for Rare Disease",
      slug: "scientists-treatment-rare-disease",
      excerpt: "Early trials show 80% effectiveness in treating previously incurable condition.",
      content: `<p>Scientists have announced a breakthrough in the treatment of a rare genetic disease that has previously had no effective therapies, offering hope to thousands of affected patients worldwide.</p>
      <p>The experimental treatment, which utilizes an innovative gene-editing approach, has shown remarkable results in early clinical trials, with approximately 80% of patients experiencing significant improvement in symptoms and quality of life.</p>
      <p>"These results far exceeded our expectations," said the principal investigator of the study. "For many patients in the trial, this intervention has transformed what was previously a debilitating condition into something manageable."</p>
      <p>The disease affects approximately 1 in 50,000 people globally and causes progressive neurological deterioration, typically beginning in early childhood and leading to severe disability by early adulthood.</p>
      <p>The treatment works by delivering a modified virus that carries genetic instructions to correct the underlying mutation responsible for the disease. Once inside affected cells, particularly in the central nervous system, the treatment enables the production of a crucial protein that patients otherwise lack.</p>
      <p>What makes this approach particularly promising is its apparent durability, with patients from the earliest treatment cohort now maintaining improvements for over two years without requiring additional interventions.</p>
      <p>Regulatory authorities have already granted the therapy breakthrough and priority review designations, potentially expediting its availability to patients outside of clinical trials.</p>
      <p>The research team is now planning a larger Phase 3 trial while simultaneously working to optimize the treatment protocol to improve efficacy even further.</p>
      <p>"This represents the culmination of over a decade of research," noted the director of the research institute where much of the foundational work was conducted. "It demonstrates the value of sustained investment in understanding the basic mechanisms of rare diseases, which can eventually lead to transformative treatments."</p>`,
      imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["health"],
      author: "Emily Wilson",
      publishedAt: this.thirtyFiveMinutesAgo,
      readTime: 4,
      featured: false,
      trending: false,
      editorsPick: false
    });
    
    await this.createArticle({
      title: "Major Film Studio Announces Slate of New Productions",
      slug: "film-studio-new-productions",
      excerpt: "Highly anticipated sequels and original projects from award-winning directors.",
      content: `<p>One of Hollywood's most prominent film studios has unveiled an ambitious slate of upcoming productions, including long-awaited sequels to beloved franchises and original projects from some of the industry's most acclaimed filmmakers.</p>
      <p>The announcement, made during a special presentation to investors and media, includes more than 20 films scheduled for release over the next three years, representing a significant investment in theatrical exhibition despite ongoing disruption in the entertainment industry.</p>
      <p>"We remain bullish on the future of theatrical cinema," said the studio's CEO during the presentation. "While we continue to develop our streaming strategy, we believe strongly that the shared experience of watching films in theaters remains irreplaceable and valuable."</p>
      <p>Among the most anticipated projects is a sequel to an Oscar-winning science fiction film from 2019, with the original director returning along with most of the principal cast. The studio also confirmed development of the next installment in its most successful action franchise, scheduled for summer release next year.</p>
      <p>In addition to extending established properties, the studio announced several original films from renowned directors, including an epic historical drama from a recent Best Director winner and a psychological thriller from an acclaimed international filmmaker making their English-language debut.</p>
      <p>The lineup reflects a deliberate strategy to balance commercial entertainment with prestige productions aimed at awards consideration, a approach that has served the studio well in recent years.</p>
      <p>Several of the announced projects will implement cutting-edge production technologies, including an extended reality virtual production platform that allows for realistic environments to be created in-studio rather than on location.</p>
      <p>The studio also emphasized its commitment to improving representation both in front of and behind the camera, announcing specific initiatives to increase diversity among directors, writers, and department heads.</p>
      <p>Industry analysts responded positively to the announcement, with the studio's stock price rising 3.5% following the presentation. "They've struck the right balance between capitalizing on their intellectual property and investing in fresh creative voices," commented a media industry analyst.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["entertainment"],
      author: "Jason Rodriguez",
      publishedAt: this.oneHourAgo,
      readTime: 3,
      featured: false,
      trending: false,
      editorsPick: false
    });
    
    // Editor's picks
    await this.createArticle({
      title: "How Sustainable Farming Methods Are Changing Agriculture",
      slug: "sustainable-farming-methods-agriculture",
      excerpt: "Innovative approaches to agriculture are helping farmers reduce environmental impact while improving crop yields.",
      content: `<p>Across the global agricultural landscape, a quiet revolution is taking place as farmers increasingly adopt sustainable practices that promise to transform food production for generations to come.</p>
      <p>These innovative approaches aim to address the dual challenges of feeding a growing world population while reducing agriculture's environmental footprint, which currently accounts for approximately 25% of global greenhouse gas emissions and 70% of freshwater usage.</p>
      <p>One of the most promising developments has been the widespread adoption of regenerative agriculture, a set of farming principles and practices that focuses on rehabilitating and enhancing the entire ecosystem of the farm by placing a heavy premium on soil health.</p>
      <p>"Healthy soil is the foundation of everything," explains a fourth-generation farmer who transitioned to regenerative practices five years ago. "When we stopped tilling and started using cover crops, we saw dramatic improvements not just in our yields, but in the farm's resilience to both drought and flooding."</p>
      <p>Data from long-term studies supports these observations, with farms practicing regenerative agriculture demonstrating 78% higher carbon sequestration and 43% more topsoil than conventional farms in the same regions.</p>
      <p>Precision agriculture technologies are complementing these approaches by enabling more targeted use of resources. Advanced sensors, drone imagery, and AI-powered analytics allow farmers to apply water, fertilizers, and pest control measures only where and when they're needed, reducing waste and environmental impact.</p>
      <p>These technologies have shown particular promise for smallholder farmers in developing regions, where simple smartphone applications can provide crucial soil and weather data that was previously inaccessible.</p>
      <p>Equally significant has been the development of agroforestry systems, which integrate trees and shrubs into crop and animal farming systems. These approaches create more diverse, productive, profitable, healthy, and sustainable land-use systems.</p>
      <p>"The old model pitted agricultural productivity against environmental protection," notes an agricultural economist studying these transitions. "What's exciting about today's innovations is that they're increasingly demonstrating that these goals can be complementary rather than contradictory."</p>
      <p>While challenges remain, particularly around the initial costs of transition and the need for knowledge transfer, the momentum behind sustainable agriculture continues to build, supported by changing consumer preferences, corporate sustainability commitments, and evolving government policies.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["science"],
      author: "Maria Rodriguez",
      publishedAt: twoDaysAgo,
      readTime: 8,
      featured: false,
      trending: false,
      editorsPick: true
    });
    
    await this.createArticle({
      title: "The Future of Work: Lessons from the Remote Revolution",
      slug: "future-work-remote-revolution",
      excerpt: "How the pandemic-driven shift to remote work is permanently changing workplace norms and practices.",
      content: `<p>When offices around the world emptied in early 2020 due to the pandemic, few anticipated that this emergency measure would evolve into a fundamental rethinking of how, where, and when work gets done.</p>
      <p>More than three years later, it's clear that the workplace has been permanently transformed, with organizations and employees alike embracing new models that blend the best aspects of remote and in-person collaboration.</p>
      <p>"We've compressed what would have been a decade of workplace evolution into just a few years," observes a professor of organizational behavior who has been studying these transitions. "The companies that are thriving now are those that viewed this period as an opportunity to reimagine work rather than simply trying to replicate pre-pandemic practices in a remote environment."</p>
      <p>Data from global workplace surveys indicates that approximately 85% of knowledge workers now desire some form of hybrid arrangement, with the most common preference being 2-3 days in the office per week. Companies that have embraced this flexibility report higher employee satisfaction, improved retention, and, in many cases, increased productivity.</p>
      <p>However, successful hybrid work requires more than just allowing employees to work from home part-time. Leading organizations are redesigning physical workspaces to emphasize collaboration and connection while investing in digital tools that enable asynchronous work and reduce the disadvantages faced by remote team members.</p>
      <p>"The office needs to earn the commute," explains the chief people officer at a technology company that has been at the forefront of workplace innovation. "When employees come in, there should be clear value in being physically present – whether that's collaborative workshops, team building, or critical meetings that benefit from in-person dynamics."</p>
      <p>Another significant shift has been the increased emphasis on outcomes rather than activity. Without the ability to observe employees working at their desks, managers have been forced to focus more on results and deliverables, leading many organizations to adopt more explicit goal-setting frameworks and regular check-ins.</p>
      <p>This transition hasn't been without challenges. Concerns about disconnect from company culture, difficulties in onboarding new employees, and the risk of creating two-tier workforces where in-office employees have advantages over remote colleagues remain significant issues that organizations are working to address.</p>
      <p>The implications extend beyond individual workplaces to entire urban ecosystems. City centers that were previously dominated by office workers are being reimagined, with some commercial real estate being converted to residential use and businesses adapting to more distributed customer patterns.</p>
      <p>Looking ahead, the most forward-thinking organizations are exploring how artificial intelligence and advanced collaboration technologies might further enhance remote and hybrid work, potentially enabling entirely new ways of creating value and connecting talent across geographic boundaries.</p>`,
      imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["business"],
      author: "Alex Turner",
      publishedAt: this.fourDaysAgo,
      readTime: 6,
      featured: false,
      trending: false,
      editorsPick: true
    });
    
    await this.createArticle({
      title: "The Quiet Mental Health Crisis: Finding Solutions",
      slug: "mental-health-crisis-solutions",
      excerpt: "As rates of anxiety and depression rise globally, experts point to promising interventions and the importance of structural change.",
      content: `<p>Mental health professionals are sounding the alarm about what many describe as a quiet crisis affecting millions of people worldwide, with rates of depression, anxiety, and other mental health conditions reaching unprecedented levels.</p>
      <p>According to the World Health Organization, nearly one billion people globally now live with a mental disorder, and the economic consequences of poor mental health are estimated at over $1 trillion per year in lost productivity.</p>
      <p>The COVID-19 pandemic exacerbated existing challenges, with surveys indicating a 25% increase in prevalence of anxiety and depression during the first year of the pandemic alone. Young people have been particularly affected, with some regions reporting that as many as one in four adolescents experience symptoms that meet clinical criteria for depression.</p>
      <p>"We're facing a perfect storm," explains a psychiatrist who specializes in public health. "The combination of pandemic-related stressors, increasing social isolation, economic uncertainty, climate anxiety, and constant digital stimulation is overwhelming our natural coping mechanisms."</p>
      <p>Despite these alarming trends, experts point to several developments that offer hope. Evidence-based digital mental health tools have demonstrated effectiveness in reaching people who might otherwise lack access to care, particularly in regions with few mental health professionals.</p>
      <p>Workplace interventions are also showing promise. Companies that have implemented comprehensive mental health programs – including manager training, peer support networks, and generous leave policies – report significant improvements in employee wellbeing along with reduced absenteeism and healthcare costs.</p>
      <p>Perhaps most encouraging has been the gradual but meaningful reduction in stigma around mental health issues. Celebrities, athletes, and business leaders speaking openly about their own mental health challenges have helped normalize these conversations and encourage people to seek help earlier.</p>
      <p>"When I was starting my career, mental health was never discussed in the workplace," notes a CEO who has become an advocate for mental health awareness. "Now we recognize that supporting psychological wellbeing isn't just the right thing to do for our team members – it's also essential for organizational performance and innovation."</p>
      <p>However, experts emphasize that addressing the crisis will require more than individual-level interventions. Structural factors including healthcare access, economic inequality, discrimination, and social disconnection require policy solutions and community-level changes.</p>
      <p>"We need to move beyond thinking about mental health as purely an individual medical issue and recognize how profoundly our environments shape our psychological wellbeing," argues a researcher studying social determinants of mental health. "The most effective solutions will combine better treatment access with efforts to create healthier, more connected, and more equitable communities."</p>`,
      imageUrl: "https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      categoryId: categoryIds["health"],
      author: "Sophia Chen",
      publishedAt: this.sixDaysAgo,
      readTime: 7,
      featured: false,
      trending: false,
      editorsPick: true
    });
  }
  
  // Generate date variables
  private get tenMinutesAgo() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 10);
    return date;
  }
  
  private get thirtyFiveMinutesAgo() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 35);
    return date;
  }
  
  private get oneHourAgo() {
    const date = new Date();
    date.setHours(date.getHours() - 1);
    return date;
  }
  
  private get twoHoursAgo() {
    const date = new Date();
    date.setHours(date.getHours() - 2);
    return date;
  }
  
  private get threeHoursAgo() {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    return date;
  }
  
  private get fiveHoursAgo() {
    const date = new Date();
    date.setHours(date.getHours() - 5);
    return date;
  }
  
  private get oneDayAgo() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }
  
  private get twoDaysAgo() {
    const date = new Date();
    date.setDate(date.getDate() - 2);
    return date;
  }
  
  private get threeDaysAgo() {
    const date = new Date();
    date.setDate(date.getDate() - 3);
    return date;
  }
  
  private get fourDaysAgo() {
    const date = new Date();
    date.setDate(date.getDate() - 4);
    return date;
  }
  
  private get sixDaysAgo() {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Article methods
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }
  
  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
  
  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(article => article.slug === slug);
  }
  
  async getFeaturedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.featured)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  
  async getTrendingArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.trending)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  
  async getLatestArticles(limit: number = 10): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }
  
  async getEditorsPickArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.editorsPick)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  
  async getArticlesByCategory(categoryId: number): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.categoryId === categoryId)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  
  async getArticlesByCategorySlug(categorySlug: string): Promise<Article[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];
    
    return this.getArticlesByCategory(category.id);
  }
  
  async searchArticles(query: string): Promise<Article[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.articles.values())
      .filter(article => 
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        article.excerpt.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    
    // Create a properly typed article object with defined boolean values
    const article: Article = {
      id,
      title: insertArticle.title,
      slug: insertArticle.slug,
      content: insertArticle.content,
      excerpt: insertArticle.excerpt,
      imageUrl: insertArticle.imageUrl,
      categoryId: insertArticle.categoryId,
      author: insertArticle.author,
      publishedAt: insertArticle.publishedAt instanceof Date ? insertArticle.publishedAt : new Date(insertArticle.publishedAt),
      readTime: insertArticle.readTime,
      featured: insertArticle.featured === undefined ? false : insertArticle.featured,
      trending: insertArticle.trending === undefined ? false : insertArticle.trending,
      editorsPick: insertArticle.editorsPick === undefined ? false : insertArticle.editorsPick
    };
    
    this.articles.set(id, article);
    return article;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
}

export const storage = new MemStorage();
