import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Clock, 
  ExternalLink, 
  Filter,
  TrendingUp,
  Globe,
  Leaf,
  Zap,
  Recycle,
  TreePine,
  RefreshCw
} from 'lucide-react';
import { NewsArticle, NEWS_CATEGORIES, newsService } from '@/services/newsService';

interface NewsSectionProps {
  className?: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'climate': return <Globe className="w-4 h-4" />;
    case 'biodiversity': return <Leaf className="w-4 h-4" />;
    case 'renewable-energy': return <Zap className="w-4 h-4" />;
    case 'pollution': return <Recycle className="w-4 h-4" />;
    case 'conservation': return <TreePine className="w-4 h-4" />;
    case 'sustainability': return <Recycle className="w-4 h-4" />;
    default: return <Globe className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'climate': return 'bg-red-100 text-red-800';
    case 'biodiversity': return 'bg-green-100 text-green-800';
    case 'renewable-energy': return 'bg-yellow-100 text-yellow-800';
    case 'pollution': return 'bg-gray-100 text-gray-800';
    case 'conservation': return 'bg-emerald-100 text-emerald-800';
    case 'sustainability': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function NewsSection({ className }: NewsSectionProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);

  const articlesPerPage = 6;

  // Load news on component mount
  useEffect(() => {
    loadNews();
    loadTrendingNews();
  }, []);

  // Filter articles when search query or category changes
  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery, selectedCategory]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const news = await newsService.getNews(selectedCategory, 1, 20);
      setArticles(news);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingNews = async () => {
    try {
      const trending = await newsService.getTrendingNews(3);
      setTrendingNews(trending);
    } catch (error) {
      console.error('Error loading trending news:', error);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleRefresh = () => {
    loadNews();
    loadTrendingNews();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaginatedArticles = () => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    return filteredArticles.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-900 mb-2">📰 Punjab's Environmental News</h2>
        <p className="text-green-600 text-lg">Stay updated with environmental developments in Punjab and beyond</p>
        <div className="mt-2 text-sm text-green-500">
          🌱 Curated by the EcoEdu Punjab team
        </div>
      </div>

      {/* Trending News Section */}
      {trendingNews.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <TrendingUp className="w-5 h-5" />
              Trending Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingNews.map((article) => (
                <div key={article.id} className="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(article.category)}
                    <Badge className={getCategoryColor(article.category)}>
                      {article.category.replace('-', ' ')}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2 line-clamp-2">{article.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime} min read
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter Controls */}
      <Card className="bg-white border-blue-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search environmental news..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {NEWS_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Refresh Button */}
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              className="w-full md:w-auto"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading latest environmental news...</p>
        </div>
      )}

      {/* News Articles Grid */}
      {!loading && (
        <>
          {filteredArticles.length === 0 ? (
            <Card className="bg-white border-blue-200">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">No News Found</h3>
                <p className="text-blue-600">
                  {searchQuery ? 'Try adjusting your search terms' : 'No articles available for this category'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getPaginatedArticles().map((article) => (
                <Card key={article.id} className="bg-white border-blue-200 hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={getCategoryColor(article.category)}>
                        {getCategoryIcon(article.category)}
                        <span className="ml-1">{article.category.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-blue-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {article.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {article.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime} min read
                        </span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {article.source.name}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(article.url, '_blank')}
                          className="text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Read More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-center text-sm text-gray-600">
            Showing {getPaginatedArticles().length} of {filteredArticles.length} articles
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${NEWS_CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
          </div>
        </>
      )}
    </div>
  );
}
