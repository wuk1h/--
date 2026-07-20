'use client';

import { useState } from 'react';
import type { Excerpt } from '@/lib/archive';

export function BilingualExcerpt({ excerpt }: { excerpt: Excerpt }) {
  const [language, setLanguage] = useState<'zh' | 'ja'>('zh');
  const canShowJapanese = Boolean(excerpt.ja);
  const text = language === 'ja' && excerpt.ja
    ? excerpt.ja
    : excerpt.zh || '该插画附近暂未提取到中文正文。';

  return (
    <div>
      <div className="excerpt-toggle" aria-label="摘录语言">
        <button type="button" aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>
          中文
        </button>
        <button
          type="button"
          aria-pressed={language === 'ja'}
          disabled={!canShowJapanese}
          onClick={() => setLanguage('ja')}
        >
          日本語
        </button>
      </div>
      <p className="excerpt-text" lang={language === 'ja' ? 'ja' : 'zh-CN'}>
        {text}
      </p>
      <p className="excerpt-source">EPUB SOURCE / {excerpt.sourceFile}</p>
    </div>
  );
}
