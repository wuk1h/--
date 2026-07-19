'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpenText, Images, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import {
  archiveMeta,
  artworkById,
  artworks,
  characterById,
  characters,
  featuredArtworkRows,
  relationships,
  volumes,
  type Artwork,
  type Volume,
} from '@/lib/archive';
import { SectionIntro } from './SectionIntro';

gsap.registerPlugin(ScrollTrigger);

type AutoLoopController = {
  viewport: HTMLElement;
  primarySet: HTMLElement;
  cloneSet: HTMLElement;
  direction: 1 | -1;
  speed: number;
  distance: number;
  inView: boolean;
  hovered: boolean;
  focused: boolean;
  pointerDown: boolean;
  resumeAt: number;
  cleanup: () => void;
};

function bindLoopControls(controller: AutoLoopController, reducedMotion = false) {
  const { viewport, primarySet } = controller;
  let dragging = false;
  let dragged = false;
  let pointerId = -1;
  let pointerStartX = 0;
  let pointerStartScroll = 0;
  let suppressClickUntil = 0;
  let resumeTimer = 0;

  const holdMotion = () => {
    window.clearTimeout(resumeTimer);
    viewport.classList.add('is-manual-pause');
  };
  const delayResume = () => {
    controller.resumeAt = performance.now() + 2500;
    holdMotion();
    resumeTimer = window.setTimeout(() => {
      viewport.classList.remove('is-manual-pause');
    }, 2500);
  };
  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') controller.hovered = true;
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') {
      controller.hovered = false;
      delayResume();
    }
  };
  const onPointerDown = (event: PointerEvent) => {
    controller.pointerDown = true;
    controller.resumeAt = Number.POSITIVE_INFINITY;
    holdMotion();
    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    dragging = true;
    dragged = false;
    pointerId = event.pointerId;
    pointerStartX = event.clientX;
    pointerStartScroll = viewport.scrollLeft;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(pointerId);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== pointerId) return;
    const distance = event.clientX - pointerStartX;
    if (Math.abs(distance) > 5) dragged = true;
    if (!dragged) return;
    event.preventDefault();
    viewport.scrollLeft = pointerStartScroll - distance;
  };
  const finishPointer = (event: PointerEvent) => {
    controller.pointerDown = false;
    if (dragging && event.pointerId === pointerId) {
      if (viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
      if (dragged) suppressClickUntil = performance.now() + 500;
      dragging = false;
      dragged = false;
      viewport.classList.remove('is-dragging');
    }
    delayResume();
  };
  const onClickCapture = (event: MouseEvent) => {
    if (performance.now() >= suppressClickUntil) return;
    event.preventDefault();
    event.stopPropagation();
  };
  const onFocusIn = () => {
    controller.focused = true;
    controller.resumeAt = Number.POSITIVE_INFINITY;
    holdMotion();
  };
  const onFocusOut = (event: FocusEvent) => {
    if (event.relatedTarget instanceof Node && viewport.contains(event.relatedTarget)) return;
    controller.focused = false;
    delayResume();
  };
  const onWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey) delayResume();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const firstCard = primarySet.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(primarySet).columnGap) || 0;
    const step = (firstCard?.getBoundingClientRect().width ?? viewport.clientWidth * 0.7) + gap;
    viewport.scrollBy({
      left: event.key === 'ArrowRight' ? step : -step,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
    delayResume();
  };

  viewport.addEventListener('pointerenter', onPointerEnter);
  viewport.addEventListener('pointerleave', onPointerLeave);
  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', finishPointer);
  viewport.addEventListener('pointercancel', finishPointer);
  viewport.addEventListener('click', onClickCapture, true);
  viewport.addEventListener('focusin', onFocusIn);
  viewport.addEventListener('focusout', onFocusOut);
  viewport.addEventListener('wheel', onWheel, { passive: true });
  viewport.addEventListener('keydown', onKeyDown);

  return () => {
    window.clearTimeout(resumeTimer);
    viewport.classList.remove('is-dragging', 'is-manual-pause');
    viewport.removeEventListener('pointerenter', onPointerEnter);
    viewport.removeEventListener('pointerleave', onPointerLeave);
    viewport.removeEventListener('pointerdown', onPointerDown);
    viewport.removeEventListener('pointermove', onPointerMove);
    viewport.removeEventListener('pointerup', finishPointer);
    viewport.removeEventListener('pointercancel', finishPointer);
    viewport.removeEventListener('click', onClickCapture, true);
    viewport.removeEventListener('focusin', onFocusIn);
    viewport.removeEventListener('focusout', onFocusOut);
    viewport.removeEventListener('wheel', onWheel);
    viewport.removeEventListener('keydown', onKeyDown);
  };
}

