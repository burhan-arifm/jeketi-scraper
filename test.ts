import MemberScraper from "./members/scraper.ts";
import ShowScraper from "./shows/scraper.ts";

try {
    Deno.writeTextFile("./parsed-members.json", await MemberScraper());
    Deno.writeTextFile("./parsed-shows.json", await ShowScraper());
    console.log("Page scrapped!");
} catch (error) {
    console.error(error);
}
