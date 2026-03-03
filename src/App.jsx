import { useState, useMemo } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import NewsList from './components/NewsList';
import AIProducts from './components/AIProducts';
import RecentUpdates from './components/RecentUpdates';
import { useNews } from './hooks/useNews';
import { useTranslate } from './hooks/useTranslate';
import { useAIProducts } from './hooks/useAIProducts';
import { useProductNews } from './hooks/useProductNews';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('news');

  const {
    articles,
    allArticles,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    refresh,
    lastFetched,
  } = useNews();

  const {
    translatedMap,
    translatingIds,
    globalTranslating,
    translateOne,
    translateAll,
    clearTranslations,
  } = useTranslate();

  const {
    products,
    allProducts,
    trendingProducts,
    categories: productCategories,
    categoryFilter,
    setCategoryFilter,
    searchQuery: productSearch,
    setSearchQuery: setProductSearch,
    categoryCounts,
    lastUpdated,
    totalCount,
    refreshProducts,
  } = useAIProducts();

  const {
    news: productNews,
    loading: productNewsLoading,
    error: productNewsError,
    fetchNews: fetchProductNews,
    getComments,
    addComment,
    likeComment,
  } = useProductNews();

  const counts = {
    all: allArticles.length,
    LLM: allArticles.filter((a) => a.category === 'LLM').length,
    'Agent & Design': allArticles.filter((a) => a.category === 'Agent & Design').length,
  };

  const hasTranslations = Object.keys(translatedMap).length > 0;

  // 24小时内的新新闻
  const recentNews = useMemo(() => {
    const cutoff = Date.now() - 86400000;
    return allArticles.filter((a) => new Date(a.pubDate).getTime() > cutoff);
  }, [allArticles]);

  // 新产品（isNew 标记的）
  const recentProducts = useMemo(() => {
    return (allProducts || []).filter((p) => p.isNew);
  }, [allProducts]);

  const handleRefreshAll = () => {
    refresh();
    refreshProducts();
  };

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main">
        {activeTab === 'news' ? (
          <>
            <div className="ai-products-header">
              <div className="ai-products-title-area">
                <h2 className="ai-products-title">
                  <span className="ai-products-title-icon">📰</span>
                  AI 新闻资讯
                </h2>
                <div className="ai-products-meta">
                  <span className="ai-products-count">{allArticles.length} 篇文章</span>
                  <span className="ai-products-divider">·</span>
                  <span className="ai-products-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    更新于 {lastFetched || '加载中...'}
                  </span>
                  <span className="ai-products-divider">·</span>
                  <span className="ai-products-hint">Google News · TechCrunch · The Verge</span>
                </div>
              </div>
              <div className="news-section-actions">
                <div className="ai-products-search-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ai-products-search-icon">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    className="ai-products-search"
                    placeholder="搜索新闻..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  className={`translate-all-btn ${globalTranslating ? 'translating' : ''} ${hasTranslations ? 'has-translations' : ''}`}
                  onClick={hasTranslations ? clearTranslations : () => translateAll(articles)}
                  disabled={globalTranslating && !hasTranslations}
                  title={hasTranslations ? '显示原文' : globalTranslating ? '翻译中...' : '全部翻译为中文'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={globalTranslating ? 'pulse' : ''}>
                    <path d="m5 8 6 6" />
                    <path d="m4 14 6-6 2-3" />
                    <path d="M2 5h12" />
                    <path d="M7 2h1" />
                    <path d="m22 22-5-10-5 10" />
                    <path d="M14 18h6" />
                  </svg>
                  <span className="translate-all-label">
                    {hasTranslations ? '原文' : globalTranslating ? '翻译中...' : '翻译全部'}
                  </span>
                </button>
                <button className="refresh-btn" onClick={refresh} disabled={loading} title="刷新">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? 'spin' : ''}>
                    <path d="M21.5 2v6h-6M2.5 22v-6h6" />
                    <path d="M2.5 11.5a10 10 0 0 1 18.8-4.3M21.5 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                </button>
              </div>
            </div>
            <RecentUpdates
              recentNews={recentNews}
              recentProducts={recentProducts}
              lastFetched={lastFetched}
              onRefresh={handleRefreshAll}
              loading={loading}
              onTabChange={setActiveTab}
            />
            <FilterBar filter={filter} onFilterChange={setFilter} counts={counts} />
            <NewsList
              articles={articles}
              loading={loading}
              error={error}
              translatedMap={translatedMap}
              translatingIds={translatingIds}
              onTranslateOne={translateOne}
            />
          </>
        ) : (
          <AIProducts
            products={products}
            trendingProducts={trendingProducts}
            categories={productCategories}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categoryCounts={categoryCounts}
            searchQuery={productSearch}
            onSearchChange={setProductSearch}
            lastUpdated={lastUpdated}
            totalCount={totalCount}
            productNews={productNews}
            productNewsLoading={productNewsLoading}
            productNewsError={productNewsError}
            onFetchProductNews={fetchProductNews}
            getComments={getComments}
            onAddComment={addComment}
            onLikeComment={likeComment}
          />
        )}
      </main>
      <footer className="footer">
        <p>数据来源：Google News · TechCrunch · The Verge · UX Collective · Smashing Magazine</p>
        <p>新闻自动聚合，仅供阅读参考 · 翻译由 Google Translate 提供</p>
        <div className="footer-version">
          <span className="footer-version-badge">v2.0.0</span>
          <span className="footer-version-log">
            新闻聚合 · AI 产品库 · 产品新闻 & 评论 · 批量翻译 · 每日更新
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
