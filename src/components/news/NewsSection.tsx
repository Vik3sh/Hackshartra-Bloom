import React, { useEffect, useState } from 'react';
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
  RefreshCw,
  Hash,
  Facebook
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

// Simple inline comments component persisted to localStorage. Keeps markup minimal and accessible.
const ArticleComments: React.FC<{ articleId: string }> = ({ articleId }) => {
  const STORAGE = 'news_comments_v1';
  const [commentsMap, setCommentsMap] = useState<Record<string, { id: string; text: string; createdAt: string }[]>>({});
  const [value, setValue] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      setCommentsMap(raw ? JSON.parse(raw) : {});
    } catch { setCommentsMap({}); }
  }, []);

  const persist = (next: Record<string, { id: string; text: string; createdAt: string }[]>) => {
    try { localStorage.setItem(STORAGE, JSON.stringify(next)); setCommentsMap(next); } catch {}
  };

  const addComment = () => {
    const t = value.trim();
    if (!t) return;
    const c = { id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, text: t, createdAt: new Date().toISOString() };
    const next = { ...commentsMap };
    next[articleId] = next[articleId] ? [c, ...next[articleId]] : [c];
    persist(next);
    setValue('');
  };

  const comments = commentsMap[articleId] || [];

  return (
    <div className="mt-3 border-t pt-3">
      <div className="text-sm text-slate-600 mb-2">Comments ({comments.length})</div>
      <div className="space-y-2">
        <div>
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Add a comment..." className="w-full p-2 rounded-lg border" onKeyDown={(e) => { if (e.key === 'Enter') addComment(); }} />
          <div className="flex justify-end mt-2">
            <Button size="sm" onClick={addComment} disabled={!value.trim()}>Post</Button>
          </div>
        </div>
        {comments.map(c => (
          <div key={c.id} className="p-2 rounded bg-gray-50">
            <div className="text-sm text-slate-800">{c.text}</div>
            <div className="text-xs text-slate-400 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
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
      {/* Header with subscribe CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl custom-heading text-slate-900 mb-1">Punjab's Environmental News</h2>
          <p className="custom-body text-slate-600">Stay updated with environmental developments in Punjab and beyond — curated by the EcoEdu Punjab team.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Search news..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="hidden md:block w-72" />
          <Button className="custom-button bg-amber-500 text-white shadow" onClick={() => { alert('Subscribed — thank you!'); }}>Subscribe</Button>
        </div>
      </div>

      {/* Trending / Featured Stories */}
      {trendingNews.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Large featured story */}
            <div className="custom-card overflow-hidden">
              <div className="relative h-80 lg:h-96">
                <img src={trendingNews[0].urlToImage} alt={trendingNews[0].title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=1200&h=600&fit=crop'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white max-w-xl">
                  <Badge className={`${getCategoryColor(trendingNews[0].category)} !text-xs`}>{trendingNews[0].category.replace('-', ' ')}</Badge>
                  <h3 className="text-2xl md:text-3xl font-bold mt-2">{trendingNews[0].title}</h3>
                  <p className="mt-2 text-sm text-white/90 line-clamp-2">{trendingNews[0].description}</p>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => window.open(trendingNews[0].url, '_blank')}>Read</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {trendingNews.slice(1).map(a => (
              <div key={a.id} className="flex gap-3 items-start custom-card p-3">
                <img src={a.urlToImage} alt={a.title} className="w-32 h-20 object-cover rounded-md" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop'; }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getCategoryIcon(a.category)}
                    <span className="text-xs text-muted-foreground">{a.source.name}</span>
                  </div>
                  <div className="font-semibold text-slate-900 line-clamp-2">{a.title}</div>
                  <div className="text-sm text-slate-600 line-clamp-2">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                        <span className="text-slate-700">{getCategoryIcon(category.id)}</span>
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
                <Card key={article.id} className="bg-white border-blue-200 hover:shadow-lg transition-shadow group custom-card">
                  <div className="relative">
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=400&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-t-lg" />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getCategoryColor(article.category)} !text-xs`}>
                        {getCategoryIcon(article.category)}
                        <span className="ml-1 text-xs">{article.category.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button className="p-1 rounded bg-white/80 hover:bg-white" onClick={() => { window.open(`https://www.threads.net/share?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}`, '_blank'); }} aria-label="Share to Threads"><Hash className="w-4 h-4 text-slate-700" /></button>
                      <button className="p-1 rounded bg-white/80 hover:bg-white" onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`, '_blank'); }} aria-label="Share to Facebook"><Facebook className="w-4 h-4 text-slate-700" /></button>
                      <button className="p-1 rounded bg-white/80 hover:bg-white" onClick={() => { navigator.clipboard?.writeText(article.url); alert('Article URL copied to clipboard'); }} aria-label="Copy link">🔗</button>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg custom-heading text-slate-900 line-clamp-2 group-hover:text-slate-700 transition-colors">
                      {article.title}
                    </CardTitle>
                    <p className="text-sm custom-body text-slate-600 line-clamp-3">
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
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(article.url, '_blank')}
                            className="text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Read
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => {
                            // toggle comments below per article
                            const key = `comments_${article.id}`;
                            const raw = localStorage.getItem('news_comments_v1');
                          }} className="text-xs">Comments</Button>
                        </div>
                      </div>

                      {/* Simple comments area */}
                      <ArticleComments articleId={article.id} />

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