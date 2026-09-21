import { useEffect, useState, type DependencyList } from 'react';

interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
}

/** deps 가 바뀔 때마다 fetcher 를 다시 실행한다. 늦게 도착한 이전 응답은 버린다. */
export function useAsync<T>(fetcher: () => Promise<T>, deps: DependencyList): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, loading: true, error: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    fetcher()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch(
        (error: unknown) =>
          active &&
          setState({
            data: undefined,
            loading: false,
            error: error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.',
          }),
      );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { ...state, reload: () => setNonce((n) => n + 1) };
}
