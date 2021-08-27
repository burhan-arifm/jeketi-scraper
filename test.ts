import MemberScraper from "./members/scraper.ts";
import ShowScraper from "./shows/scraper.ts";
import NewsScraper from "./news/scraper.ts";

try {
  await Deno.writeTextFile(
    "./parsed-members.json",
    await MemberScraper("https://jkt48.com/member/list")
  );
  Deno.writeTextFile(
    "./parsed-shows.json",
    await ShowScraper("https://www.jkt48.com/theater/schedule")
  );
  Deno.writeTextFile(
    "./parsed-news.json",
    await NewsScraper("https://www.jkt48.com/news/list")
  );
} catch (error) {
  console.error(error);
}
