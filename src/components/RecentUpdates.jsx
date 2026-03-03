import { useState } from 'react';

function isWithin24h(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  return now - date < 86400000;
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  return `${Math.floor(diff / 86400)} 天前`;
}

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

export default function RecentUpdates({
  recentNews,
  recentProducts,
  lastFetched,
  onRefresh,
  loading,
  onTabChange,
  onSelectProduct,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const totalCount = recentNews.length + recentProducts.length;

  if (totalCount === 0 && !loading) return null;

  return (
    <section className="recent-updates">
      <div className="recent-updates-header">
        <div className="recent-updates-title-area">
          <h2 className="recent-updates-title">
            <span className="recent-updates-pulse" />
            最近更新
            <span className="recent-updates-count">{totalCount}</span>
          </h2>
          <div className="recent-updates-meta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>更新于 {lastFetched || '加载中...'}</span>
          </div>
        </div>
        <div className="recent-updates-actions">
          <button
            className={`recent-updates-refresh ${loading ? 'loading' : ''}`}
            onClick={onRefresh}
            disabled={loading}
            title="手动刷新"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? 'spin' : ''}>
              <path d="M21.5 2v6h-6M2.5 22v-6h6" />
              <path d="M2.5 11.5a10 10 0 0 1 18.8-4.3M21.5 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            <span>{loading ? '刷新中...' : '刷新'}</span>
          </button>
          <button
            className="recent-updates-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="recent-updates-content">
          {loading && totalCount === 0 ? (
            <div className="recent-updates-loading">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="recent-updates-skeleton shimmer" />
              ))}
            </div>
          ) : (
            <div className="recent-updates-list">
              {/* 24h 内新新闻 */}
              {recentNews.slice(0, 10).map((article) => (
                <a
                  key={article.id}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recent-item recent-item--news"
                >
                  <div className="recent-item-badge">
                    <span className="recent-item-type type-news">新闻</span>
                    <span className={`recent-item-cat ${article.category === 'LLM' ? 'cat-llm' : 'cat-agent'}`}>
                      {article.category}
                    </span>
                  </div>
                  <div className="recent-item-body">
                    <h4 className="recent-item-title">{article.title}</h4>
                    <div className="recent-item-meta">
                      <span className="recent-item-source">{article.source}</span>
                      <span className="recent-item-sep">·</span>
                      <span className="recent-item-time">{timeAgo(article.pubDate)}</span>
                    </div>
                  </div>
                  <span className="recent-item-new-tag">NEW</span>
                </a>
              ))}

              {/* 新产品 (isNew) */}
              {recentProducts.map((product) => {
                const catColor = CATEGORY_COLORS[product.category] || { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' };
                return (
                  <div
                    key={product.id}
                    className="recent-item recent-item--product"
                    onClick={() => {
                      onTabChange('products');
                      if (onSelectProduct) onSelectProduct(product);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') { onTabChange('products'); if (onSelectProduct) onSelectProduct(product); } }}
                  >
                    <div className="recent-item-badge">
                      <span className="recent-item-type type-product">产品</span>
                      <span
                        className="recent-item-cat-pill"
                        style={{ background: catColor.bg, color: catColor.color }}
                      >
                        {product.category}
                      </span>
                    </div>
                    <div className="recent-item-body">
                      <h4 className="recent-item-title">
                        {product.name}
                        <span className="recent-item-company">{product.company}</span>
                      </h4>
                      <p className="recent-item-desc">{product.description}</p>
                    </div>
                    <span className="recent-item-new-tag">NEW</span>
                  </div>
                );
              })}

              {recentNews.length > 10 && (
                <button
                  className="recent-updates-view-all"
                  onClick={() => onTabChange('news')}
                >
                  查看全部 {recentNews.length} 条新新闻
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
