export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#grad)" />
              <path d="M8 12h16M8 16h12M8 20h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="header-title">
              AI & Design News
              <span className="header-version">v2.0</span>
            </h1>
            <p className="header-subtitle">大模型 · AI Agent · 设计工具 资讯聚合</p>
          </div>
        </div>

        <nav className="header-tabs">
          <button
            className={`header-tab ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => onTabChange('news')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M18 14h-8" />
              <path d="M15 18h-5" />
              <path d="M10 6h8v4h-8V6Z" />
            </svg>
            新闻资讯
          </button>
          <button
            className={`header-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => onTabChange('products')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
            AI 产品库
            <span className="header-tab-badge">Hot</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
