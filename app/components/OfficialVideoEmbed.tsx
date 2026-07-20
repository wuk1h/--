'use client';

import { Play } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useState } from 'react';

const allowedYouTubeId = /^[\w-]{6,24}$/;

export function OfficialVideoEmbed({
  title,
  youtubeId,
  accent,
}: {
  title: string;
  youtubeId: string;
  accent: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const safeId = allowedYouTubeId.test(youtubeId) ? youtubeId : '';

  return (
    <div className="official-video" style={{ '--video-accent': accent } as CSSProperties}>
      {loaded && safeId ? (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${safeId}`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" className="official-video__poster" onClick={() => setLoaded(true)}>
          <span className="official-video__play" aria-hidden="true"><Play size={30} fill="currentColor" /></span>
          <span>
            <small>OFFICIAL ANIME</small>
            <strong>{title}</strong>
          </span>
        </button>
      )}
    </div>
  );
}
