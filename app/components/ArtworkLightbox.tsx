'use client';

import Image from './ArchiveImage';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import {
  characterById,
  excerptById,
  volumeById,
  type Artwork,
} from '@/lib/archive';
import { BilingualExcerpt } from './BilingualExcerpt';

export function ArtworkLightbox({
  artwork,
  onClose,
  onPrevious,
  onNext,
}: {
  artwork: Artwork;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const excerpt = artwork.excerptId ? excerptById.get(artwork.excerptId) : undefined;
  const volume = volumeById.get(artwork.volumeId);
  const title = artwork.title ?? `${artwork.id.toUpperCase()} 插画`;

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrevious?.();
      if (event.key === 'ArrowRight') onNext?.();
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose, onNext, onPrevious],
  );

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('button')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const finishSwipe = (clientX: number) => {
    if (touchStartX.current === null) return;
    const delta = clientX - touchStartX.current;
    if (Math.abs(delta) > 60) {
      if (delta > 0) onPrevious?.();
      else onNext?.();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${volume?.label ?? artwork.volumeId} 插画详情`}
      ref={panelRef}
    >
      <button className="icon-button lightbox__close" type="button" aria-label="关闭插画" onClick={onClose}>
        <X aria-hidden="true" />
      </button>
      <div
        className="lightbox__image"
        onTouchStart={(event) => { touchStartX.current = event.changedTouches[0].clientX; }}
        onTouchEnd={(event) => finishSwipe(event.changedTouches[0].clientX)}
      >
        <Image src={artwork.src} alt={artwork.alt} fill priority sizes="(max-width: 760px) 100vw, 74vw" style={{ viewTransitionName: `artwork-${artwork.id}` }} />
        {onPrevious && (
          <button className="lightbox-nav lightbox-nav--prev" type="button" aria-label="上一张" onClick={onPrevious}>
            <ChevronLeft aria-hidden="true" />
          </button>
        )}
        {onNext && (
          <button className="lightbox-nav lightbox-nav--next" type="button" aria-label="下一张" onClick={onNext}>
            <ChevronRight aria-hidden="true" />
          </button>
        )}
      </div>
      <aside className="lightbox__panel">
        <p className="lightbox__meta">{artwork.id.toUpperCase()} / {volume?.label} / {artwork.colorMode.toUpperCase()}</p>
        <h2>{title}</h2>
        <p className="lightbox__description">
          {artwork.sceneDescription ?? '该插画未进行人物标注；保留在卷宗与全量画廊中，不进入角色档案。'}
        </p>
        <div className="lightbox__characters" aria-label="人物名单">
          {artwork.characterIds.length ? artwork.characterIds.map((id) => (
            <span key={id}>{characterById.get(id)?.name}</span>
          )) : <span>未进行人物标注</span>}
        </div>
        <dl className="lightbox__facts">
          <div><dt>卷章来源</dt><dd>{artwork.sourceChapter ?? artwork.chapter}</dd></div>
          <div><dt>描述状态</dt><dd>{artwork.descriptionReviewStatus === 'verified' ? '人工复核' : '未发布标注'}</dd></div>
          <div><dt>素材版权</dt><dd>用户提供 EPUB 官方插画；本站仅作个人档案展示，不声称拥有版权。</dd></div>
        </dl>
        {excerpt ? <BilingualExcerpt excerpt={excerpt} /> : (
          <p className="excerpt-text">该图像为封面、卷首或附录素材，暂无可安全关联的正文摘录。</p>
        )}
      </aside>
    </div>
  );
}
