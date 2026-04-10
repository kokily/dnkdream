FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite Build
RUN npm run build

EXPOSE 4000

# 직접 작성할 SSR 렌더링 서버 실행
CMD ["npm", "run", "start:ssr"]