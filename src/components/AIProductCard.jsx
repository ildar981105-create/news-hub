import { useState } from 'react';

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

const FALLBACK_ICONS = {
  'LLM 大模型': '🧠',
  '图像生成': '🎨',
  '视频生成': '🎬',
  '编程助手': '💻',
  '设计工具': '✏️',
  'AI Agent': '🤖',
  '效率工具': '⚡',
  '搜索引擎': '🔍',
  '音频语音': '🎵',
};

export default function AIProductCard({ product, onSelect, commentCount }) {
  const [imgError, setImgError] = useState(false);
  const catColor = CATEGORY_COLORS[product.category] || { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' };

  return (
    <div
      className="ai-product-card"
      onClick={() => onSelect(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(product); }}
    >
      <div className="ai-product-card__header">
        <div className="ai-product-card__icon-wrapper">
          {!imgError ? (
            <img
              src={product.icon}
              alt={product.name}
              className="ai-product-card__icon"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="ai-product-card__icon-fallback">
              {FALLBACK_ICONS[product.category] || '🤖'}
            </span>
          )}
        </div>
        <div className="ai-product-card__title-area">
          <div className="ai-product-card__name-row">
            <h4 className="ai-product-card__name">{product.name}</h4>
            {product.isNew && <span className="ai-product-badge badge-new">NEW</span>}
            {product.isHot && <span className="ai-product-badge badge-hot">HOT</span>}
          </div>
          <span className="ai-product-card__company">{product.company}</span>
        </div>
        <span className="ai-product-card__users">{product.users}</span>
      </div>
      <p className="ai-product-card__desc">{product.description}</p>
      <div className="ai-product-card__footer">
        <span
          className="ai-product-card__cat"
          style={{ background: catColor.bg, color: catColor.color }}
        >
          {product.category}
        </span>
        <div className="ai-product-card__tags">
          {product.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="ai-product-card__tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="ai-product-card__actions">
          <span className="ai-product-card__action-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8v4h-8V6Z" />
            </svg>
            新闻
          </span>
          {commentCount > 0 && (
            <span className="ai-product-card__comment-count">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {commentCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
