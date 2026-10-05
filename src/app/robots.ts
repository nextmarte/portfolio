import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://marcusramalho.com.br/sitemap.xml",
    host: "https://marcusramalho.com.br",
  };
}
