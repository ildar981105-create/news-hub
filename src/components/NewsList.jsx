import NewsCard from './NewsCard';

export default function NewsList({ articles, loading, error, translatedMap, translatingIds, onTranslateOne }) {
  if (loading) {
    return (
      <div className="news-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image shimmer" />
            <div className="skeleton-body">
              <div className="skeleton-line short shimmer" />
              <div className="skeleton-line shimmer" />
              <div className="skeleton-line shimmer" />
              <div className="skeleton-line medium shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⚠️</div>
        <p>{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <p>没有找到匹配的新闻</p>
      </div>
    );
  }

  return (
    <div className="news-grid">
      {articles.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
          translated={translatedMap[article.id]}
          isTranslating={translatingIds.has(article.id)}
          onTranslate={onTranslateOne}
        />
      ))}
    </div>
  );
}
