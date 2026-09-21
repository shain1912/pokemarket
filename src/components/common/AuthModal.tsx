import { useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { Icon } from './Icon';

type Mode = 'signin' | 'signup';

interface AuthModalProps {
  readonly initialMode?: Mode;
}

const INPUT_CLASS =
  'w-full h-11 px-5 rounded-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all';

export function AuthModal({ initialMode = 'signin' }: AuthModalProps) {
  const { authOpen, closeAuth } = useAuth();
  const { showToast } = useShop();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'info'; text: string } | null>(null);

  if (!authOpen) return null;

  const finish = (text: string) => {
    setPassword('');
    setMessage(null);
    closeAuth();
    showToast('waving_hand', text);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        finish('어서 오세요, 트레이너님! ⚡');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName.trim() }, emailRedirectTo: window.location.origin + import.meta.env.BASE_URL },
        });
        if (error) throw error;
        if (data.session) finish('가입 완료! 3,000 포케코인이 지급되었어요 🪙');
        else setMessage({ kind: 'info', text: '인증 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.' });
      }
    } catch (error) {
      setMessage({ kind: 'error', text: translateAuthError(error) });
    } finally {
      setBusy(false);
    }
  };

  const handleGuest = async () => {
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signInAnonymously();
    setBusy(false);
    if (error) {
      setMessage({
        kind: 'error',
        text: '게스트 로그인이 꺼져 있어요. Supabase 대시보드 Authentication → Sign In / Providers 에서 Anonymous sign-ins 를 켜면 사용할 수 있습니다.',
      });
      return;
    }
    finish('게스트 트레이너로 입장했어요!');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-space-md" role="dialog" aria-modal="true">
      <button type="button" aria-label="닫기" className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={closeAuth} />
      <div className="relative w-full max-w-md rounded-lg bg-surface-container-lowest p-space-lg shadow-xl flex flex-col gap-space-md">
        <button
          type="button"
          aria-label="닫기"
          onClick={closeAuth}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container-low text-on-surface-variant hover:text-primary flex items-center justify-center"
        >
          <Icon name="close" className="text-xl" />
        </button>

        <div className="flex items-center gap-space-sm">
          <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-on-primary shadow-[0_4px_12px_rgba(255,90,95,0.35)]">
            <Icon name="20mp" className="text-2xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight">
              {mode === 'signin' ? '트레이너 로그인' : '신규 트레이너 가입'}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {mode === 'signin' ? '찜 · 장바구니 · 리뷰를 이용해 보세요' : '가입 즉시 3,000 포케코인 지급 🪙'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full font-label-md text-label-md">
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setMessage(null);
              }}
              className={`flex-1 py-2 rounded-full transition-all ${
                mode === m ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {m === 'signin' ? '로그인' : '회원가입'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
          {mode === 'signup' && (
            <input
              className={INPUT_CLASS}
              placeholder="트레이너 이름 (예: 지우)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={20}
              required
            />
          )}
          <input
            className={INPUT_CLASS}
            type="email"
            placeholder="이메일"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={INPUT_CLASS}
            type="password"
            placeholder="비밀번호 (6자 이상)"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          {message && (
            <p
              className={`px-4 py-2.5 rounded font-body-sm text-body-sm ${
                message.kind === 'error' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed'
              }`}
            >
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="h-12 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-extrabold hover:opacity-95 transition-all shadow-[0_4px_16px_rgba(255,90,95,0.4)] disabled:opacity-60"
          >
            {busy ? '잠시만요...' : mode === 'signin' ? '로그인' : '가입하고 3,000 코인 받기'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGuest}
          disabled={busy}
          className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors disabled:opacity-60"
        >
          가입 없이 게스트로 둘러보기
        </button>
      </div>
    </div>
  );
}

function translateAuthError(error: unknown): string {
  const text = error instanceof Error ? error.message : '';
  if (/invalid login credentials/i.test(text)) return '이메일 또는 비밀번호가 올바르지 않아요.';
  if (/email not confirmed/i.test(text)) return '이메일 인증이 아직 끝나지 않았어요. 메일함을 확인해 주세요.';
  if (/already registered/i.test(text)) return '이미 가입된 이메일이에요. 로그인해 주세요.';
  if (/rate limit/i.test(text)) return '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.';
  return text || '문제가 발생했어요. 다시 시도해 주세요.';
}