function VolumeTicketContent({ volume, decorative = false }: { volume: Volume; decorative?: boolean }) {
  return (
    <>
      <span className="volume-ticket__number">VOL.{volume.number}</span>
      <div className="volume-ticket__cover">
        {volume.coverSrc && (
          <Image src={volume.coverSrc} alt={decorative ? '' : `${volume.label}封面`} fill sizes="286px" />
        )}
      </div>
      <div className="volume-ticket__copy">
        <strong>{volume.label}</strong>
        <span>{volume.artworkIds.length} IMAGES / EPUB VERIFIED</span>
      </div>
    </>
  );
}

function ArtworkLoopCard({ artwork, decorative = false }: { artwork: Artwork; decorative?: boolean }) {
  const style = {
    '--artwork-aspect': `${artwork.width} / ${artwork.height}`,
  } as React.CSSProperties;
  const content = (
    <>
      <span className="artwork-loop-card__media">
        <Image
          src={artwork.src}
          alt={decorative ? '' : artwork.alt}
          fill
          sizes="(max-width: 760px) 60vw, 32vw"
          style={{ objectPosition: artwork.focalPoint }}
        />
      </span>
      <span className="gallery-strip__label">{artwork.id.toUpperCase()}</span>
    </>
  );

  if (decorative) {
    return <div className="artwork-loop-card" style={style}>{content}</div>;
  }

  return (
    <Link className="artwork-loop-card" href={`/gallery/?artwork=${artwork.id}`} style={style}>
      {content}
    </Link>
  );
}

