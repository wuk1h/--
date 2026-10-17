import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from '@/app/components/ArchiveImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  artworkById,
  characterById,
  characters,
  excerptById,
  getCharacter,
  getCharacterDossier,
  volumeById,
  type Artwork,
  type CharacterDossier,
} from '@/lib/archive';
import { ArtworkMosaic } from '@/app/components/ArtworkMosaic';
import { BilingualExcerpt } from '@/app/components/BilingualExcerpt';
import { OfficialVideoEmbed } from '@/app/components/OfficialVideoEmbed';
import { SectionIntro } from '@/app/components/SectionIntro';
import { DossierMotion } from '@/app/components/DossierMotion';

export function generateStaticParams() {
  return characters.map((character) => ({ id: character.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const character = getCharacter(id);
  return character
    ? { title: `${character.name} | 角色档案`, description: character.tagline }
    : { title: '角色未找到' };
}

function artworksFrom(ids: string[]) {
  return ids
    .map((artworkId) => artworkById.get(artworkId))
    .filter((artwork): artwork is Artwork => Boolean(artwork));
}

function CharacterDossierHeader({ dossier }: { dossier: CharacterDossier }) {
  const character = characterById.get(dossier.characterId);
  const firstVolume = volumeById.get(dossier.firstFocusVolumeId);
  if (!character) return null;

  return (
    <header className="dossier-hero" style={{ '--character-accent': character.accent, '--character-ink': character.ink } as CSSProperties}>
      <div className="dossier-hero__media">
        <Image
          src={character.portraitSrc}
          alt={`${character.name} 官方 EPUB 主视觉`}
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: character.portraitPosition }}
        />
      </div>
      <div className="dossier-hero__copy">
        <p className="dossier-stamp">含剧透 / FULL DOSSIER</p>
        <p className="eyebrow">{dossier.dossierNo} / {character.role}</p>
        <h1>{character.name}<small>{character.nameJp} / {character.romaji}</small></h1>
        <p className="detail-hero__tagline">{character.tagline}</p>
        <p className="detail-hero__description">{character.description}</p>
        <div className="dossier-hero__facts">
          <span>{dossier.grade}</span>
          <span>{dossier.affiliation}</span>
          <span>{dossier.birthday}</span>
          <span>首次焦点：{firstVolume?.label ?? dossier.firstFocusVolumeId}</span>
          <span>{dossier.anime.status === 'covered' ? '动画第一季覆盖' : '当前动画进度尚未覆盖'}</span>
        </div>
      </div>
    </header>
  );
}

function CharacterQuotePanel({ dossier }: { dossier: CharacterDossier }) {
  return (
    <section className="detail-section detail-section--paper">
      <div className="page-shell">
        <SectionIntro
          index="01"
          eyebrow="Character in text"
          title="原文中的人物"
          description="含剧透。这里展示的是基于 EPUB 邻近章节整理的中文说明与日文标题/短句，不把自动候选当作正式结论。"
        />
        <div className="quote-layout">
          <article className="quote-summary">
            <span>PERSONALITY NOTE</span>
            <p>{dossier.personalitySummary}</p>
            <div className="keyword-strip">
              {dossier.keywords.map((keyword) => <b key={keyword}>{keyword}</b>)}
            </div>
          </article>
          <div className="quote-stack">
            {dossier.originalDescriptions.map((quote) => (
              <article className="quote-card" key={quote.id}>
                <p className="spoiler-label">含剧透 / 人工复核</p>
                <h3>{quote.title}</h3>
                <p>{quote.zh}</p>
                <blockquote lang="ja">{quote.ja}</blockquote>
                <small>{quote.source}</small>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CharacterTimeline({ dossier }: { dossier: CharacterDossier }) {
  return (
    <section className="detail-section detail-section--timeline">
      <div className="page-shell">
        <SectionIntro
          index="02"
          eyebrow="Spoiler timeline"
          title="卷宗时刻"
          description="含剧透。每个时刻都绑定卷封、插画和 EPUB 摘录，用来把人物成长线补完整。"
        />
        <div className="dossier-timeline">
          {dossier.moments.map((moment, index) => {
            const volume = volumeById.get(moment.volumeId);
            const artwork = artworkById.get(moment.artworkId);
            const excerpt = excerptById.get(moment.excerptId);
            return (
              <article className="timeline-record" key={moment.id}>
                <div className="timeline-record__index">{String(index + 1).padStart(2, '0')}</div>
                <div className="timeline-record__cover">
                  {volume?.coverSrc && <Image src={volume.coverSrc} alt={`${volume.label} 封面`} fill sizes="120px" />}
                </div>
                <div className="timeline-record__body">
                  <p className="spoiler-label">含剧透 / {volume?.label}</p>
                  <h3>{moment.title}</h3>
                  <p>{moment.summary}</p>
                  <small>{moment.sourceFile}</small>
                  {excerpt && <BilingualExcerpt excerpt={excerpt} />}
                </div>
                {artwork && (
                  <div className="timeline-record__art">
                    <Image src={artwork.thumbnailSrc} alt={artwork.alt} fill sizes="(max-width: 760px) 40vw, 180px" />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CharacterRelationshipRecords({ dossier }: { dossier: CharacterDossier }) {
  return (
    <section className="detail-section detail-section--mint">
      <div className="page-shell">
        <SectionIntro index="03" eyebrow="Relationship records" title="双人档案记录" />
        <div className="relationship-records">
          {dossier.connections.map((connection, index) => {
            const linked = connection.characterId ? characterById.get(connection.characterId) : undefined;
            const name = linked?.name ?? connection.verifiedName;
            const content = (
              <>
                <span className="relation-node__id">{String(index + 1).padStart(2, '0')}</span>
                <strong>{name}</strong>
                <em>{connection.label}</em>
                <p>{connection.description}</p>
                <small>{connection.source} / 人工复核</small>
              </>
            );
            return linked ? (
              <Link className="relationship-record" data-character-target={linked.id} href={`/characters/${linked.id}/`} key={connection.id}>
                {content}
              </Link>
            ) : (
              <article className="relationship-record" key={connection.id}>{content}</article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CharacterArtworkGallery({ dossier }: { dossier: CharacterDossier }) {
  const hero = artworksFrom(dossier.artworkSections.hero);
  const mono = artworksFrom(dossier.artworkSections.monochrome);
  const ensemble = artworksFrom(dossier.artworkSections.ensemble);
  const archive = artworksFrom(dossier.artworkSections.archive);

  return (
    <section className="detail-section detail-section--gallery-rich">
      <div className="page-shell">
        <SectionIntro
          index="04"
          eyebrow="Verified artworks"
          title="已核实人物插画"
          description="彩页、黑白正文、多人数同框分开展示；未确认的人物图不会进入这里。"
        />
        <div className="artwork-section-stack">
          <div>
            <h3>彩色主视觉</h3>
            <ArtworkMosaic artworks={hero} showDetails />
          </div>
          <div>
            <h3>黑白正文插画</h3>
            {mono.length ? <ArtworkMosaic artworks={mono} showDetails /> : <p className="empty-note">当前收录素材中黑白人物图不足，暂不强行标注。</p>}
          </div>
          <div>
            <h3>多人同框与其他卷宗</h3>
            <ArtworkMosaic artworks={[...ensemble, ...archive]} showDetails />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExternalMediaRail({ dossier }: { dossier: CharacterDossier }) {
  const character = characterById.get(dossier.characterId);
  if (!character) return null;

  return (
    <section className="detail-section detail-section--anime">
      <div className="page-shell">
        <SectionIntro
          index="05"
          eyebrow="Official anime"
          title="官方动画资料"
          description="只使用官方公开 YouTube 的 nocookie 嵌入，点击后加载；不下载、不截取、不重新托管动画画面。"
        />
        {dossier.anime.status === 'not-covered' ? (
          <article className="anime-uncovered">
            <h3>{character.name} 当前动画进度尚未覆盖</h3>
            <p>本站不会使用其他角色镜头替代，也不推测未公开动画剧情。</p>
          </article>
        ) : (
          <div className="external-media-rail">
            <article className="anime-profile-card">
              <span>CAST</span>
              <strong>{dossier.anime.voiceActor}</strong>
              <p>来源核对日期：{dossier.anime.checkedAt}</p>
              {dossier.anime.officialCharacterUrl && (
                <a className="text-link" href={dossier.anime.officialCharacterUrl} target="_blank" rel="noreferrer">
                  官方角色资料
                </a>
              )}
            </article>
            {dossier.anime.videos.map((video) => (
              <OfficialVideoEmbed
                key={video.bvid ?? video.youtubeId ?? video.title}
                title={video.title}
                youtubeId={video.youtubeId}
                bvid={video.bvid}
                provider={video.provider}
                sourceUrl={video.sourceUrl}
                accent={character.accent}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CharacterPager({ dossier }: { dossier: CharacterDossier }) {
  const currentIndex = characters.findIndex((character) => character.id === dossier.characterId);
  const previous = characters[(currentIndex - 1 + characters.length) % characters.length];
  const next = characters[(currentIndex + 1) % characters.length];

  return (
    <nav className="character-pager" aria-label="角色档案前后导航">
      <Link href={`/characters/${previous.id}/`}>
        <span>上一份档案</span>
        <strong>{previous.name}</strong>
      </Link>
      <Link href={`/characters/${next.id}/`}>
        <span>下一份档案</span>
        <strong>{next.name}</strong>
      </Link>
    </nav>
  );
}

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = getCharacter(id);
  const dossier = getCharacterDossier(id);
  if (!character || !dossier) notFound();

  return (
    <DossierMotion>
    <div className="detail-page dossier-page">
      <CharacterDossierHeader dossier={dossier} />
      <div className="fact-strip fact-strip--dossier">
        {character.facts.map((fact) => (
          <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>
        ))}
      </div>
      <CharacterQuotePanel dossier={dossier} />
      <CharacterTimeline dossier={dossier} />
      <CharacterRelationshipRecords dossier={dossier} />
      <CharacterArtworkGallery dossier={dossier} />
      <ExternalMediaRail dossier={dossier} />
      <CharacterPager dossier={dossier} />
    </div>
    </DossierMotion>
  );
}
