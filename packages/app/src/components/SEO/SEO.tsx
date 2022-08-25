import NextHead from "next/head";
import React from "react";

import config from "../../../config.json";

export const SEO: React.FC = () => {
  return (
    <NextHead>
      <title>{config.app.name}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta property="og:url" content={config.app.uri} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={config.app.name} />
      <meta property="og:site_name" content={config.app.name} />
      <meta property="og:description" content={config.app.description} />
      <meta property="og:image" content={`${config.app.uri}/brands/ogp.png`} />
      <meta name="twitter:card" content={"summary_large_image"} />
    </NextHead>
  );
};
