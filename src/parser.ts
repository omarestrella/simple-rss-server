import Parser from "rss-parser";
import { v5 as uuid } from "uuid";
import fetch from "node-fetch";
import { parse } from "node-html-parser";

const parser = new Parser();

interface Feed {
  title: string;
  description: string;
  link?: string;
  imageUrl?: string;
  items: Item[];
}
interface Item {
  id: string;
  title: string;
  link: string;
  date: string;
  author: string;
  content: string;
  contentSnippet?: string;
  categories: string[];
}

type ParserFeed = Parser.Output<Record<string, string>>;

function extractFeedItems(feed: ParserFeed): Item[] {
  return feed.items
    .filter((item) => !!item.link)
    .map((item): Item => {
      let link = <string>item.link;
      return {
        id: uuid(link, uuid.URL),
        title: item.title || "",
        link: item.link || "",
        date: item.pubDate || item.isoDate || "",
        author: item.author || "",
        content: item.content || "",
        contentSnippet: item.contentSnippet,
        categories: item.categories || [],
      };
    });
}

async function extractFeedImageUrl(
  feed: ParserFeed
): Promise<string | undefined> {
  if (feed.image && feed.image.url) {
    return feed.image.url;
  }

  let baseUrl = feed.link || feed.feedUrl;
  if (baseUrl) {
    let url = new URL(baseUrl);
    let host = url.origin;
    try {
      let res = await fetch(host, {
        method: "GET",
      });
      let html = await res.text();
      let document = parse(html);
      let metaImage = document.querySelector('meta[property="og:image"]');
      if (metaImage) {
        return metaImage.getAttribute("content");
      }
    } catch (err) {
      console.error("Error trying to get feed image:", err);
    }
  }

  return undefined;
}

export async function getFeedItems(url: string): Promise<Item[]> {
  let feed = await parser.parseURL(url);
  return extractFeedItems(feed);
}

export async function getFeed(url: string): Promise<Feed> {
  let feed = await parser.parseURL(url);

  let title = feed.title || "";
  let description = feed.description || "";
  let link = feed.link || feed.feedUrl || undefined;
  let imageUrl = await extractFeedImageUrl(feed);
  let items = extractFeedItems(feed);

  return {
    title,
    description,
    link,
    imageUrl,
    items,
  };
}
