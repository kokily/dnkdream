import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

export function render(url: string) {
  // 나중에 리액트 라우터 연동
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );

  return { html };
}
