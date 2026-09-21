import { Link } from 'react-router-dom';
import { CHARACTER_TONE_CLASSES } from '../../data/site';
import type { Character } from '../../lib/types';

interface CharacterShortcutsProps {
  readonly characters: Character[];
}

export function CharacterShortcuts({ characters }: CharacterShortcutsProps) {
  return (
    <section className="w-full px-margin py-space-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-space-md">
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">CHOOSE YOUR PARTNER</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">귀여운 포켓몬별 숏컷</h2>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant hidden md:inline-block">
            최애 포켓몬을 터치하고 전용 굿즈를 찾아보세요! ✨
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-gutter">
          {characters.map((character) => {
            const tone = CHARACTER_TONE_CLASSES[character.tone] ?? CHARACTER_TONE_CLASSES.beige;
            return (
              <Link
                key={character.id}
                to={`/products?character=${character.slug}`}
                className="group flex flex-col items-center text-center p-4 rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center p-1.5 mb-space-xs group-hover:scale-105 transition-transform ${tone.ring}`}
                >
                  <img className="w-full h-full object-cover rounded-full" src={character.image_url} alt="" loading="lazy" />
                  {character.badge_emoji && (
                    <span
                      className={`absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm ${tone.badge}`}
                    >
                      {character.badge_emoji}
                    </span>
                  )}
                </div>
                <span className="font-label-lg text-label-lg text-on-surface font-bold group-hover:text-primary transition-colors">
                  {character.name}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {character.type_label} · {character.item_count}종
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