export function HomeExperience() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero__copy > *', {
          y: 34,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
        });
        gsap.from('.hero-sheet', {
          yPercent: 24,
          rotation: 0,
          opacity: 0,
          duration: 1.15,
          stagger: 0.14,
          ease: 'power4.out',
        });
        const ambientMotion = gsap.timeline({ repeat: -1, yoyo: true });
        ambientMotion
          .to('.hero__background img', {
            scale: 1.055,
            xPercent: -1.2,
            duration: 10,
            ease: 'sine.inOut',
          }, 0)
          .to('.hero-sheet__media--primary', {
            scale: 1.045,
            xPercent: -1.4,
            yPercent: -0.8,
            duration: 7.4,
            ease: 'sine.inOut',
          }, 0)
          .to('.hero-sheet__media--secondary', {
            scale: 1.055,
            xPercent: 1.2,
            yPercent: -1.2,
            duration: 8.6,
            ease: 'sine.inOut',
          }, 0)
          .to('.hero__stamp', {
            rotation: -5,
            scale: 1.04,
            duration: 5.2,
            ease: 'sine.inOut',
          }, 0);

        const loopControllers: AutoLoopController[] = [];
        const loopObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const controller = loopControllers.find((candidate) => candidate.viewport === entry.target);
            if (controller) {
              controller.inView = entry.isIntersecting;
              controller.viewport.classList.toggle('is-outside', !entry.isIntersecting);
            }
          });
        }, { rootMargin: '12% 0px', threshold: 0.01 });

        const measureLoop = (controller: AutoLoopController) => {
          const track = controller.viewport.querySelector<HTMLElement>('.auto-loop__track');
          const nextDistance = controller.cloneSet.offsetLeft - controller.primarySet.offsetLeft;
          if (!track || nextDistance <= 0) return;

          controller.distance = nextDistance;
          track.style.setProperty('--loop-distance', `${nextDistance}px`);
          track.style.setProperty('--loop-duration', `${nextDistance / controller.speed}s`);
          controller.viewport.classList.add('is-auto-ready');
        };

        const loopResizeObserver = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const controller = loopControllers.find((candidate) => candidate.primarySet === entry.target);
            if (controller) measureLoop(controller);
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-auto-loop]').forEach((viewport) => {
          const primarySet = viewport.querySelector<HTMLElement>('[data-loop-set="primary"]');
          const cloneSet = viewport.querySelector<HTMLElement>('[data-loop-set="clone"]');
          if (!primarySet || !cloneSet) return;

          const controller: AutoLoopController = {
            viewport,
            primarySet,
            cloneSet,
            direction: viewport.dataset.direction === 'reverse' ? -1 : 1,
            speed: Number(viewport.dataset.speed ?? 18),
            distance: 0,
            inView: false,
            hovered: false,
            focused: false,
            pointerDown: false,
            resumeAt: 0,
            cleanup: () => undefined,
          };
          controller.cleanup = bindLoopControls(controller);

          loopControllers.push(controller);
          viewport.classList.add('is-outside');
          measureLoop(controller);
          loopObserver.observe(viewport);
          loopResizeObserver.observe(primarySet);
        });

        const syncVisibility = () => {
          ambientMotion.paused(document.hidden);
          loopControllers.forEach((controller) => {
            controller.viewport.classList.toggle('is-page-hidden', document.hidden);
          });
        };
        document.addEventListener('visibilitychange', syncVisibility);
        syncVisibility();
        gsap.to('.hero__background', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
        });
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, {
            y: 32,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          });
        });

        return () => {
          document.removeEventListener('visibilitychange', syncVisibility);
          loopObserver.disconnect();
          loopResizeObserver.disconnect();
          loopControllers.forEach((controller) => {
            const track = controller.viewport.querySelector<HTMLElement>('.auto-loop__track');
            controller.cleanup();
            controller.viewport.classList.remove('is-auto-ready', 'is-outside', 'is-page-hidden');
            track?.style.removeProperty('--loop-distance');
            track?.style.removeProperty('--loop-duration');
          });
          ambientMotion.kill();
        };
      });

      media.add('(prefers-reduced-motion: reduce)', () => {
        const cleanups = gsap.utils.toArray<HTMLElement>('[data-auto-loop]').map((viewport) => {
          const primarySet = viewport.querySelector<HTMLElement>('[data-loop-set="primary"]');
          const cloneSet = viewport.querySelector<HTMLElement>('[data-loop-set="clone"]');
          if (!primarySet || !cloneSet) return () => undefined;

          const controller: AutoLoopController = {
            viewport,
            primarySet,
            cloneSet,
            direction: viewport.dataset.direction === 'reverse' ? -1 : 1,
            speed: 0,
            distance: 0,
            inView: true,
            hovered: false,
            focused: false,
            pointerDown: false,
            resumeAt: 0,
            cleanup: () => undefined,
          };
          return bindLoopControls(controller, true);
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      });

      media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to('.hero-sheet--primary', {
          yPercent: -12,
          rotation: 7,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
        });
        gsap.to('.hero-sheet--secondary', {
          yPercent: 16,
          rotation: -8,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
        });
      });
      return () => media.revert();
    },
    { scope: root },
  );

  const featuredRows = featuredArtworkRows.map((row) => row
    .map((id) => artworkById.get(id))
    .filter((artwork): artwork is Artwork => artwork !== undefined));

  return (
    <div ref={root}>
      <section className="hero" aria-labelledby="home-title">
        <div className="hero__background">
          <Image
            src="/archive/backgrounds/campus-corridor.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="hero__kicker"><Sparkles size={14} /> OFFICIAL ARTWORK ARCHIVE</p>
            <h1 id="home-title">败犬青春<span>档案。</span></h1>
            <p className="hero__lede">
              从一次家庭餐厅里的失恋开始，沿着九册原作、{artworks.length} 张官方图像与双语原文，重新翻阅那些因败北而闪耀的青春。
            </p>
            <div className="hero__actions">
              <Link className="command-link" href="/characters/">
                浏览角色 <ArrowRight size={16} />
              </Link>
              <Link className="command-link" href="/gallery/">
                打开插画档案 <Images size={16} />
              </Link>
            </div>
            <div className="hero__stats" aria-label="档案统计">
              <div><strong>{artworks.length}</strong><span>官方图像</span></div>
              <div><strong>{archiveMeta.excerptCount}</strong><span>双语摘录</span></div>
              <div><strong>8</strong><span>核心角色</span></div>
            </div>
          </div>
          <div className="hero__art" aria-label="官方插画拼贴">
            <div className="hero-sheet hero-sheet--primary">
              <div className="hero-sheet__media hero-sheet__media--primary">
                <Image
                  src="/archive/volumes/v1/art-002.webp"
                  alt="八奈见杏菜第一卷官方插画"
                  fill
                  priority
                  sizes="(max-width: 760px) 46vw, 30vw"
                  style={{ objectPosition: '50% 18%' }}
                />
              </div>
            </div>
            <div className="hero-sheet hero-sheet--secondary">
              <div className="hero-sheet__media hero-sheet__media--secondary">
                <Image
                  src="/archive/volumes/sss/art-004.webp"
                  alt="八奈见杏菜、烧盐柠檬与小鞠知花官方插画"
                  fill
                  priority
                  sizes="(max-width: 760px) 58vw, 38vw"
                  style={{ objectPosition: '50% 50%' }}
                />
              </div>
            </div>
            <div className="hero__stamp" aria-hidden="true">SOURCE<br />VERIFIED</div>
          </div>
        </div>
      </section>

      <div className="archive-marquee" aria-hidden="true">
        <div className="archive-marquee__track">
          {[0, 1].map((copy) => (
            <span key={copy}>MAKEINE ARCHIVE · 负けヒロインが多すぎる！ · {archiveMeta.collectionLabel} · CHARACTER / VOLUME / ARTWORK · </span>
          ))}
        </div>
      </div>

      <section className="home-section home-section--characters">
        <div className="page-shell">
          <SectionIntro
            index="01"
            eyebrow="Character contact sheets"
            title="八位角色，八种败北之后的光。"
            description="人物页面只使用人工核对过的官方插画。点击档案，查看资料、关系与所在卷宗。"
            action={<Link className="text-link" href="/characters/">完整角色索引 <ArrowRight size={15} /></Link>}
          />
          <div className="character-collage">
            {characters.map((character, index) => (
              <Link
                className="character-poster"
                href={`/characters/${character.id}/`}
                key={character.id}
                data-reveal
                style={{ '--poster-accent': character.accent } as React.CSSProperties}
              >
                <span className="character-poster__tape" aria-hidden="true" />
                <div className="character-poster__image">
                  <Image
                    src={character.portraitSrc}
                    alt={`${character.name}官方插画`}
                    fill
                    sizes="(max-width: 760px) 48vw, (max-width: 1080px) 33vw, 24vw"
                    style={{ objectPosition: character.portraitPosition }}
                  />
                </div>
                <div className="character-poster__copy">
                  <span>{String(index + 1).padStart(2, '0')} / {character.romaji}</span>
                  <strong>{character.name}</strong>
                  <p>{character.role}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--volumes">
        <div className="page-shell">
          <SectionIntro
            index="02"
            eyebrow="Volume rail / supplied collection"
            title="九段卷宗，沿着书脊向前。"
            description={`当前素材收录 ${archiveMeta.collectionLabel}；作品最新出版状态单独标注为 ${archiveMeta.publishedStatus}。`}
            action={<Link className="text-link" href="/volumes/">全部卷宗 <ArrowRight size={15} /></Link>}
          />
        </div>
        <div
          className="auto-loop volume-loop"
          data-auto-loop
          data-direction="forward"
          data-speed="24"
          aria-label="卷宗自动画带，可拖动或使用左右方向键浏览"
          tabIndex={0}
        >
          <div className="auto-loop__track">
            <div className="auto-loop__set volume-rail__set" data-loop-set="primary">
              {volumes.map((volume) => (
                <Link className="volume-ticket" href={`/volumes/${volume.id}/`} key={volume.id}>
                  <VolumeTicketContent volume={volume} />
                </Link>
              ))}
            </div>
            <div className="auto-loop__set volume-rail__set auto-loop__clone" data-loop-set="clone" aria-hidden="true">
              {volumes.map((volume) => (
                <div className="volume-ticket volume-ticket--clone" key={`clone-${volume.id}`}>
                  <VolumeTicketContent volume={volume} decorative />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-section--relations">
        <div className="page-shell">
          <SectionIntro
            index="03"
            eyebrow="Relationship notes"
            title="所有箭头，最后都指向温水。"
            description="关系不是恋爱结论，而是原作中已经发生的陪伴、社团和家庭联系。"
          />
          <div className="relation-stage">
            {relationships.map((relationship, index) => {
              const from = characterById.get(relationship.from);
              return (
                <Link
                  className="relation-node"
                  href={`/characters/${relationship.from}/`}
                  key={`${relationship.from}-${relationship.to}`}
                  data-reveal
                  style={{
                    '--relation-accent': from?.accent ?? 'var(--coral)',
                    '--relation-accent-ink': from?.ink ?? 'var(--ink)',
                  } as React.CSSProperties}
                >
                  <span className="relation-node__id">{String(index + 1).padStart(2, '0')}</span>
                  <strong>{from?.name}</strong>
                  <p>{relationship.label}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-section home-section--gallery">
        <div className="page-shell">
          <SectionIntro
            index="04"
            eyebrow="Selected plates"
            title="把插画放回它发生的章节。"
            description="每张图片保留 EPUB 内部来源路径，并与邻近中日双语段落建立可追溯关联。"
            action={<Link className="command-link" href="/gallery/">探索 {artworks.length} 张图 <ArrowRight size={15} /></Link>}
          />
        </div>
        <div className="gallery-loops">
          {featuredRows.map((row, rowIndex) => (
            <div
              className="auto-loop artwork-loop"
              data-auto-loop
              data-direction={rowIndex === 0 ? 'forward' : 'reverse'}
              data-speed={rowIndex === 0 ? '18' : '15'}
              aria-label={`精选插画第 ${rowIndex + 1} 排，可拖动或使用左右方向键浏览`}
              tabIndex={0}
              key={`featured-row-${rowIndex + 1}`}
            >
              <div className="auto-loop__track">
                <div className="auto-loop__set artwork-loop__set" data-loop-set="primary">
                  {row.map((artwork) => <ArtworkLoopCard artwork={artwork} key={artwork.id} />)}
                </div>
                <div className="auto-loop__set artwork-loop__set auto-loop__clone" data-loop-set="clone" aria-hidden="true">
                  {row.map((artwork) => (
                    <ArtworkLoopCard artwork={artwork} decorative key={`clone-${artwork.id}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section" style={{ backgroundImage: 'url(/archive/backgrounds/literature-room.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="page-shell" data-reveal>
          <div style={{ maxWidth: 560, padding: 32, background: 'var(--paper)', border: '1px solid var(--ink)', boxShadow: '8px 9px 0 var(--ink)' }}>
            <p className="eyebrow">SOURCE NOTE / 2026.07</p>
            <h2 style={{ margin: 0, fontFamily: 'Yu Mincho, serif', fontSize: 38 }}>原作在继续，档案也会继续。</h2>
            <p style={{ lineHeight: 1.8, color: 'var(--ink-soft)', fontSize: 13 }}>
              本站不是全文阅读器。仅展示与插画相邻的短摘录，并明确卷宗、章节与 EPUB 来源；人物资料经原作与萌娘百科交叉核对。
            </p>
            <Link className="command-link" href="/volumes/"><BookOpenText size={16} /> 查看卷宗出处</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
