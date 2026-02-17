import { load } from "cheerio";
import { isImageUrl } from "../utils/isImageUrl.util.js";
import { NotFoundError } from "../errors/apiErrors.js";

class URLScraperService {
  async scrapeUrl(url: string) {
    // if the user provided a direct image URL.
    if (await isImageUrl(url)) return url;

    const res = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch page: ${res.status}`);
    }

    const html = await res.text();
    const $ = load(html);

    const ogImage = $('meta[property="og:image"]').attr("content");

    if (ogImage) return ogImage;

    // fallback: first big <img>
    const imgSrc = $("img")
      .map((_, el) => $(el).attr("src") || $(el).attr("data-src"))
      .get()
      .find((src) => src && src.startsWith("http"));

    if (!imgSrc) {
      throw new NotFoundError("Image not found");
    }

    return imgSrc;
  }
}

export const urlScraperService = new URLScraperService();
