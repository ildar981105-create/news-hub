import { useState, useEffect, useCallback } from 'react';

const RSS_SOURCES = [
  // ===== 大模型动态 =====
  {
    url: 'https://news.google.com/rss/search?q=GPT+OpenAI+Claude+Gemini&hl=en-US&gl=US&ceid=US:en',
    category: 'LLM',
    name: 'Google News',
  },
  {
    url: 'https://news.google.com/rss/search?q=seedance+Sora+Kling+video+AI&hl=en-US&gl=US&ceid=US:en',
    category: 'LLM',
    name: 'Google News',
  },
  {
    url: 'https://news.google.com/rss/search?q=%E5%A4%A7%E6%A8%A1%E5%9E%8B&hl=zh-CN&gl=CN&ceid=CN:zh-Hans',
    category: 'LLM',
    name: 'Google 新闻',
  },
  {
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'LLM',
    name: 'TechCrunch',
  },
  {
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    category: 'LLM',
    name: 'The Verge',
  },

  // ===== AI Agent & 设计工具 =====
  {
    url: 'https://news.google.com/rss/search?q=AI+agent+design+tool&hl=en-US&gl=US&ceid=US:en',
    category: 'Agent & Design',
    name: 'Google News',
  },
  {
    url: 'https://news.google.com/rss/search?q=AI+%E8%AE%BE%E8%AE%A1+%E5%B7%A5%E5%85%B7&hl=zh-CN&gl=CN&ceid=CN:zh-Hans',
    category: 'Agent & Design',
    name: 'Google 新闻',
  },
  {
    url: 'https://uxdesign.cc/feed',
    category: 'Agent & Design',
    name: 'UX Collective',
  },
  {
    url: 'https://www.smashingmagazine.com/feed/',
    category: 'Agent & Design',
    name: 'Smashing Magazine',
  },
];

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

async function fetchFeed(source) {
  try {
    const res = await fetch(
      `${RSS2JSON_API}?rss_url=${encodeURIComponent(source.url)}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(data.message || 'Feed parse error');

    return data.items.map((item) => ({
      id: item.guid || item.link || `${source.name}-${item.title}`,
      title: item.title,
      description: stripHtml(item.description).slice(0, 220),
      link: item.link,
      pubDate: item.pubDate,
      thumbnail: item.thumbnail || item.enclosure?.link || extractImage(item.content || item.description),
      author: item.author || '',
      source: source.name,
      category: source.category,
    }));
  } catch (err) {
    console.warn(`Failed to fetch ${source.name}:`, err.message);
    return [];
  }
}

function stripHtml(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function extractImage(html) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return match ? match[1] : null;
}

function dedup(articles) {
  const seen = new Set();
  return articles.filter((a) => {
    const key = a.link || a.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function useNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastFetched, setLastFetched] = useState('');

  const formatTimestamp = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(RSS_SOURCES.map(fetchFeed));
      const allArticles = dedup(
        results
          .filter((r) => r.status === 'fulfilled')
          .flatMap((r) => r.value)
          .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      );

      if (allArticles.length === 0) {
        setError('暂时无法获取新闻，请稍后再试');
      }
      setArticles(allArticles);
      setLastFetched(formatTimestamp());
    } catch (err) {
      setError('获取新闻失败：' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = articles.filter((article) => {
    const matchCategory = filter === 'all' || article.category === filter;
    const matchSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return {
    articles: filtered,
    allArticles: articles,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    refresh: fetchAll,
    lastFetched,
  };
}
