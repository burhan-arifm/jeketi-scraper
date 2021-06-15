import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.3-alpha2/deno-dom-wasm.ts";
import { parse } from "https://deno.land/std@0.98.0/datetime/mod.ts";
import Show from "../interfaces/Show.ts";
import { PerformingTeam } from "../interfaces/Team.ts";

export default async function ShowScraper(source: string) {
  const showElements = await fetch(source)
    .then((response) => response.text())
    .then((html) => new DOMParser().parseFromString(html, "text/html"))
    .then((page) => page?.querySelectorAll("table"));
  const performers: PerformingTeam[] = Array.from(
    Array.prototype.slice.call(
      (<Element>showElements?.item(1).childNodes.item(1)).querySelectorAll(
        "tr:not([class])"
      )
    )
  ).map((showElement) => {
    const showDetails = showElement.querySelectorAll("td");
    return {
      team: TeamName(
        showDetails.item(1).childNodes.item(0).getAttribute("src")
      ),
      performingMembers: Array.from(
        Array.prototype.slice.call(
          showDetails.item(2).querySelectorAll("a[target='member']")
        )
      ).map((member) => member.innerHTML),
    };
  });
  const birthdayShows = Array.from(
    Array.prototype.slice.call(
      (<Element>showElements?.item(1).childNodes.item(1)).querySelectorAll(
        "tr:not([class])"
      )
    )
  ).map((showElement) => {
    const showDetails = showElement.querySelectorAll("td");
    return {
      isBirthdayShow: !!showDetails
        .item(2)
        .querySelector("img[src='/images/icon.cat5.png']"),
      birthdayMembers: Array.from(
        Array.prototype.slice.call(
          showDetails.item(2).querySelectorAll("a[style^='color:#']")
        )
      ).map((member) => member.innerHTML),
    };
  });
  const showList: Show[] = Array.from(
    Array.prototype.slice.call(
      (<Element>showElements?.item(0).childNodes.item(1)).querySelectorAll(
        'tr>td[rowspan="3"]:first-child'
      )
    )
  ).map((childElement, index) => {
    const showElement = childElement.parentElement.querySelector(
      'tr>td[rowspan="3"]:not(:first-child)'
    ).childNodes;
    const childrenHTML = childElement.innerHTML;

    return {
      title: showElement.item(2).data,
      datetime: parse(
        `${childrenHTML.match(/[0-9]+\.[0-9]+\.[0-9]+/i)[0]} ${
          childrenHTML.match(/[0-9]+:[0-9]+/i)[0]
        }`,
        "d.M.yyyy HH:mm"
      ),
      performers: performers[index],
      isBirthdayShow: birthdayShows[index].isBirthdayShow,
      birthdayMembers: birthdayShows[index].birthdayMembers,
    };
  });

  return JSON.stringify(showList.sort((a, b) => +a.datetime - +b.datetime));
}

function TeamName(teamIconUrl: string) {
  const team = teamIconUrl.replace(/\/images\/icon\.team([0-9]*)\.png/i, "$1");
  return team === "11"
    ? "Academy Class A"
    : `Team ${team === "1" ? "J" : team === "2" ? "KIII" : "T"}`;
}
