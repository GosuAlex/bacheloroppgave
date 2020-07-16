import axios, { AxiosResponse } from 'axios';
import { IAssignment, IAssignmentFormValues } from 'Models/assignments';
import { IStudent } from 'Models/students';
import { history } from '../';
import { ITeam } from 'Models/teams';
import { IMessage } from 'Models/messages';
import { IUserFormValues, IUser } from 'Models/user';
import { ITeamMember } from 'Models/teammembers';
import { IAssignmentMember } from 'Models/assignmentMember';
import { ICompany } from 'Models/companies';
import { IIncomingRequests } from 'Models/incomingRequests';


axios.defaults.baseURL = process.env.REACT_APP_API_URL;  //Endre host-adresse i client-app/.env.development hvis det ikke fungerer (legg den i .gitignore etterpå), baseURL.ts ikke lenger i bruk

axios.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => {
  return Promise.reject(error);
})

axios.interceptors.response.use(undefined, error => {
  if (error.message === "Network Error" && !error.response) {
    //toast.error("Network error - make sure API is running!");
    console.error("Network error - make sure API is running!");
  }
  const { status, data, config, headers } = error.response;
  if (status === 404) {
    history.push("/notfound");
  }
  if (status === 401 && headers["www-authenticate"].slice(0, 69) === "Bearer error=\"invalid_token\", error_description=\"The token expired at") {
    window.localStorage.removeItem("jwt");
    history.push("/");
    //toast.info("Your session has expired, please login again");
    console.info("Your session has expired, please login again");
  }
  if (status === 400 && config.method === "get" && data.errors.hasOwnProperty("id")) {
    history.push("/notfound");
  }
  if (status === 500) {
    //toast.error("Server error - check the terminal for more info!");
    console.error("Server error - check the terminal for more info!");
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

// typer http requests:
const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
  // postForm er for bilde
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios.post(url, formData, {
      headers: { "Content-type": "multipart/form-data" }
    }).then(responseBody)
  }
};

const Students = {
  list: (): Promise<IStudent[]> => axios.get("/students").then(responseBody),
  getAll: () => requests.get("/students"),
  create: (student: IStudent) => requests.post('/students', student)
};

const Teams = {
  list: (): Promise<ITeam[]> => requests.get('/teams'),
  create: (team: ITeam) => requests.post('/teams/createteam/', team),
  leaveTeam: (teammember: ITeamMember) => requests.post('/teams/leaveteam/', teammember),
  delete: (id: string) => requests.del(`/teams/${id}`),
  listMyTeams: (userid: string): Promise<ITeam[]> => requests.get(`/teams/myteams/${userid}`),
  listTeamMembers: (teamid: string): Promise<ITeamMember[]> => requests.get(`/teams/teammembers/${teamid}`),
  invite: (member: ITeamMember) => requests.post('/teams/invite', member),
  join: (member: ITeamMember) => requests.post('/teams/join', member),
  listTeamRequests: (userid: string): Promise<ITeamMember[]> => requests.get(`/teams/requests/${userid}`),
  listTeamRequestsPending: (userid: string): Promise<ITeamMember[]> => requests.get(`/teams/requestsPending/${userid}`),
  listTeamInvites: (userid: string): Promise<ITeamMember[]> => requests.get(`/teams/invites/${userid}`),
  accept: (member: ITeamMember) => requests.post('/teams/accept', member),
  deny: (member: ITeamMember) => requests.post('/teams/deny', member),
  listPublicTeams: (userid: string): Promise<ITeam[]> => requests.get(`/teams/publicteams/${userid}`),
  setTeamStatus: (team: ITeam) => requests.post('/teams/setstatus', team) 
};

const Company = {
  current: (userId: string) => requests.get(`/companies/${userId}`),
  create: (company: ICompany) => requests.post(`/companies/`, company),
}

const Assignments = {
  list: (): Promise<IAssignment[]> => axios.get("/assignment/list").then(responseBody),
  listCategory: (categoryId: string | undefined): Promise<IAssignment[]> => axios.get(`/assignment/listCategory/${categoryId}`).then(responseBody),
  details: (id: string) => requests.get(`/assignment/details/${id}`),
  create: (assignment: IAssignmentFormValues) => requests.post("/assignment/create", assignment),
  update: (assignment: IAssignmentFormValues) => requests.put(`/assignment/update/${assignment.id}`, assignment),
  delete: (id: string) => requests.del(`/assignment/delete/${id}`),
  join: (assignmentMember: IAssignmentMember) => requests.post(`/assignment/join/`, assignmentMember),
  acceptTeamOnAssignment: (request: IIncomingRequests) => requests.put(`/assignment/AcceptTeamOnAssignment/`, request),
  denyTeamOnAssignment: (request: IIncomingRequests) => requests.put(`/assignment/DenyTeamOnAssignment/`, request),
  leave: (combinedString: string) => requests.del(`/assignment/leave/${combinedString}`),
  teams: (assignmentId: string) => requests.get(`/assignment/teams/${assignmentId}`),
  myAssignments: (userid: string) => requests.get(`/assignment/myassignments/${userid}`),
  listAssignmentsOnCompany: (companyId: string) => requests.get(`/assignment/ListAssignmentsOnCompany/${companyId}`),
  myAssignmentRequests: (userid: string) => requests.get(`/assignment/myassignmentrequests/${userid}`),
  incomingAssignmentRequests: (companyId: string) => requests.get(`/assignment/IncomingAssignmentRequests/${companyId}`),
};

const User = {
  current: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/login`, user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/register`, user),
  profile: (userId: string): Promise<IUser> => requests.get(`/user/${userId}`),
}

const Messages = {
  listMyMessages: (userid: string): Promise<IMessage[]> => requests.get(`/messages/myinbox/${userid}`),
  listSentMessages: (userid: string): Promise<IMessage[]> => requests.get(`/messages/myoutbox/${userid}`),
  //listRecipients: (): Promise<IMessage[]> => requests.get(`/messages/recipients`),
  showMessage: (id: string) => requests.get(`/messages/viewmessage/${id}`),
  showSentMessage: (id: string) => requests.get(`/messages/viewsentmessage/${id}`),
  create: (message: IMessage) => requests.post(`/messages/createmessage`, message),
  deleteSentMessage: (id: string) => requests.del(`/messages/deletesentmessage/${id}`),
  deleteMessage: (id: string) => requests.del(`/messages/deletemessage/${id}`)
};

export default {
  Students,
  Assignments,
  Teams,
  User,
  Messages,
  Company
}