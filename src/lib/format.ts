export function formatKRW(value: number): string {
  return value.toLocaleString('ko-KR');
}

export function formatCount(value: number): string {
  return value.toLocaleString('ko-KR');
}

/** "2일 전" 형태의 상대 시간 */
export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;
  return `${Math.floor(months / 12)}년 전`;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 내일 요일 한 글자 (도착 보장 문구용) */
export function tomorrowWeekday(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return WEEKDAYS[d.getDay()];
}

/** text 안의 highlight 부분만 분리해 [앞, 강조, 뒤] 로 돌려준다 */
export function splitHighlight(text: string, highlight?: string | null): [string, string, string] {
  if (!highlight) return [text, '', ''];
  const idx = text.indexOf(highlight);
  if (idx < 0) return [text, '', ''];
  return [text.slice(0, idx), highlight, text.slice(idx + highlight.length)];
}
