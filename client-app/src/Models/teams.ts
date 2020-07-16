import { ITeamMember } from "./teammembers";

export interface ITeam {
    id: string;
    name: string;
    description: string;
    userid: string;
    status: string;
    teammembers: ITeamMember[];
  }