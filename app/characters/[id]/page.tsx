import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  characters,
  getArtworksForCharacter,
  getCharacter,
  relationships,
  characterById,
} from '@/lib/archive';
import { ArtworkMosaic } from '@/app/components/ArtworkMosaic';
import { SectionIntro } from '@/app/components/SectionIntro';

export function generateStaticParams() {
  return characters.map((character) => ({ id: character.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const character = getCharacter(id);
  return character
    ? { title: character.name, description: character.tagline }
    : { title: '角色未找到' };
}

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = getCharacter(id);
  if (!character) notFound();
  const artworks = getArtworksForCharacter(character.id);
  const links = relationships.filter((relationship) => relationship.from === character.id || relationship.to === character.id);

  return (
    <div className="detail-page">
      <header className="detail-hero" style={{ borderTop: `8px solid ${character.accent}` }}>
        <div className="detail-hero__copy">
          <p className="eyebrow">{character.role} / {character.kana}</p>
          <h1>{character.name}<small>{character.romaji}</small></h1>
          <p className="detail-hero__tagline">{character.tagline}</p>
          <p className="detail-hero__description">{character.description}</p>
        </div>
        <div className="detail-hero__image">
          <Image
            src={character.portraitSrc}
            alt={`${character.name}官方插画`}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 45vw"
            style={{ objectPosition: character.portraitPosition }}
          />
        </div>
      </header>
      <div className="fact-strip">
        {character.facts.map((fact) => (
          <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>
        ))}
      </div>
      {links.length > 0 && (
        <section className="detail-section">
          <div className="page-shell">
            <SectionIntro index="A" eyebrow="Relationship notes" title="已发生的关系，不替原作下结论。" />
            <div className="relation-stage" style={{ minHeight: 280 }}>
              {links.map((link, index) => {
                const otherId = link.from === character.id ? link.to : link.from;
                return (
                  <div className="relation-node" key={`${link.from}-${link.to}`}>
                    <span className="relation-node__id">{String(index + 1).padStart(2, '0')}</span>
                    <strong>{characterById.get(otherId)?.name}</strong>
                    <p>{link.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      <section className="detail-section">
        <div className="page-shell">
          <SectionIntro
            index="B"
            eyebrow="Verified appearances"
            title={`${artworks.length} 张已关联插画。`}
            description="只有卷首图人工确认或正文邻近来源能给出高置信结果时，才会写入人物标签。"
          />
          <ArtworkMosaic artworks={artworks} />
        </div>
      </section>
    </div>
  );
}
