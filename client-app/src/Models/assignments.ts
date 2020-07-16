import { IUser } from "./user";

export interface IAssignment {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  categoryName: number | string;
  timePosted: Date;
  deadline: Date;
  status: number | string;
  creator: IUser;
}

export interface IAssignmentFormValues {
  id: string | undefined;
  companyId: string | undefined;
  companyName: string| undefined;
  title: string;
  description: string;
  categoryId: number | string;
  timePosted: Date | undefined;
  deadline: Date | undefined;
  status: number | string;
  creator: IUser | null;
}