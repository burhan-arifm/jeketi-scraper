import {
    DOMParser,
    Element,
} from "https://deno.land/x/deno_dom@v0.1.3-alpha2/deno-dom-wasm.ts";
import Member from "../interfaces/Member.ts";
import { AcademyParser, TeamParser } from "./parser.ts";

export default async function MemberScraper(): Promise<string> {
    const members: Member[] = [];

    const teamMembersPage = await fetch("https://jkt48.com/member/list")
        .then((response) => response.text())
        .then((html) => new DOMParser().parseFromString(html, "text/html"));

    const teamTitles: string[] = Array.from(
        Array.prototype.slice.call(
            teamMembersPage?.querySelectorAll(".pagetitle>h2")
        )
    ).map((title) => title.childNodes.item(0).data.replace("Team ", ""));
    const teamFrames: Element[] = Array.from(
        Array.prototype.slice.call(teamMembersPage?.querySelectorAll(".post"))
    );
    teamTitles.forEach((name, index) =>
        members.push(...TeamParser(name, teamFrames[index]))
    );

    const AcademyMembersPage = await fetch(
        "https://jkt48.com/jkt48-academy/member-academy"
    )
        .then((response) => response.text())
        .then((html) => new DOMParser().parseFromString(html, "text/html"));
    const academyClass: string[] = Array.from(
        Array.prototype.slice.call(
            AcademyMembersPage?.querySelectorAll("h1.title-h1")
        )
    ).map((title) => title.childNodes.item(0).data);
    const academyFrames: Element[] = Array.from(
        Array.prototype.slice.call(
            AcademyMembersPage?.querySelectorAll("table.table-member")
        )
    );
    academyClass.forEach((name, index) =>
        members.push(...AcademyParser(name, academyFrames[index]))
    );

    return JSON.stringify(members);
}
