'use client';

import { Play } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useState } from 'react';

const allowedYouTubeId = /^[\w-]{6,24}$/;
const allowedBvid = /^BV[0-9A-Za-z]{10}$/;

export function OfficialVideoEmbed({
  title,
  youtubeId,
  bvid,
  provider = 'youtube',
  sourceUrl,
  accent,
}: {
  title: string;
  youtubeId?: string;
  bvid?: string;
  provider?: 'bilibili' | 'youtube';
  sourceUrl?: string;
  accent: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const safeId = youtubeId && allowedYouTubeId.test(youtubeId) ? youtubeId : '';
  const safeBvid = allowedBvid.test(bvid ?? '') ? bvid : '';
  const embedSrc = provider === 'bilibili' && safeBvid
    ? `https://player.bilibili.com/player.html?bvid=${safeBvid}&autoplay=0`
    : safeId
      ? `https://www.youtube-nocookie.com/embed/${safeId}`
      : '';

  return (
    <div className="official-video" style={{ '--video-accent': accent } as CSSProperties}>
      {loaded && embedSrc ? (
        <iframe
          title={title}
          src={embedSrc}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" className="official-video__poster" onClick={() => setLoaded(true)} disabled={!embedSrc}>
          <span className="official-video__play" aria-hidden="true"><Play size={30} fill="currentColor" /></span>
          <span>
            <small>{provider === 'bilibili' ? 'BILIBILI / OFFICIAL' : 'YOUTUBE / OFFICIAL'}</small>
            <strong>{title}</strong>
          </span>
        </button>
      )}
      {!loaded && sourceUrl && (
        <a className="official-video__source" href={sourceUrl} target="_blank" rel="noopener noreferrer">查看官方来源 ↗</a>
      )}
    </div>
  );
}
