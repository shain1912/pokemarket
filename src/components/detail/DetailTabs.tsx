import { useState } from 'react';

export interface DetailTab {
  id: string;
  label: string;
}

interface DetailTabsProps {
  readonly tabs: DetailTab[];
}

/** 같은 페이지의 섹션으로 스크롤하는 탭. 섹션 쪽에 scroll-mt 로 고정 헤더 높이를 보정한다 */
export function DetailTabs({ tabs }: DetailTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id);

  const handleClick = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full flex items-center justify-around bg-surface-container-lowest rounded-full p-1.5 shadow-sm overflow-x-auto no-scrollbar" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => handleClick(tab.id)}
          className={`flex-1 py-3 px-3 text-center rounded-full font-label-lg text-label-lg font-bold whitespace-nowrap transition-all ${
            active === tab.id ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
