import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - prefix with /api
  const apiRouter = app.route('/api');
  
  // Get all categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });
  
  // Get category by slug
  app.get('/api/categories/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch category' });
    }
  });
  
  // Get all articles
  app.get('/api/articles', async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch articles' });
    }
  });
  
  // Get featured articles
  app.get('/api/articles/featured', async (req, res) => {
    try {
      const articles = await storage.getFeaturedArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch featured articles' });
    }
  });
  
  // Get trending articles
  app.get('/api/articles/trending', async (req, res) => {
    try {
      const articles = await storage.getTrendingArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trending articles' });
    }
  });
  
  // Get latest articles
  app.get('/api/articles/latest', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const articles = await storage.getLatestArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch latest articles' });
    }
  });
  
  // Get editor's pick articles
  app.get('/api/articles/editors-picks', async (req, res) => {
    try {
      const articles = await storage.getEditorsPickArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch editor\'s pick articles' });
    }
  });
  
  // Get article by slug
  app.get('/api/articles/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch article' });
    }
  });
  
  // Get articles by category slug
  app.get('/api/categories/:slug/articles', async (req, res) => {
    try {
      const { slug } = req.params;
      const articles = await storage.getArticlesByCategorySlug(slug);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch articles for category' });
    }
  });
  
  // Search articles
  app.get('/api/search', async (req, res) => {
    try {
      const querySchema = z.object({
        q: z.string().min(1).optional()
      });
      
      const parseResult = querySchema.safeParse(req.query);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid search query' });
      }
      
      const { q } = parseResult.data;
      
      if (!q) {
        return res.json([]);
      }
      
      const articles = await storage.searchArticles(q);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: 'Search operation failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
