import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import type { DefaultSeoProps } from 'next-seo';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import {
  QueryClientProvider,
  Hydrate,
  dehydrate,
  QueryClient,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import * as ga from '@/libs/ga';
import GlobalStyle from '@/styles';
import 'react-toastify/dist/ReactToastify.css';

const title = 'D&K Dreams Blog - Welcome';

const DefaultSEO: DefaultSeoProps = {
  title,
  canonical: 'https://dnkdream.com',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://dnkdream.com',
    title,
    siteName: 'D&K Dreams Blog',
    images: [
      {
        url: '/assets/logo512.png',
        width: 285,
        height: 167,
        alt: 'Image',
      },
    ],
  },
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  const dehydratedState = dehydrate(queryClient);

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      ga.pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/assets/logo192.png" />
      </Head>

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ga.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() {dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              })
            `,
        }}
      />

      <SessionProvider session={session}>
        <DefaultSeo {...DefaultSEO} />
        <GlobalStyle />

        <QueryClientProvider client={queryClient}>
          <Hydrate state={dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>

        <ToastContainer position="bottom-center" draggable={false} />
      </SessionProvider>
    </>
  );
}
