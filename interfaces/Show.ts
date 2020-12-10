import { PerformingTeam } from "./Team.ts";

export default interface Show {
    title: string;
    datetime: Date;
    performers: PerformingTeam;
}
