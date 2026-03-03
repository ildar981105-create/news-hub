import { useState, useCallback, useRef } from 'react';

const TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single';

async function translateText(text, targetLang = 'zh-CN') {
  if (!text || text.trim().length === 0) return text;
  // 已经是中文则跳过
  if (/^[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\s，。！？、；：""''（）]+$/.test(text.trim())) {
    return text;
  }

  const params = new URLSearchParams({
    client: 'gtx',
    sl: 'auto',
    tl: targetLang,
    dt: 't',
    q: text,
  });

  const res = await fetch(`${TRANSLATE_API}?${params}`);
  if (!res.ok) throw new Error(`Translation failed: ${res.status}`);
  const data = await res.json();

  // 响应格式: [[["翻译结果","原文",null,null,10],...]]
  if (data && data[0]) {
    return data[0].map((seg) => seg[0]).join('');
  }
  return text;
}

// 简单的翻译缓存
const cache = new Map();

async function cachedTranslate(text) {
  if (!text) return text;
  if (cache.has(text)) return cache.get(text);
  const result = await translateText(text);
  cache.set(text, result);
  return result;
}

export function useTranslate() {
  // translatedMap: { [articleId]: { title, description } }
  const [translatedMap, setTranslatedMap] = useState({});
  const [translatingIds, setTranslatingIds] = useState(new Set());
  const [globalTranslating, setGlobalTranslating] = useState(false);
  const abortRef = useRef(false);

  const translateOne = useCallback(async (article) => {
    const { id, title, description } = article;
    if (translatedMap[id]) return; // 已翻译

    setTranslatingIds((prev) => new Set(prev).add(id));
    try {
      const [tTitle, tDesc] = await Promise.all([
        cachedTranslate(title),
        cachedTranslate(description),
      ]);
      setTranslatedMap((prev) => ({
        ...prev,
        [id]: { title: tTitle, description: tDesc },
      }));
    } catch (err) {
      console.warn('Translation error:', err.message);
    } finally {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [translatedMap]);

  const translateAll = useCallback(async (articles) => {
    abortRef.current = false;
    setGlobalTranslating(true);

    // 分批翻译，每批 3 个，避免请求过快
    const batch = 3;
    const toTranslate = articles.filter((a) => !translatedMap[a.id]);

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
            cachedTranslate(article.title),
            cachedTranslate(article.description),
          ]);
          return { id: article.id, title: tTitle, description: tDesc };
        })
      );

      setTranslatedMap((prev) => {
        const next = { ...prev };
        results.forEach((r) => {
          if (r.status === 'fulfilled') {
            next[r.value.id] = { title: r.value.title, description: r.value.description };
          }
        });
        return next;
      });

      setTranslatingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });

      // 间隔 300ms 避免限流
      if (i + batch < toTranslate.length) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    setGlobalTranslating(false);
  }, [translatedMap]);

  const cancelTranslateAll = useCallback(() => {
    abortRef.current = true;
    setGlobalTranslating(false);
  }, []);

  const clearTranslations = useCallback(() => {
    setTranslatedMap({});
    abortRef.current = true;
    setGlobalTranslating(false);
  }, []);

  return {
    translatedMap,
    translatingIds,
    globalTranslating,
    translateOne,
    translateAll,
    cancelTranslateAll,
    clearTranslations,
  };
}
