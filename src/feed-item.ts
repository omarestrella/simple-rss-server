import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";

interface ReadableFeedItem {
  article: ReturnType<Readability["parse"]>;
}

export async function getReadableFeedItem(
  url: string
): Promise<ReadableFeedItem> {
  try {
    let res = await fetch(url, {
      method: "GET",
    });
    let html = await res.text();
    let document = new JSDOM(html);
    let reader = new Readability(document.window.document);
    let article = reader.parse();
    if (article) {
      return {
        article,
      };
    }
  } catch (err) {
    console.error("Error getting readable feed item:", err);
  }
  return {
    article: null,
  };
}
