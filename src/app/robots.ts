import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { isPreviewBuild } from "@/lib/asset";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPreviewBuild ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
