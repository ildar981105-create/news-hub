const CATEGORIES = [
  { key: 'all', label: '全部', icon: '📰' },
  { key: 'LLM', label: '大模型动态', icon: '🧠' },
  { key: 'Agent & Design', label: 'Agent & 设计', icon: '🎨' },
];

export default function FilterBar({ filter, onFilterChange, counts }) {
  return (
    <div className="filter-bar">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          className={`filter-btn ${filter === cat.key ? 'active' : ''}`}
          onClick={() => onFilterChange(cat.key)}
        >
          <span className="filter-icon">{cat.icon}</span>
          <span className="filter-label">{cat.label}</span>
          <span className="filter-count">{counts[cat.key] || 0}</span>
        </button>
      ))}
    </div>
  );
}
