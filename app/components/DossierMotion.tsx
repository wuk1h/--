'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function DossierMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro.from('.dossier-hero__media', { clipPath: 'inset(0 100% 0 0)', duration: 1.15 })
        .from('.dossier-hero__copy > *', { y: 28, opacity: 0, stagger: 0.07, duration: 0.55 }, '-=0.7');

      gsap.utils.toArray<HTMLElement>('.timeline-record').forEach((record) => {
        gsap.from(record, {
          y: 34,
          opacity: 0,
          rotate: 0.8,
          duration: 0.7,
          scrollTrigger: { trigger: record, start: 'top 86%', once: true },
        });
        ScrollTrigger.create({
          trigger: record,
          start: 'top 62%',
          end: 'bottom 38%',
          onEnter: () => record.classList.add('is-current'),
          onEnterBack: () => record.classList.add('is-current'),
          onLeave: () => record.classList.remove('is-current'),
          onLeaveBack: () => record.classList.remove('is-current'),
        });
      });
      gsap.utils.toArray<HTMLElement>('.artwork-mosaic__item[data-mono="true"]').forEach((item) => {
        gsap.fromTo(item, { clipPath: 'inset(0 100% 0 0)', filter: 'grayscale(1)' }, {
          clipPath: 'inset(0 0% 0 0)', filter: 'grayscale(0)', duration: 0.9,
          scrollTrigger: { trigger: item, start: 'top 90%', once: true },
        });
      });
    });
    return () => media.revert();
  }, { scope: root });

  return <div ref={root}>{children}</div>;
}
