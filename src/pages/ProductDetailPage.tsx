import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/common/Icon';
import { StatusMessage } from '../components/common/StatusMessage';
import { BuyBox } from '../components/detail/BuyBox';
import { DescriptionSection } from '../components/detail/DescriptionSection';
import { DetailTabs } from '../components/detail/DetailTabs';
import { Gallery } from '../components/detail/Gallery';
import { RelatedSection } from '../components/detail/RelatedSection';
import { ReviewSection } from '../components/detail/ReviewSection';
import { FOOTER, SHIPPING_POLICY } from '../data/site';
import { useAsync } from '../hooks/useAsync';
import { fetchProductBySlug, fetchRelated, fetchReviews } from '../lib/api';
import { formatCount } from '../lib/format';

interface ProductDetailPageProps {
  readonly slugOverride?: string;
}

export function ProductDetailPage({ slugOverride }: ProductDetailPageProps) {
  const params = useParams();
  const navigate = useNavigate();
  const slug = slugOverride ?? params.slug ?? '';

  const { data: product, loading, error, reload } = useAsync(() => fetchProductBySlug(slug), [slug]);
  const productId = product?.id;
  const { data: extras, reload: reloadExtras } = useAsync(
    async () => (product ? Promise.all([fetchReviews(product.id), fetchRelated(product)]) : null),
    [productId],
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-margin py-space-xl">
        <StatusMessage icon="cloud_off" title="굿즈 정보를 불러오지 못했어요" body={error} action={{ label: '다시 시도', onClick: reload }} />
      </div>
    );
  }
  if (loading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-margin py-space-xl grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-7 aspect-[4/3] rounded-lg bg-surface-container-low animate-pulse" />
        <div className="lg:col-span-5 min-h-96 rounded-lg bg-surface-container-low animate-pulse" />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-margin py-space-xl">
        <StatusMessage
          icon="search_off"
          title="찾을 수 없는 굿즈예요"
          body="판매가 종료되었거나 주소가 잘못되었을 수 있어요."
          action={{ label: '전체 굿즈 보러가기', onClick: () => navigate('/products') }}
        />
      </div>
    );
  }

  const [reviews, related] = extras ?? [[], []];
  const tabs = [
    { id: 'tab-desc', label: '상세설명' },
    { id: 'tab-reviews', label: `트레이너 리뷰 (${formatCount(product.review_count)})` },
    { id: 'tab-qna', label: `Q&A (${formatCount(product.detail.qna_count ?? 0)})` },
    { id: 'tab-shipping', label: '배송 / 교환 / 반품' },
  ];

  const handleReviewCreated = () => {
    reload(); // 평점·리뷰 수는 DB 트리거가 갱신한다
    reloadExtras();
  };

  return (
    <div className="max-w-7xl mx-auto px-margin pb-space-xl w-full">
      <nav className="flex items-center flex-wrap gap-space-xs py-space-md text-on-surface-variant font-label-md text-label-md" aria-label="breadcrumb">
        <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/">
          <Icon name="home" className="text-base" />홈
        </Link>
        <span className="text-outline-variant">/</span>
        <Link className="hover:text-primary transition-colors" to={`/products?category=${product.category.slug}`}>
          {product.category.name}
        </Link>
        {product.sub_category && (
          <>
            <span className="text-outline-variant">/</span>
            <span>{product.sub_category}</span>
          </>
        )}
        <span className="text-outline-variant">/</span>
        <span className="text-on-surface font-bold truncate max-w-full">{product.short_name ?? product.name}</span>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <Gallery product={product} />
        <BuyBox product={product} />
      </section>

      <section className="mt-space-xl pt-space-md">
        <DetailTabs tabs={tabs} />
        <DescriptionSection product={product} />
        <ReviewSection product={product} reviews={reviews} onCreated={handleReviewCreated} />

        <div className="mt-space-xl pt-space-lg scroll-mt-52" id="tab-qna">
          <div className="flex items-center gap-2 mb-space-md">
            <span className="w-3 h-3 rounded-full bg-tertiary-container" />
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Q&A</h3>
          </div>
          <div className="p-space-lg rounded-lg bg-surface-container-low flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
              <Icon name="support_agent" className="text-2xl" />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              상품 문의는 트레이너 고객센터 <strong className="text-primary">{FOOTER.csPhone}</strong> 또는 cs@pokemarket.kr 로 남겨 주세요.
              평일 09:30 ~ 18:00 순차 답변드립니다.
            </p>
          </div>
        </div>

        <div className="mt-space-xl pt-space-lg scroll-mt-52" id="tab-shipping">
          <div className="flex items-center gap-2 mb-space-md">
            <span className="w-3 h-3 rounded-full bg-primary-container" />
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">배송 / 교환 / 반품</h3>
          </div>
          <dl className="p-space-lg rounded-lg bg-surface-container-low flex flex-col gap-space-sm">
            {SHIPPING_POLICY.map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row gap-1 sm:gap-space-md py-3 bg-surface-container-lowest px-4 rounded">
                <dt className="font-label-md text-label-md text-outline font-bold sm:w-28 shrink-0">{row.label}</dt>
                <dd className="font-body-sm text-body-sm text-on-surface">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <RelatedSection items={related} copy={product.detail.cross_sell} />
    </div>
  );
}
