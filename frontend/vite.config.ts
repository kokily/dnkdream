import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Docker 환경에서 외부 접근 허용
    watch: {
      usePolling: true, // 0.1초마다 파일 변경 검사
    },
    hmr: {
      clientPort: 80, // Nginx (포트80)을 통해 웹소켓 통신 설정
    }
  }
})
