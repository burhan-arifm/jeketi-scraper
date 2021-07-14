import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.3-alpha2/deno-dom-wasm.ts";
import { format, parse } from "https://deno.land/std@0.98.0/datetime/mod.ts";

export async function TeamParser(originUrl: string, teamFrame: Element) {
  const memberFrames = Array.from(
    Array.prototype.slice.call(
      (<Element>teamFrame).querySelectorAll(".profileWrap>.profilename>a")
    )
  );
  const promises = memberFrames.map(
    async (memberUrl: Element) =>
      await fetch(`${originUrl}${memberUrl.getAttribute("href")}`)
        .then((response) => response.text())
        .then((html) => new DOMParser().parseFromString(html, "text/html"))
        .then((page) => page?.getElementById("bioHolder"))
        .then((container) => {
          const bioWrapper = container?.querySelector(".bioWrap");
          const nickname = bioWrapper?.querySelector(
            ".bio span[itemprop='nickname']"
          )?.innerHTML as string;

          return {
            name: bioWrapper?.querySelector(".bio span[itemprop='name']")
              ?.innerHTML as string,
            nickname,
            dob: format(
              parse(
                bioWrapper
                  ?.querySelector(".bio time[itemprop='birthday']")
                  ?.getAttribute("datetime") as string,
                "yyyy-MM-dd"
              ),
              "yyyy-MM-dd"
            ),
            bloodtype: bioWrapper?.querySelector(".bio span[itemprop='role']")
              ?.innerHTML as string,
            height: bioWrapper
              ?.querySelectorAll(".bio .bioright")[4]
              .childNodes[0].nodeValue?.toString()
              .replace(/([0-9]+)cm/, "$1") as unknown as number,
            imageUrl: `https://jkt48.com${bioWrapper
              ?.querySelector(".photo>img")
              ?.getAttribute("src")
              ?.replace(/(_s\.jpg\?r=[0-9]*)/i, ".jpg")}`,
            socialMedias: {
              twitter: container
                ?.querySelector("#twitterprofile a")
                ?.getAttribute("href") as string,
              instagram: container
                ?.querySelector("#instagramprofile a")
                ?.getAttribute("href") as string,
              tiktok: container
                ?.querySelector("#tiktokprofile a")
                ?.getAttribute("href") as string,
              showroom: `https://www.showroom-live.com/JKT48_${nickname}`,
            },
          };
        })
  );

  return await Promise.all(promises);
}
