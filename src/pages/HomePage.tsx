import { CharacterShortcuts } from '../components/home/CharacterShortcuts';
import { CommunitySection } from '../components/home/CommunitySection';
import { CurationSection } from '../components/home/CurationSection';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { RankingSection } from '../components/home/RankingSection';
import { Icon } from '../components/common/Icon';
import { useAsync } from '../hooks/useAsync';
import { fetchBanners, fetchCharacters, fetchCommunityReviews } from '../lib/api';

interface HomePageProps {
  readonly liveMessage?: string;
}

export function HomePage({ liveMessage = '현재 트레이너 1,842명이 봄 시즌 굿즈를 둘러보는 중입니다 ⚡' }: HomePageProps) {
  const { data } = useAsync(
    () => Promise.all([fetchBanners('hero'), fetchBanners('curation'), fetchCharacters(), fetchCommunityReviews()]),
    [],
  );
  const [heroBanners, curationBanners, characters, communityReviews] = data ?? [[], [], [], []];

  return (
    <div className="flex flex-col w-full">
      <div className="w-full bg-secondary-container/20 py-2.5 px-margin">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-on-surface-variant font-label-md text-label-md">
          <div className="flex items-center gap-space-sm min-w-0">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
            <span className="font-bold text-primary shrink-0">LIVE RANKING</span>
            <span className="text-on-surface truncate">{liveMessage}</span>
          </div>
          <div className="hidden sm:flex items-center gap-space-md font-label-sm text-label-sm text-on-surface-variant shrink-0">
            <span className="flex items-center gap-1">
              <Icon name="local_shipping" className="text-base text-tertiary" /> 15시 이전 당일 출발
            </span>
            <span className="flex items-center gap-1">
              <Icon name="verified" className="text-base text-primary" /> 100% 정품 라이선스 보증
            </span>
          </div>
        </div>
      </div>

      <section className="w-full px-margin pt-space-md pb-space-lg">
        <div className="max-w-7xl mx-auto">
          <HeroCarousel banners={heroBanners} />
        </div>
      </section>

      <CharacterShortcuts characters={characters} />
      <RankingSection />
      <CurationSection banners={curationBanners} />
      <CommunitySection reviews={communityReviews} />
    </div>
  );
}
