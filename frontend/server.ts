import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 4000;

const clientDist = path.resolve(__dirname, "dist/client");
const serverDist = path.resolve(__dirname, "dist/server");

app.use(express.static(clientDist, { index: false }));

app.get(/.*/, async (req: Request, res: Response) => {
  try {
    const url = req.originalUrl;
    let template = fs.readFileSync(
      path.resolve(clientDist, "index.html"),
      "utf-8",
    );

    // URL이 '/post'로 시작할 경우에만 SSR
    if (url.startsWith("/post/")) {
      const { render } = await import(
        path.resolve(serverDist, "entry-server.js")
      );
      const { html: appHtml } = render(url);
      const finalHtml = template.replace(
        `<div id="root"></div>`,
        `<div id="root">${appHtml}</div`,
      );

      return res
        .status(200)
        .set({ "Content-Type": "text/html" })
        .end(finalHtml);
    } else {
      return res.status(200).set({ "Content-Type": "text/html" }).end(template);
    }
  } catch (error: any) {
    console.error("SSR Error: ", error);
    res.status(500).end("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Frontend Server is running on ${port} (Typescript)`);
});
