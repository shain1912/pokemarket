import { useNavigate } from 'react-router-dom';
import { StatusMessage } from '../components/common/StatusMessage';

interface NotFoundPageProps {
  readonly title?: string;
}

export function NotFoundPage({ title = '야생의 404 페이지가 나타났다!' }: NotFoundPageProps) {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-margin py-space-xl">
      <StatusMessage
        icon="explore_off"
        title={title}
        body="찾으시는 페이지가 없어요. 홈으로 돌아가 굿즈를 둘러보세요."
        action={{ label: '홈으로 가기', onClick: () => navigate('/') }}
      />
    </div>
  );
}
