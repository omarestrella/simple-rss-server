import Parser from "rss-parser";
import { v4 as uuid } from "uuid";

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
}

export async function getFeed(url: string): Promise<Feed> {
  let feed = await parser.parseURL(url);

  let title = feed.title || "";
  let description = feed.description || "";
  let link = feed.link || undefined;
  let imageUrl = !!feed.image ? feed.image.url : undefined;
  let items = feed.items.map((item) => {
    return {
      id: item.id || uuid(),
      title: item.title || "",
      link: item.link || "",
      date: item.pubDate || item.isoDate || "",
      author: item.author || "",
      content: item.content || "",
    };
  });

  return {
    title,
    description,
    link,
    imageUrl,
    items,
  };
}
