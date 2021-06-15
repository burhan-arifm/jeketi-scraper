import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.3-alpha2/deno-dom-wasm.ts";
import { urlParse } from "https://deno.land/x/url_parse@1.0.0/mod.ts";
import { TeamParser } from "./parser.ts";

export default async function MemberScraper(source: string): Promise<string> {
  const url = urlParse(source);
  const members = await fetch(source)
    .then((response) => response.text())
    .then((html) => new DOMParser().parseFromString(html, "text/html"))
    .then((teamMembersPage) => {
      const teamTitles: string[] = Array.from(
        Array.prototype.slice.call(
          teamMembersPage?.querySelectorAll(".pagetitle>h2")
        )
      ).map((title) => title.childNodes.item(0).data.replace("Team ", ""));
      const teamFrames: Element[] = Array.from(
        Array.prototype.slice.call(teamMembersPage?.querySelectorAll(".post"))
      );
      return teamTitles.map(async (teamName, index) => {
        const promises = await TeamParser(url.origin, teamFrames[index]);

        return Promise.all(promises).then((teamMembers) => ({
          teamName,
          teamMembers,
        }));
      });
    });

  return Promise.all(members).then((result) => JSON.stringify(result));
}
