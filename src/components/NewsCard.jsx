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

const PLACEHOLDER_COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

function getPlaceholder(title) {
  const idx = Math.abs(title.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % PLACEHOLDER_COLORS.length;
  return PLACEHOLDER_COLORS[idx];
}

function isWithin24h(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  return (now - date) < 86400000;
}

export default function NewsCard({ article, translated, isTranslating, onTranslate }) {
  const { title, description, link, pubDate, thumbnail, source, category, author } = article;
  const displayTitle = translated?.title || title;
  const displayDesc = translated?.description || description;
  const hasTranslation = !!translated;
  const isRecent = isWithin24h(pubDate);

  const handleTranslate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasTranslation && !isTranslating) {
      onTranslate(article);
    }
  };

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="news-card">
      <div className="card-image-wrapper">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="card-image"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="card-image-placeholder"
          style={{
            background: getPlaceholder(title),
            display: thumbnail ? 'none' : 'flex',
          }}
        >
          <span>{category === 'LLM' ? '🧠' : '🎨'}</span>
        </div>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className={`card-category ${category === 'LLM' ? 'cat-llm' : 'cat-agent'}`}>
            {category}
          </span>
          {isRecent && <span className="card-new-badge">NEW</span>}
          <span className="card-source">{source}</span>
          {author && <span className="card-author">{author}</span>}
          <span className="card-time">{timeAgo(pubDate)}</span>
        </div>
        <h3 className="card-title">{displayTitle}</h3>
        {displayDesc && <p className="card-desc">{displayDesc}...</p>}
        <div className="card-footer">
          <button
            className={`translate-btn ${hasTranslation ? 'translated' : ''} ${isTranslating ? 'loading' : ''}`}
            onClick={handleTranslate}
            title={hasTranslation ? '已翻译' : '翻译为中文'}
          >
            {isTranslating ? (
              <svg className="translate-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 8 6 6" />
                <path d="m4 14 6-6 2-3" />
                <path d="M2 5h12" />
                <path d="M7 2h1" />
                <path d="m22 22-5-10-5 10" />
                <path d="M14 18h6" />
              </svg>
            )}
            <span>{hasTranslation ? '已译' : isTranslating ? '翻译中' : '译'}</span>
          </button>
        </div>
      </div>
    </a>
  );
}
