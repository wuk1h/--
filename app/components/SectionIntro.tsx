import type { ReactNode } from 'react';

export function SectionIntro({
  index,
  eyebrow,
  title,
  description,
  action,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-intro" data-reveal>
      <div className="section-intro__index">{index}</div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description && <p className="section-intro__description">{description}</p>}
      </div>
      {action && <div className="section-intro__action">{action}</div>}
    </div>
  );
}
