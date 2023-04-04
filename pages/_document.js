import Document, { Html, Head, Main, NextScript } from 'next/document'
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="scroll-smooth">
        <Head>
          <link rel="favicon-76x76" sizes="76x76" href="/static/favicons/favicon-76x76.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon.ico" />
          <link rel="manifest" href="/static/favicons/site.webmanifest" />
          <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
          <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        </Head>
        <body className="bg-white text-black antialiased dark:bg-gray-900 dark:text-white">
          {/* Google Tag Manager (noscript) */}
          {/* <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PF3PNGS"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          ></noscript> */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-PF3PNGS"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
