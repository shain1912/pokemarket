import { Link } from 'react-router-dom';
import { FOOTER } from '../../data/site';
import { Icon } from '../common/Icon';

interface FooterProps {
  readonly content?: typeof FOOTER;
}

export function Footer({ content = FOOTER }: FooterProps) {
  return (
    <footer className="w-full bg-surface-container-low mt-space-xl pt-space-xl pb-12 shadow-[0_-4px_24px_rgba(84,75,71,0.04)]">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-space-xl">
          <div className="md:col-span-2 flex flex-col gap-space-sm">
            <Link to="/" className="flex items-center gap-space-sm w-fit">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <Icon name="20mp" className="text-xl" />
              </div>
              <span className="font-headline-sm text-headline-sm text-primary">{content.brand}</span>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">{content.intro}</p>
            <div className="flex flex-wrap items-center gap-space-xs mt-space-sm">
              {content.chips.map((chip) => (
                <span key={chip.label} className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${chip.tone}`}>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface font-bold mb-1">{content.csTitle}</span>
            <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">{content.csPhone}</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {content.csLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface font-bold mb-1">{content.guideTitle}</span>
            {content.guides.map((guide) => (
              <span key={guide} className="font-body-sm text-body-sm text-on-surface-variant">
                {guide}
              </span>
            ))}
          </div>
        </div>
        <div className="pt-space-md border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant font-label-sm text-label-sm">
          <p>{content.business}</p>
          <div className="flex flex-wrap items-center justify-center gap-space-md">
            <span>이용약관</span>
            <span className="font-bold text-primary">개인정보처리방침</span>
            <span>청소년보호정책</span>
            <span>{content.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
