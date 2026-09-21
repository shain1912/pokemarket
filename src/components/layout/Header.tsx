import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { ANNOUNCEMENT, DEFAULT_AVATAR, NAV_ITEMS, POPULAR_SEARCHES, SEARCH_PLACEHOLDER } from '../../data/site';
import { formatKRW } from '../../lib/format';
import { Icon } from '../common/Icon';

interface HeaderProps {
  readonly announcement?: string;
}

const ICON_BUTTON_CLASS =
  'relative w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed transition-all';
const COUNT_BADGE_CLASS =
  'absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold';

/** 현재 URL 의 주요 조건을 NAV_ITEMS.key 형식으로 돌려준다 */
function useNavKey(): string | null {
  const { pathname, search } = useLocation();
  if (pathname !== '/products') return null;
  const params = new URLSearchParams(search);
  if (params.get('category')) return `category=${params.get('category')}`;
  if (params.get('tag')) return `tag=${params.get('tag')}`;
  if (params.get('sale') === '1') return 'sale=1';
  if (params.get('sort') === 'new') return 'sort=new';
  if (params.get('q') || params.get('wishlist') || params.get('character')) return null;
  return 'all';
}

export function Header({ announcement = ANNOUNCEMENT }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const navKey = useNavKey();
  const { session, profile, openAuth, signOut } = useAuth();
  const { wishlistIds, cartCount, openCart, showToast } = useShop();
  const [keyword, setKeyword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setKeyword(new URLSearchParams(location.search).get('q') ?? '');
    setMenuOpen(false);
  }, [location]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const q = keyword.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  };

  const handleWishlist = () => {
    if (!session) {
      openAuth();
      return;
    }
    navigate('/products?wishlist=1');
  };

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    showToast('logout', '로그아웃되었습니다. 또 만나요!');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(84,75,71,0.05)]">
      <div className="bg-primary text-on-primary py-1.5 px-margin">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-space-sm text-center font-label-sm text-label-sm">
          <Icon name="redeem" className="text-sm text-secondary-fixed" />
          <span className="truncate">{announcement}</span>
        </div>
      </div>

      <div className="h-28 max-w-7xl mx-auto px-margin flex items-center justify-between gap-gutter">
        <Link to="/" className="flex items-center gap-space-sm shrink-0 group">
          <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-on-primary shadow-[0_4px_12px_rgba(255,90,95,0.35)]">
            <Icon name="20mp" className="text-2xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight">포케마켓</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant -mt-1">Poké Market Boutique</span>
          </div>
        </Link>

        <div className="flex-1 max-w-xl mx-auto hidden lg:flex flex-col gap-1">
          <form onSubmit={handleSearch} className="relative flex items-center w-full" role="search">
            <input
              className="w-full h-11 pl-5 pr-12 rounded-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest transition-all"
              placeholder={SEARCH_PLACEHOLDER}
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              aria-label="상품 검색"
            />
            <button
              type="submit"
              aria-label="검색"
              className="absolute right-1 w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:opacity-95 transition-opacity"
            >
              <Icon name="search" className="text-xl" />
            </button>
          </form>
          <div className="flex items-center gap-space-sm px-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-label-sm text-label-sm text-outline">인기 검색</span>
            {POPULAR_SEARCHES.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-space-md shrink-0">
          <button type="button" onClick={handleWishlist} aria-label="찜한 굿즈" className={ICON_BUTTON_CLASS}>
            <Icon name="favorite" className="text-xl" />
            {wishlistIds.length > 0 && <span className={COUNT_BADGE_CLASS}>{wishlistIds.length}</span>}
          </button>
          <button type="button" onClick={openCart} aria-label="장바구니" className={ICON_BUTTON_CLASS}>
            <Icon name="shopping_bag" className="text-xl" />
            {cartCount > 0 && <span className={COUNT_BADGE_CLASS}>{cartCount}</span>}
          </button>
          <div className="h-8 w-px bg-surface-container-highest mx-1 hidden sm:block" />

          {session ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                className="flex items-center gap-space-sm p-1.5 pr-3 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors"
              >
                <img alt="" className="w-8 h-8 rounded-full object-cover" src={profile?.avatar_url ?? DEFAULT_AVATAR} />
                <div className="hidden md:flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-label-sm text-label-sm text-on-surface font-bold">
                      {profile?.display_name ?? '트레이너'} 트레이너
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">Lv.{profile?.level ?? 1}</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary font-bold">🪙 {formatKRW(profile?.coins ?? 0)} P</span>
                </div>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded bg-surface-container-lowest shadow-xl p-1.5 flex flex-col">
                  <button
                    type="button"
                    onClick={handleWishlist}
                    className="flex items-center gap-2 px-3 py-2 rounded-full font-label-md text-label-md text-on-surface hover:bg-surface-container-low text-left"
                  >
                    <Icon name="favorite" className="text-base text-primary" /> 찜한 굿즈
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 rounded-full font-label-md text-label-md text-on-surface hover:bg-surface-container-low text-left"
                  >
                    <Icon name="logout" className="text-base text-outline" /> 로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuth}
              className="flex items-center gap-space-sm p-1.5 pr-4 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                <Icon name="person" className="text-xl" />
              </span>
              <span className="hidden md:flex flex-col text-left">
                <span className="font-label-sm text-label-sm text-on-surface font-bold">로그인 / 가입</span>
                <span className="font-label-sm text-label-sm text-secondary font-bold">🪙 가입 시 3,000 P</span>
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface-container-lowest/80">
        <div className="max-w-7xl mx-auto px-margin">
          <nav className="flex items-center gap-space-xs py-2 overflow-x-auto no-scrollbar" aria-label="카테고리">
            {NAV_ITEMS.map((item) => {
              const active = item.key === navKey;
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap ${
                    active
                      ? 'bg-primary-container text-on-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
