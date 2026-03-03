import { useState } from 'react';

const MEDAL_ICONS = ['🥇', '🥈', '🥉'];

function TrendBar({ score }) {
  return (
    <div className="trend-bar-bg">
      <div className="trend-bar-fill" style={{ width: `${score}%` }} />
    </div>
  );
}

export default function TrendingRank({ products, onSelectProduct }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="trending-rank">
      <div className="trending-rank__header">
        <h3 className="trending-rank__title">
          <span className="trending-rank__fire">🔥</span>
          热度排行榜
        </h3>
        <span className="trending-rank__subtitle">基于全网讨论热度 · 实时更新</span>
      </div>
      <div className="trending-rank__list">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`trending-rank__item ${expandedId === product.id ? 'expanded' : ''} ${index < 3 ? 'top-three' : ''}`}
            onClick={() => onSelectProduct(product)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectProduct(product); }}
          >
            <div className="trending-rank__item-main">
              <span className={`trending-rank__pos ${index < 3 ? `pos-${index + 1}` : ''}`}>
                {index < 3 ? MEDAL_ICONS[index] : index + 1}
              </span>
              <div className="trending-rank__icon-wrap">
                {product.icon.startsWith('http') ? (
                  <img src={product.icon} alt={product.name} className="trending-rank__icon" />
                ) : (
                  <span className="trending-rank__icon-emoji">{product.icon}</span>
                )}
              </div>
              <div className="trending-rank__info">
                <div className="trending-rank__name-row">
                  <span className="trending-rank__name">{product.name}</span>
                  {product.isNew && <span className="trending-rank__badge badge-new">NEW</span>}
                  <span className="trending-rank__company">{product.company}</span>
                </div>
                <div className="trending-rank__score-row">
                  <TrendBar score={product.trendScore} />
                  <span className="trending-rank__score">{product.trendScore}</span>
                </div>
              </div>
              <div className="trending-rank__right">
                <span className={`trending-rank__change ${product.trendChange?.startsWith('+') ? 'up' : 'down'}`}>
                  {product.trendChange?.startsWith('+') ? '↑' : '↓'} {product.trendChange}
                </span>
                <button
                  className="trending-rank__expand-btn"
                  onClick={(e) => toggleExpand(product.id, e)}
                  title="查看详情"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: expandedId === product.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>
            {expandedId === product.id && product.whyHot && (
              <div className="trending-rank__detail">
                <div className="trending-rank__detail-section">
                  <span className="trending-rank__detail-label">🔍 为什么火</span>
                  <p className="trending-rank__detail-text">{product.whyHot}</p>
                </div>
                {product.trendReason && (
                  <div className="trending-rank__detail-reason">
                    <span className="trending-rank__detail-label">📈 热度关键词</span>
                    <span className="trending-rank__detail-keyword">{product.trendReason}</span>
                  </div>
                )}
                <div className="trending-rank__detail-tags">
                  {product.tags.map((tag) => (
                    <span key={tag} className="trending-rank__detail-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
