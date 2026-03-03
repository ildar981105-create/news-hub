import { useState, useEffect, useRef, useCallback } from 'react';

const CATEGORY_COLORS = {
  'LLM 大模型': { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' },
  '图像生成': { bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' },
  '视频生成': { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' },
  '编程助手': { bg: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' },
  '设计工具': { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' },
  'AI Agent': { bg: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' },
  '效率工具': { bg: 'rgba(250, 204, 21, 0.15)', color: '#facc15' },
  '搜索引擎': { bg: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' },
  '音频语音': { bg: 'rgba(244, 114, 182, 0.15)', color: '#f472b6' },
};

const TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single';
const translateCache = new Map();

async function translateText(text) {
  if (!text || text.trim().length === 0) return text;
  if (/^[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\s，。！？、；：""''（）]+$/.test(text.trim())) return text;
  if (translateCache.has(text)) return translateCache.get(text);

  const params = new URLSearchParams({ client: 'gtx', sl: 'auto', tl: 'zh-CN', dt: 't', q: text });
  const res = await fetch(`${TRANSLATE_API}?${params}`);
  if (!res.ok) throw new Error(`Translation failed: ${res.status}`);
  const data = await res.json();
  const result = data?.[0] ? data[0].map((seg) => seg[0]).join('') : text;
  translateCache.set(text, result);
  return result;
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

export default function ProductDetail({
  product,
  onClose,
  news,
  newsLoading,
  newsError,
  comments,
  onAddComment,
  onLikeComment,
}) {
  const [commentText, setCommentText] = useState('');
  const [nickname, setNickname] = useState('');
  const [activeSection, setActiveSection] = useState('news');
  const [imgError, setImgError] = useState(false);
  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  // Translation state
  const [translatedMap, setTranslatedMap] = useState({});
  const [translatingIds, setTranslatingIds] = useState(new Set());
  const [batchTranslating, setBatchTranslating] = useState(false);
  const abortRef = useRef(false);

  // Reset translations when product changes
  useEffect(() => {
    setTranslatedMap({});
    setTranslatingIds(new Set());
    setBatchTranslating(false);
    abortRef.current = true;
  }, [product.id]);

  const translateOneNews = useCallback(async (article) => {
    if (translatedMap[article.id]) return;
    setTranslatingIds((prev) => new Set(prev).add(article.id));
    try {
      const [tTitle, tDesc] = await Promise.all([
        translateText(article.title),
        translateText(article.description),
      ]);
      setTranslatedMap((prev) => ({ ...prev, [article.id]: { title: tTitle, description: tDesc } }));
    } catch (err) {
      console.warn('Translation error:', err.message);
    } finally {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        next.delete(article.id);
        return next;
      });
    }
  }, [translatedMap]);

  const translateAllNews = useCallback(async () => {
    abortRef.current = false;
    setBatchTranslating(true);
    const toTranslate = news.filter((a) => !translatedMap[a.id]);
    const batch = 3;

    for (let i = 0; i < toTranslate.length; i += batch) {
      if (abortRef.current) break;
      const chunk = toTranslate.slice(i, i + batch);
      const ids = chunk.map((a) => a.id);
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.add(id));
        return next;
      });

      const results = await Promise.allSettled(
        chunk.map(async (article) => {
          const [tTitle, tDesc] = await Promise.all([
            translateText(article.title),
            translateText(article.description),
          ]);
          return { id: article.id, title: tTitle, description: tDesc };
        })
      );

      setTranslatedMap((prev) => {
        const next = { ...prev };
        results.forEach((r) => {
          if (r.status === 'fulfilled') next[r.value.id] = { title: r.value.title, description: r.value.description };
        });
        return next;
      });

      setTranslatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });

      if (i + batch < toTranslate.length) await new Promise((r) => setTimeout(r, 300));
    }
    setBatchTranslating(false);
  }, [news, translatedMap]);

  const clearTranslations = useCallback(() => {
    setTranslatedMap({});
    abortRef.current = true;
    setBatchTranslating(false);
  }, []);

  const hasTranslations = Object.keys(translatedMap).length > 0;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    onAddComment(product.id, text, nickname.trim());
    setCommentText('');
  };

  const catColor = CATEGORY_COLORS[product.category] || { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' };

  return (
    <div className="pd-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="pd-panel" ref={panelRef}>
        {/* Header */}
        <div className="pd-header">
          <div className="pd-header-left">
            <div className="pd-icon-wrapper">
              {!imgError ? (
                <img
                  src={product.icon}
                  alt={product.name}
                  className="pd-icon"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="pd-icon-fallback">🤖</span>
              )}
            </div>
            <div className="pd-header-info">
              <div className="pd-name-row">
                <h2 className="pd-name">{product.name}</h2>
                {product.isNew && <span className="ai-product-badge badge-new">NEW</span>}
                {product.isHot && <span className="ai-product-badge badge-hot">HOT</span>}
              </div>
              <div className="pd-meta">
                <span className="pd-company">{product.company}</span>
                <span className="pd-separator">·</span>
                <span className="pd-users">{product.users} 用户</span>
                <span className="pd-separator">·</span>
                <span className="pd-cat-tag" style={{ background: catColor.bg, color: catColor.color }}>
                  {product.category}
                </span>
              </div>
            </div>
          </div>
          <div className="pd-header-actions">
            <a href={product.url} target="_blank" rel="noopener noreferrer" className="pd-visit-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              访问官网
            </a>
            <button className="pd-close-btn" onClick={onClose} aria-label="关闭">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="pd-desc">{product.description}</p>
        <div className="pd-tags">
          {product.tags.map((tag) => (
            <span key={tag} className="pd-tag">{tag}</span>
          ))}
        </div>

        {/* Section Tabs */}
        <div className="pd-tabs">
          <button
            className={`pd-tab ${activeSection === 'news' ? 'active' : ''}`}
            onClick={() => setActiveSection('news')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8v4h-8V6Z" />
            </svg>
            相关新闻
            <span className="pd-tab-count">{news.length}</span>
          </button>
          <button
            className={`pd-tab ${activeSection === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveSection('comments')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            评论讨论
            <span className="pd-tab-count">{comments.length}</span>
          </button>
        </div>

        {/* Content */}
        <div className="pd-content">
          {activeSection === 'news' ? (
            <div className="pd-news-section">
              {/* Translate All bar */}
              {!newsLoading && news.length > 0 && (
                <div className="pd-translate-bar">
                  <button
                    className={`pd-translate-all-btn ${batchTranslating ? 'translating' : ''} ${hasTranslations ? 'has-translations' : ''}`}
                    onClick={hasTranslations ? clearTranslations : translateAllNews}
                    disabled={batchTranslating && !hasTranslations}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={batchTranslating ? 'pulse' : ''}>
                      <path d="m5 8 6 6" />
                      <path d="m4 14 6-6 2-3" />
                      <path d="M2 5h12" />
                      <path d="M7 2h1" />
                      <path d="m22 22-5-10-5 10" />
                      <path d="M14 18h6" />
                    </svg>
                    {hasTranslations ? '显示原文' : batchTranslating ? '翻译中...' : '翻译全部新闻'}
                  </button>
                  {hasTranslations && (
                    <span className="pd-translate-count">
                      已译 {Object.keys(translatedMap).length}/{news.length}
                    </span>
                  )}
                </div>
              )}

              {newsLoading ? (
                <div className="pd-news-loading">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="pd-news-skeleton shimmer">
                      <div className="pd-news-skeleton-line long" />
                      <div className="pd-news-skeleton-line short" />
                    </div>
                  ))}
                </div>
              ) : newsError && news.length === 0 ? (
                <div className="pd-empty">
                  <span className="pd-empty-icon">📰</span>
                  <p>{newsError}</p>
                </div>
              ) : (
                <div className="pd-news-list">
                  {news.map((article) => {
                    const translated = translatedMap[article.id];
                    const isTranslating = translatingIds.has(article.id);
                    const displayTitle = translated?.title || article.title;
                    const displayDesc = translated?.description || article.description;

                    return (
                      <div key={article.id} className="pd-news-item-wrapper">
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pd-news-item"
                        >
                          <div className="pd-news-item-content">
                            <h4 className="pd-news-title">{displayTitle}</h4>
                            {displayDesc && (
                              <p className="pd-news-desc">{displayDesc}</p>
                            )}
                            <div className="pd-news-meta">
                              <span className="pd-news-source">{article.source}</span>
                              <span className="pd-news-time">{article.timeAgo}</span>
                            </div>
                          </div>
                          {article.thumbnail && (
                            <div className="pd-news-thumb-wrapper">
                              <img
                                src={article.thumbnail}
                                alt=""
                                className="pd-news-thumb"
                                loading="lazy"
                                onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                              />
                            </div>
                          )}
                        </a>
                        <div className="pd-news-actions">
                          <button
                            className={`pd-news-translate-btn ${translated ? 'translated' : ''} ${isTranslating ? 'loading' : ''}`}
                            onClick={() => {
                              if (!translated && !isTranslating) translateOneNews(article);
                            }}
                            title={translated ? '已翻译' : '翻译为中文'}
                          >
                            {isTranslating ? (
                              <svg className="translate-spinner" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                              </svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m5 8 6 6" />
                                <path d="m4 14 6-6 2-3" />
                                <path d="M2 5h12" />
                                <path d="M7 2h1" />
                                <path d="m22 22-5-10-5 10" />
                                <path d="M14 18h6" />
                              </svg>
                            )}
                            <span>{translated ? '已译' : isTranslating ? '翻译中' : '译'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="pd-comments-section">
              {/* Comment form */}
              <form className="pd-comment-form" onSubmit={handleSubmitComment}>
                <div className="pd-comment-form-row">
                  <input
                    type="text"
                    className="pd-comment-nickname"
                    placeholder="昵称（可选）"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={20}
                  />
                </div>
                <div className="pd-comment-input-row">
                  <textarea
                    className="pd-comment-input"
                    placeholder={`分享你对 ${product.name} 的看法...`}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    className="pd-comment-submit"
                    disabled={!commentText.trim()}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    发布
                  </button>
                </div>
              </form>

              {/* Comments list */}
              {comments.length === 0 ? (
                <div className="pd-empty">
                  <span className="pd-empty-icon">💬</span>
                  <p>还没有评论，来做第一个评论者吧！</p>
                </div>
              ) : (
                <div className="pd-comments-list">
                  {comments.map((comment) => (
                    <div key={comment.id} className="pd-comment">
                      <div className="pd-comment-avatar">{comment.avatar}</div>
                      <div className="pd-comment-body">
                        <div className="pd-comment-header">
                          <span className="pd-comment-name">{comment.nickname}</span>
                          <span className="pd-comment-time">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="pd-comment-text">{comment.text}</p>
                        <button
                          className="pd-comment-like"
                          onClick={() => onLikeComment(product.id, comment.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 10v12" />
                            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                          </svg>
                          {comment.likes > 0 && <span>{comment.likes}</span>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
