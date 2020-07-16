export interface IUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: number;
  token: string;
  image?: string;
}

export interface IUserFormValues {
  email: string;
  firstName: string;
  lastName: string;
  role: number;
  password: string;
  username: string;
}