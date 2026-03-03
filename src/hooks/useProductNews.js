import { useState, useCallback } from 'react';

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

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

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} 天前`;
  return date.toLocaleDateString('zh-CN');
}

/**
 * 根据产品关键词搜索相关新闻
 */
async function fetchProductNews(product) {
  const keywords = [product.name];
  if (product.company && product.company !== product.name) {
    keywords.push(product.company);
  }
  const query = keywords.join('+');

  const sources = [
    {
      url: `https://news.google.com/rss/search?q=${encodeURIComponent(query)}+AI&hl=en-US&gl=US&ceid=US:en`,
      name: 'Google News',
    },
    {
      url: `https://news.google.com/rss/search?q=${encodeURIComponent(query)}+AI&hl=zh-CN&gl=CN&ceid=CN:zh-Hans`,
      name: 'Google 新闻',
    },
  ];

  const results = await Promise.allSettled(
    sources.map(async (source) => {
      const res = await fetch(`${RSS2JSON_API}?rss_url=${encodeURIComponent(source.url)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status !== 'ok') throw new Error(data.message || 'Feed parse error');

      return data.items.map((item) => ({
        id: item.guid || item.link || `${source.name}-${item.title}`,
        title: item.title,
        description: stripHtml(item.description).slice(0, 200),
        link: item.link,
        pubDate: item.pubDate,
        timeAgo: timeAgo(item.pubDate),
        thumbnail: item.thumbnail || item.enclosure?.link || extractImage(item.content || item.description),
        source: source.name,
      }));
    })
  );

  const articles = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value);

  // 去重
  const seen = new Set();
  const deduped = articles.filter((a) => {
    const key = a.link || a.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 20);
}

/**
 * 评论数据管理
 * 使用 localStorage 持久化保存评论
 */
const STORAGE_KEY = 'ai-products-comments';

function loadComments() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveComments(comments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  } catch {
    // ignore
  }
}

let commentIdCounter = Date.now();

export function useProductNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allComments, setAllComments] = useState(loadComments);

  const fetchNews = useCallback(async (product) => {
    setLoading(true);
    setError(null);
    setNews([]);
    try {
      const articles = await fetchProductNews(product);
      setNews(articles);
      if (articles.length === 0) {
        setError('暂未找到该产品的相关新闻');
      }
    } catch (err) {
      setError('获取新闻失败：' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getComments = useCallback(
    (productId) => {
      return allComments[productId] || [];
    },
    [allComments]
  );

  const addComment = useCallback(
    (productId, text, nickname) => {
      const comment = {
        id: ++commentIdCounter,
        text,
        nickname: nickname || '匿名用户',
        avatar: getRandomAvatar(nickname),
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      setAllComments((prev) => {
        const updated = {
          ...prev,
          [productId]: [comment, ...(prev[productId] || [])],
        };
        saveComments(updated);
        return updated;
      });
    },
    []
  );

  const likeComment = useCallback((productId, commentId) => {
    setAllComments((prev) => {
      const comments = (prev[productId] || []).map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      );
      const updated = { ...prev, [productId]: comments };
      saveComments(updated);
      return updated;
    });
  }, []);

  return {
    news,
    loading,
    error,
    fetchNews,
    getComments,
    addComment,
    likeComment,
  };
}

function getRandomAvatar(name) {
  const avatars = ['😀', '😎', '🤓', '🧑‍💻', '👨‍🎨', '👩‍🔬', '🦊', '🐱', '🐼', '🦁', '🐸', '🤖', '👾', '🎃', '🌟', '⭐'];
  if (!name) return avatars[Math.floor(Math.random() * avatars.length)];
  const idx = Math.abs(name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % avatars.length;
  return avatars[idx];
}
