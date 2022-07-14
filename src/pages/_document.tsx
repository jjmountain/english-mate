import { Html, Head, Main, NextScript } from "next/document";
import React from "react";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="preload"
          href="/fonts/OpenSans-VariableFont_wdth,wght.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
