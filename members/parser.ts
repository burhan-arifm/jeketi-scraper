// deno-lint-ignore-file
import Member from "../interfaces/Member.ts";

export function TeamParser(teamName: string, teamFrame: any) {
    const members: Member[] = [];
    teamFrame.querySelectorAll(".profileWrap").forEach((member: any) => {
        const imageTag = member.querySelector("a>img");
        members.push({
            name: imageTag.getAttribute("alt"),
            imageUrl: `https://jkt48.com${imageTag
                .getAttribute("src")
                .replace(/(_s\.jpg\?r=[0-9]*)/i, ".jpg")}`,
            team: teamName,
        });
    });
    return members;
}

export function AcademyParser(academyClass: string, academyFrame: any) {
    const students: Member[] = [];
    academyFrame.querySelectorAll("tr").forEach((row: any) => {
        row.querySelectorAll("td").forEach((student: any) => {
            students.push({
                name: student
                    .querySelector("p.name-member")
                    .innerHTML.replace("<br><br>", "")
                    .split("<br>")
                    .join(" "),
                imageUrl: `https://jkt48.com${student
                    .querySelector("a>img")
                    .getAttribute("src")}`,
                team: academyClass,
            });
        });
    });
    return students;
}
