import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.3-alpha2/deno-dom-wasm.ts";

enum months {
  Januari,
  Februari,
  Maret,
  April,
  Mei,
  Juni,
  Juli,
  Agustus,
  September,
  Oktober,
  November,
  Desember,
}
enum categories {
  cat1 = "Theater",
  cat2 = "Event",
  cat3 = "Media",
  cat4 = "Release",
  cat5 = "Birthday",
  cat6 = "Goods",
  cat8 = "Other",
}

export default async function NewsScraper(source: string): Promise<string> {
  const pageFetch = (url: string) =>
    fetch(url)
      .then((response) => response.text())
      .then((htmlString) =>
        new DOMParser().parseFromString(htmlString, "text/html")
      );
  const pagination = await pageFetch(source)
    .then((page) => page?.querySelector("span.page")?.innerHTML)
    .then((pageNumber) => pageNumber?.split(" / ").pop());
  let newsList: any[] = [];

  if (pagination !== undefined) {
    for (let pageNumber = 1; pageNumber <= parseInt(pagination); pageNumber++) {
      const list = Array.from(
        Array.prototype.slice.call(
          await pageFetch(`${source}?page=${pageNumber}`).then((page) =>
            page?.querySelectorAll("#mainCol .post>.contentpink")
          )
        )
      );
      const promises = list.map(async (newsItem: Element) => {
        const category = newsItem
          .querySelector(".imgHolder>img")
          ?.getAttribute("src")
          ?.split(".")[1];
        const title = newsItem.querySelector(".newswrap>.excerpt a")?.innerHTML;
        const link = newsItem
          .querySelector(".newswrap>.excerpt a")
          ?.getAttribute("href");
        const metadata = newsItem
          .querySelector(".metadata")
          ?.innerHTML.split(" ");
        const newsPage = await fetch(`https://jkt48.com${link}`)
          .then((response) => response.text())
          .then((text) => new DOMParser().parseFromString(text, "text/html"));
        const content = Array.from(
          Array.prototype.slice.call(
            newsPage?.querySelectorAll("p.MsoNormal>span")
          )
        ).map((element) => element.innerHTML);

        if (
          category !== undefined &&
          title !== undefined &&
          link !== undefined &&
          metadata !== undefined
        ) {
          return {
            category: categories[category as keyof typeof categories],
            title,
            link: `https://jkt48.com${link}`,
            content: content.join("\n"),
            date: `${metadata[2]}-${
              months[metadata[1] as keyof typeof months] + 1
            }-${metadata[0]}`,
          };
        }
      });
      Promise.all(promises).then((news) => {
        newsList = [...newsList, ...news];
      });
    }
  }
  return JSON.stringify(newsList);
}
