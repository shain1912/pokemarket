import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 포트 3000: Supabase Auth 기본 Site URL(http://localhost:3000)과 맞춰 이메일 인증 링크가 앱으로 돌아오게 한다.
// 하위 경로 배포(GitHub Pages)는 빌드 시 `npm run build -- --base=/<repo>/` 로 지정한다.
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
});
