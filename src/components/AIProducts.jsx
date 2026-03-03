import { useState } from 'react';
import AIProductCard from './AIProductCard';
import ProductDetail from './ProductDetail';
import TrendingRank from './TrendingRank';

export default function AIProducts({
  products,
  trendingProducts,
  categories,
  categoryFilter,
  onCategoryChange,
  categoryCounts,
  searchQuery,
  onSearchChange,
  lastUpdated,
  totalCount,
  // Product detail props
  productNews,
  productNewsLoading,
  productNewsError,
  onFetchProductNews,
  getComments,
  onAddComment,
  onLikeComment,
}) {
  const [showAll, setShowAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const INITIAL_COUNT = 12;
  const displayProducts = showAll ? products : products.slice(0, INITIAL_COUNT);
  const hasMore = products.length > INITIAL_COUNT;
  const showSidebar = categoryFilter === 'all' && !searchQuery && trendingProducts?.length > 0;

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    onFetchProductNews(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  return (
    <section className="ai-products-section">
      <div className="ai-products-header">
        <div className="ai-products-title-area">
          <h2 className="ai-products-title">
            <span className="ai-products-title-icon">🚀</span>
            热门 AI 产品
          </h2>
          <div className="ai-products-meta">
            <span className="ai-products-count">{totalCount} 款产品</span>
            <span className="ai-products-divider">·</span>
            <span className="ai-products-date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              每日更新 · {lastUpdated}
            </span>
            <span className="ai-products-divider">·</span>
            <span className="ai-products-hint">点击产品查看新闻与评论</span>
          </div>
        </div>
        <div className="ai-products-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ai-products-search-icon">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="ai-products-search"
            placeholder="搜索 AI 产品..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="ai-products-filters">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`ai-products-filter-btn ${categoryFilter === cat.key ? 'active' : ''}`}
            onClick={() => {
              onCategoryChange(cat.key);
              setShowAll(false);
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <span className="ai-products-filter-count">{categoryCounts[cat.key] || 0}</span>
          </button>
        ))}
      </div>

      <div className={`ai-products-layout ${showSidebar ? 'has-sidebar' : ''}`}>
        <div className="ai-products-main">
          {products.length === 0 ? (
            <div className="ai-products-empty">
              <span className="ai-products-empty-icon">🔍</span>
              <p>没有找到匹配的 AI 产品</p>
            </div>
          ) : (
            <>
              <div className="ai-products-grid">
                {displayProducts.map((product) => (
                  <AIProductCard
                    key={product.id}
                    product={product}
                    onSelect={handleSelectProduct}
                    commentCount={(getComments(product.id) || []).length}
                  />
                ))}
              </div>
              {hasMore && !showAll && (
                <div className="ai-products-show-more">
                  <button className="ai-products-more-btn" onClick={() => setShowAll(true)}>
                    查看全部 {products.length} 款产品
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              )}
              {showAll && hasMore && (
                <div className="ai-products-show-more">
                  <button className="ai-products-more-btn" onClick={() => setShowAll(false)}>
                    收起
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {showSidebar && (
          <aside className="ai-products-sidebar">
            <TrendingRank products={trendingProducts} onSelectProduct={handleSelectProduct} />
          </aside>
        )}
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={handleCloseDetail}
          news={productNews}
          newsLoading={productNewsLoading}
          newsError={productNewsError}
          comments={getComments(selectedProduct.id)}
          onAddComment={onAddComment}
          onLikeComment={onLikeComment}
        />
      )}
    </section>
  );
}
