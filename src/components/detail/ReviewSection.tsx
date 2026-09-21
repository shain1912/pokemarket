import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { createReview } from '../../lib/api';
import { formatCount, timeAgo } from '../../lib/format';
import type { ProductFull, Review } from '../../lib/types';
import { Icon } from '../common/Icon';
import { Stars } from '../common/Stars';

interface ReviewSectionProps {
  readonly product: ProductFull;
  readonly reviews: Review[];
  readonly onCreated: () => void;
}

const AVATAR_TONES = ['bg-secondary-container text-on-secondary-container', 'bg-primary-fixed text-on-primary-fixed', 'bg-tertiary-fixed text-on-tertiary-fixed'];

export function ReviewSection({ product, reviews, onCreated }: ReviewSectionProps) {
  const { session, openAuth } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const { rating_breakdown: breakdown, satisfaction } = product.detail;

  const handleWrite = () => {
    if (!session) {
      openAuth();
      return;
    }
    setFormOpen((open) => !open);
  };

  return (
    <div className="mt-space-xl pt-space-lg scroll-mt-52" id="tab-reviews">
      <div className="flex items-center justify-between flex-wrap gap-space-sm mb-space-md">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-secondary-container" />
          <h3 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-on-surface font-bold">트레이너 실구매 리뷰</h3>
          <span className="font-label-md text-label-md text-primary font-bold">{formatCount(product.review_count)}개</span>
        </div>
        <button
          type="button"
          onClick={handleWrite}
          className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Icon name="rate_review" className="text-base" />
          리뷰 작성하기
        </button>
      </div>

      {formOpen && (
        <ReviewForm
          productId={product.id}
          onDone={() => {
            setFormOpen(false);
            onCreated();
          }}
        />
      )}

      <div className="p-space-lg rounded-lg bg-surface-container-low grid grid-cols-1 md:grid-cols-3 gap-gutter items-center mb-space-lg">
        <div
          className={`flex flex-col items-center justify-center text-center p-space-sm ${
            breakdown ? 'md:border-r border-outline-variant/30' : 'md:col-span-3'
          }`}
        >
          <span className="font-display-lg text-display-lg text-on-surface font-extrabold">{product.rating.toFixed(1)}</span>
          <div className="my-1">
            <Stars rating={product.rating} sizeClass="text-xl" />
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {satisfaction ? `${satisfaction}%의 트레이너가 만족했어요` : `리뷰 ${formatCount(product.review_count)}개 기준`}
          </span>
        </div>
        {breakdown && (
          <div className="md:col-span-2 flex flex-col gap-2">
            {breakdown.map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="font-label-sm text-label-sm text-on-surface font-bold w-14 shrink-0">{row.label}</span>
                <div className="flex-1 h-2.5 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full bg-secondary-container rounded-full" style={{ width: `${row.percent}%` }} />
                </div>
                <span className="font-label-sm text-label-sm text-outline w-10 text-right">{row.percent}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="p-space-lg rounded-lg bg-surface-container-lowest shadow-sm text-center font-body-sm text-body-sm text-on-surface-variant">
          아직 등록된 리뷰가 없어요. 첫 번째 리뷰의 주인공이 되어 주세요!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {reviews.map((review, i) => (
            <article key={review.id} className="p-space-lg rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-label-md text-label-md shrink-0 ${AVATAR_TONES[i % AVATAR_TONES.length]}`}
                  >
                    {review.author_name.replace('@', '').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                      {review.author_name}
                      {review.author_level ? ` (Lv.${review.author_level})` : ''}
                    </span>
                    {review.option_text && <span className="font-label-sm text-label-sm text-outline truncate">{review.option_text}</span>}
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-outline shrink-0">{timeAgo(review.created_at)}</span>
              </div>
              <Stars rating={review.rating} />
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed whitespace-pre-line">{review.content}</p>
              {review.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {review.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

interface ReviewFormProps {
  readonly productId: number;
  readonly onDone: () => void;
}

function ReviewForm({ productId, onDone }: ReviewFormProps) {
  const { showToast } = useShop();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await createReview({ productId, rating, content: content.trim(), optionText: null });
      showToast('rate_review', '소중한 리뷰 감사합니다! ✨');
      onDone();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : '리뷰를 등록하지 못했어요.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-space-lg rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm mb-space-lg">
      <div className="flex items-center gap-space-sm">
        <span className="font-label-md text-label-md text-on-surface font-bold">별점</span>
        <div className="flex text-secondary-fixed-dim" role="radiogroup" aria-label="별점">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n}점`} onClick={() => setRating(n)}>
              <Icon name="star" filled={n <= rating} className="text-2xl" />
            </button>
          ))}
        </div>
      </div>
      <textarea
        className="w-full min-h-28 p-4 rounded bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all resize-y"
        placeholder="굿즈의 촉감, 크기, 배송은 어땠나요? (5자 이상)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        minLength={5}
        maxLength={1000}
        required
      />
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-outline">{content.length} / 1000</span>
        <button
          type="submit"
          disabled={busy || content.trim().length < 5}
          className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold hover:opacity-95 transition-all disabled:opacity-50"
        >
          {busy ? '등록 중...' : '리뷰 등록'}
        </button>
      </div>
    </form>
  );
}
