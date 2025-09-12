// News Service - Handles environmental news API calls
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  category: 'climate' | 'biodiversity' | 'renewable-energy' | 'pollution' | 'conservation' | 'sustainability';
  readTime: number; // in minutes
}

export interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
  status: string;
}

// Mock news data for development (replace with actual API calls)
const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'New Solar Farm Powers 50,000 Homes in Punjab',
    description: 'A massive solar energy project has been completed in Punjab, providing clean electricity to thousands of households.',
    content: 'The new solar farm, spanning 500 acres, features over 200,000 solar panels and is expected to reduce carbon emissions by 100,000 tons annually. This project is part of Punjab\'s commitment to renewable energy and sustainable development.',
    url: 'https://example.com/solar-farm-punjab',
    urlToImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop',
    publishedAt: '2024-01-15T10:30:00Z',
    source: {
      id: 'punjab-tribune',
      name: 'Punjab Tribune'
    },
    category: 'renewable-energy',
    readTime: 3
  },
  {
    id: '2',
    title: 'Climate Change Affecting Monsoon Patterns in India',
    description: 'Recent studies show significant changes in monsoon patterns due to climate change, affecting agricultural productivity.',
    content: 'Scientists have observed a 10% decrease in monsoon rainfall over the past decade, with more erratic weather patterns. This poses significant challenges for farmers and water management in the region.',
    url: 'https://example.com/monsoon-climate-change',
    urlToImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    publishedAt: '2024-01-14T15:45:00Z',
    source: {
      id: 'climate-news',
      name: 'Climate News India'
    },
    category: 'climate',
    readTime: 5
  },
  {
    id: '3',
    title: 'Wildlife Conservation Success: Tiger Population Increases',
    description: 'Conservation efforts have led to a 20% increase in tiger population across Indian wildlife reserves.',
    content: 'The latest tiger census shows promising results with over 3,000 tigers now living in protected areas. This success is attributed to improved anti-poaching measures and habitat restoration programs.',
    url: 'https://example.com/tiger-conservation-success',
    urlToImage: 'https://images.unsplash.com/photo-1552410260-0fd9b577afa6?w=800&h=400&fit=crop',
    publishedAt: '2024-01-13T09:15:00Z',
    source: {
      id: 'wildlife-news',
      name: 'Wildlife Conservation Today'
    },
    category: 'biodiversity',
    readTime: 4
  },
  {
    id: '4',
    title: 'Plastic Waste Reduction Initiative Launched in Schools',
    description: 'A new program aims to eliminate single-use plastics from schools across Punjab, starting with 100 pilot schools.',
    content: 'The initiative includes educational workshops, reusable water bottle distribution, and waste segregation training. Students are encouraged to become environmental ambassadors in their communities.',
    url: 'https://example.com/plastic-reduction-schools',
    urlToImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    publishedAt: '2024-01-12T14:20:00Z',
    source: {
      id: 'education-news',
      name: 'Education & Environment'
    },
    category: 'pollution',
    readTime: 3
  },
  {
    id: '5',
    title: 'Wind Energy Project Generates 200MW in Rajasthan',
    description: 'A new wind farm in Rajasthan has started operations, contributing significantly to India\'s renewable energy goals.',
    content: 'The wind farm features 100 turbines and is expected to power over 150,000 homes. This project brings India closer to its target of 500GW renewable energy capacity by 2030.',
    url: 'https://example.com/wind-energy-rajasthan',
    urlToImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop',
    publishedAt: '2024-01-11T11:30:00Z',
    source: {
      id: 'renewable-news',
      name: 'Renewable Energy Today'
    },
    category: 'renewable-energy',
    readTime: 4
  },
  {
    id: '6',
    title: 'Urban Forest Initiative Transforms City Landscapes',
    description: 'Cities across India are implementing urban forest programs to combat air pollution and improve quality of life.',
    content: 'The initiative involves planting native trees in urban areas, creating green corridors, and establishing community gardens. Early results show improved air quality and increased biodiversity in participating cities.',
    url: 'https://example.com/urban-forest-initiative',
    urlToImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
    publishedAt: '2024-01-10T16:00:00Z',
    source: {
      id: 'urban-news',
      name: 'Urban Development News'
    },
    category: 'conservation',
    readTime: 5
  }
];

