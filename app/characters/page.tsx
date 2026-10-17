import type { Metadata } from 'next';
import Image from '@/app/components/ArchiveImage';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { characters } from '@/lib/archive';

export const metadata: Metadata = {
  title: '角色档案',
  description: '八位核心角色的官方插画、资料与卷宗索引。',
};

export default function CharactersPage() {
  return (
    <div className="index-page">
      <header className="page-hero" data-index="01">
        <div className="page-shell">
          <p className="eyebrow">Character contact sheets / verified artwork</p>
          <h1>八位核心角色，<br />不靠猜测辨认。</h1>
          <p className="page-hero__lede">
            角色主图均来自用户提供的原作 EPUB，并经过卷首图人工核对。其他人物只作为来源明确的关系节点出现。
          </p>
        </div>
      </header>
      <section className="index-content">
        <div className="page-shell character-index-grid">
          {characters.map((character, index) => (
            <Link className="character-index-card" href={`/characters/${character.id}/`} key={character.id}>
              <div className="character-index-card__image">
                <Image
                  src={character.portraitSrc}
                  alt={`${character.name}官方插画`}
                  fill
                  sizes="(max-width: 760px) 50vw, (max-width: 1080px) 33vw, 25vw"
                  style={{ objectPosition: character.portraitPosition }}
                />
              </div>
              <div className="character-index-card__copy">
                <p className="eyebrow">{String(index + 1).padStart(2, '0')} / {character.romaji}</p>
                <strong>{character.name}</strong>
                <p>{character.tagline}</p>
                <ArrowUpRight aria-hidden="true" size={18} style={{ position: 'absolute', right: 14, top: 16 }} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
