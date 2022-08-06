import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
            src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7393687437464759'
            crossOrigin="anonymous"
            strategy='beforeInteractive'
        ></Script>
      </body>
    </Html>
  )
}