// News API configuration
const NEWS_API_CONFIG = {
  // You can replace this with actual news API endpoints
  // Popular options: NewsAPI, Guardian API, or custom environmental news APIs
  baseUrl: 'https://newsapi.org/v2',
  apiKey: import.meta.env.VITE_NEWS_API_KEY || 'demo-key',
  endpoints: {
    everything: '/everything',
    topHeadlines: '/top-headlines'
  }
};

// News categories for filtering
export const NEWS_CATEGORIES = [
  { id: 'all', name: 'All News', icon: '📰' },
  { id: 'climate', name: 'Climate Change', icon: '🌍' },
  { id: 'biodiversity', name: 'Biodiversity', icon: '🦋' },
  { id: 'renewable-energy', name: 'Renewable Energy', icon: '⚡' },
  { id: 'pollution', name: 'Pollution', icon: '🌫️' },
  { id: 'conservation', name: 'Conservation', icon: '🌳' },
  { id: 'sustainability', name: 'Sustainability', icon: '♻️' }
];

// Service functions
export class NewsService {
  private static instance: NewsService;
  private cache: Map<string, NewsArticle[]> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  // Get news articles with optional filtering
  async getNews(category: string = 'all', page: number = 1, pageSize: number = 10): Promise<NewsArticle[]> {
    const cacheKey = `${category}-${page}-${pageSize}`;
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey) || [];
    }

    try {
      // In development, return mock data
      if (import.meta.env.DEV || !import.meta.env.VITE_NEWS_API_KEY) {
        const filteredNews = this.filterMockNews(category);
        const paginatedNews = this.paginateNews(filteredNews, page, pageSize);
        this.setCache(cacheKey, paginatedNews);
        return paginatedNews;
      }

      // In production, make actual API calls
      const response = await this.fetchFromAPI(category, page, pageSize);
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback to mock data on error
      const filteredNews = this.filterMockNews(category);
      const paginatedNews = this.paginateNews(filteredNews, page, pageSize);
      return paginatedNews;
    }
  }

  // Get trending environmental news
  async getTrendingNews(limit: number = 5): Promise<NewsArticle[]> {
    const allNews = await this.getNews('all', 1, 20);
    return allNews.slice(0, limit);
  }

  // Search news articles
  async searchNews(query: string, category: string = 'all'): Promise<NewsArticle[]> {
    const allNews = await this.getNews(category, 1, 50);
    const searchQuery = query.toLowerCase();
    
    return allNews.filter(article => 
      article.title.toLowerCase().includes(searchQuery) ||
      article.description.toLowerCase().includes(searchQuery) ||
      article.content.toLowerCase().includes(searchQuery)
    );
  }

  // Get news by category
  async getNewsByCategory(category: string): Promise<NewsArticle[]> {
    return this.getNews(category, 1, 20);
  }

  // Private helper methods
  private filterMockNews(category: string): NewsArticle[] {
    if (category === 'all') {
      return MOCK_NEWS;
    }
    return MOCK_NEWS.filter(article => article.category === category);
  }

  private paginateNews(news: NewsArticle[], page: number, pageSize: number): NewsArticle[] {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return news.slice(startIndex, endIndex);
  }

  private async fetchFromAPI(category: string, page: number, pageSize: number): Promise<NewsArticle[]> {
    // This would be implemented with actual API calls
    // For now, return mock data
    return this.filterMockNews(category);
  }

  private isCacheValid(cacheKey: string): boolean {
    const expiry = this.cacheExpiry.get(cacheKey);
    if (!expiry) return false;
    return Date.now() < expiry;
  }

  private setCache(cacheKey: string, data: NewsArticle[]): void {
    this.cache.set(cacheKey, data);
    this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// Export singleton instance
export const newsService = NewsService.getInstance();
