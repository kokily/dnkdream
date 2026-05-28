import express, { Request, Response } from "express";
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const port = 4000;

const currentEnv = (process.env.NODE_ENV || "development").trim();
const isDev = currentEnv === "development";

async function startServer() {
  let vite: any;

  if (isDev) {
    // 개발 모드일 때 Vite 미들웨어 실행 (핫 리로드)
    vite = await createViteServer({
      root: __dirname,
      server: {
        middlewareMode: true,
        watch: { usePolling: true },
        hmr: {
          server,
          clientPort: 80,
          // path: "/vite-hmr",
          // host: "localhost",
        },
      },
      appType: "custom",
    });
    console.log(
      "vite httpServer",
      !!vite.httpServer,
      "server upgrade listeners",
      server.listeners("upgrade").length,
    );
    app.use(vite.middlewares);
  } else {
    // 배포 모드일 때 기존처럼 빌드된 파일 서빙
    const clientDist = path.resolve(__dirname, "dist/client");
    app.use(express.static(clientDist, { index: false }));
  }

  app.get(/.*/, async (req: Request, res: Response) => {
    try {
      const url = req.originalUrl;
      let template;

      if (isDev) {
        // 개발 모드: 원본 index.html을 읽고 Vite가 HMR 스크립트를 주의함
        template = fs.readFileSync(
          path.resolve(__dirname, "index.html"),
          "utf-8",
        );
        template = await vite.transformIndexHtml(url, template);
      } else {
        // 배포 모드: 기존 코드 유지
        const clientDist = path.resolve(__dirname, "dist/client");
        template = fs.readFileSync(
          path.resolve(clientDist, "index.html"),
          "utf-8",
        );
      }

      // 모든 라우트에서 SSR 처리
      let render;

      if (isDev) {
        // 개발 모드: 소스 코드에서 바로 렌더링 함수를 가져옴
        const module = await vite.ssrLoadModule("/src/entry-server.tsx");
        render = module.render;
      } else {
        // 배포 모드: 기존 코드 유지
        const serverDist = path.resolve(__dirname, "dist/server");
        const module = await import(
          path.resolve(serverDist, "entry-server.js")
        );
        render = module.render;
      }

      const { html: appHtml } = render(url);
      const finalHtml = template.replace(
        `<div id="root"></div>`,
        `<div id="root">${appHtml}</div>`,
      );

      return res
        .status(200)
        .set({ "Content-Type": "text/html" })
        .end(finalHtml);
    } catch (error: any) {
      if (isDev) vite?.ssrFixStacktrace(error);
      console.error("SSR Error ", error);
      res.status(500).end("Internal Server Error");
    }
  });

  server.listen(port, () => {
    console.log(
      `Frontend Server is running on ${port} (Mode: ${isDev ? "Development" : "Production"})`,
    );
  });
}

startServer();
