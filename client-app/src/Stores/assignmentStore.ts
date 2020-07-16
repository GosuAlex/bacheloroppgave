import { RootStore } from "./rootStore";
import agent from "../Api/agent";
import { history } from "../";
import { observable, action, runInAction, computed, toJS } from "mobx";
import { IAssignment, IAssignmentFormValues } from "Models/assignments";
import { v4 as uuid } from "uuid";
import { IAssignmentMember } from "Models/assignmentMember";
import { IIncomingRequests } from "Models/incomingRequests";

export default class AssignmentStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable assignmentRegistry = new Map();
  @observable assignment: IAssignment | null = null;
  @observable assignmentTeams: string[] = [];
  @observable loadingInitial = false;
  @observable loading = false;
  @observable submitting = false;

  //My Assignments

  @observable myAssignments: IAssignment[] = [];
  @observable myAssignmentRequests: IAssignment[] = [];
  @observable incomingAssignmentRequests: IIncomingRequests[] = [];
  @observable companyAssignments: IAssignment[] = [];
  @observable mySelectedAssignment: IAssignment | undefined;
  @observable assignmentIsSelected: boolean = false;

  @action setSelectedAssignment = (id: string) => {
    console.log(id);
    runInAction("selecting team", () => {
      
      this.assignmentIsSelected = true;
      this.mySelectedAssignment = this.myAssignments.find((assignment) => assignment.id === id);
      console.log(this.mySelectedAssignment);
    });
  };

  @action setSelectedAssignmentRequest = (id: string) => {
    console.log(id);
    runInAction("selecting team", () => {
      
      this.assignmentIsSelected = true;
      this.mySelectedAssignment = this.myAssignmentRequests.find((assignment) => assignment.id === id);
      console.log(this.mySelectedAssignment);
    });
  };

  @action setSelectedCompanyAssignment = (id: string) => {
    console.log("click");
    this.assignmentIsSelected = true;
    this.mySelectedAssignment = this.companyAssignments.find((assignment) => assignment.id === id);
    console.log(this.mySelectedAssignment?.title);
  };

  @action loadMyAssignments = async () => {
    console.log("load my assignments");
    if (this.rootStore.userStore.user?.id) {
      try {
        const assignments = await agent.Assignments.myAssignments(this.rootStore.userStore.user?.id);
        runInAction("loading my assignments", () => {
          this.myAssignments = [];
          assignments.forEach((assignment) => {
            this.myAssignments.push(assignment);
            console.log(assignment);
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  @action loadMyAssignmentRequests = async () => {
    console.log("load my assignment requests");
    if (this.rootStore.userStore.user?.id) {
      try {
        const assignments = await agent.Assignments.myAssignmentRequests(this.rootStore.userStore.user?.id);
        runInAction("loading my assignment requests", () => {
          this.myAssignmentRequests = [];
          assignments.forEach((assignment) => {
            this.myAssignmentRequests.push(assignment);
            console.log(assignment);
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  @computed get assignments() {
    return Array.from(this.assignmentRegistry.values());
  }

  @computed get getAssignmentTeams() {
    return toJS(this.assignmentTeams);
  }

  // @computed get assignmentsByDate() {
  //   return this.groupAssignmentsByDate(Array.from(this.assignmentRegistry.values()))
  // }

  // groupAssignmentsByDate(assignments: IAssignment[]) {
  //   const sortedAssignments = assignments.sort(
  //     (a, b) => a.deadline.getTime() - b.deadline.getTime()
  //   )
  //   return Object.entries(sortedAssignments.reduce((assignments, assignment) => {
  //     const date = assignment.deadline.toISOString().split('T')[0];
  //     assignments[date] = assignments[date] ? [...assignments[date], assignment] : [assignment];
  //     return assignments;
  //   }, {} as {[key: string]: IAssignment[]}));
  // }

  @action loadAssignments = async () => {
    try {
      const assignments = await agent.Assignments.list();
      this.assignmentRegistry.clear();
      runInAction("loading assignments", () => {
        assignments.forEach((assignment) => {
          assignment.deadline = new Date(assignment.deadline);
          assignment.status = this.numberToTextStatus(assignment.status);
          this.assignmentRegistry.set(assignment.id, assignment);
        });
      });
    } catch (error) {
      runInAction("load assignment error", () => {});
      console.error(error);
    }
  };

  @action loadAssignmentsCategory = async (categoryId: string | undefined) => {
    try {
      const assignments = await agent.Assignments.listCategory(categoryId);
      runInAction("loading assignments", () => {
        this.assignmentRegistry.clear();
        assignments.forEach((assignment) => {
          assignment.deadline = new Date(assignment.deadline);
          assignment.status = this.numberToTextStatus(assignment.status);
          this.assignmentRegistry.set(assignment.id, assignment);
        });
      });
    } catch (error) {
      runInAction("load assignment error", () => {});
      console.error(error);
    }
  };

  @action loadAssignment = async (id: string) => {
    let assignment = this.getAssignment(id);
    if (assignment) {
      this.assignment = assignment;
      return toJS(assignment); // return JSON, not an observable.
    } else {
      try {
        assignment = await agent.Assignments.details(id);
        runInAction("getting assignment", () => {
          this.assignment = assignment;
          assignment.status = this.numberToTextStatus(assignment.status);
          this.assignmentRegistry.set(assignment.id, assignment);
        });
        return assignment;
      } catch (error) {
        runInAction("getting activity error", () => {});
        console.error(error);
      }
    }
  };

  @action createAssignment = async (assignment: IAssignmentFormValues) => {
    this.submitting = true;
    try {
      await agent.Assignments.create(assignment);
      runInAction("creating assignment", () => {
        this.assignmentRegistry.set(assignment.id, assignment);
        this.submitting = false;
      });
      // history.push(`/oppgave/${assignment.id}`);
      history.push(`/mineoppdrag`);
    } catch (error) {
      runInAction("creating activity error", () => {
        this.submitting = false;
      });
      //toast.error("Problem submitting data");
      console.log(error.response);
    }
  };

  @action editAssignment = async (assignment: IAssignmentFormValues) => {
    try {
      await agent.Assignments.update(assignment);
      runInAction("updating assignment", () => {
        // this.assignment = assignment;
        this.assignmentRegistry.set(assignment.id, assignment);
        this.assignment = this.assignmentRegistry.get(assignment.id);
      });
      history.push(`/oppgave/${assignment.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  @action deleteAssignment = async (id: string) => {
    try {
      await agent.Assignments.delete(id);
      runInAction("updating assignment", () => {
        this.assignment = null;
        this.assignmentRegistry.delete(id);
      });
      history.push(`/utforsk`);
    } catch (error) {
      console.error(error);
    }
  };

  @action joinAssignment = async (teamId: string | undefined, assignmentId: string) => {
    if (!teamId || !assignmentId) return;

    const assignmentMember: IAssignmentMember = {
      id: uuid(),
      teamId: teamId,
      assignmentId: assignmentId,
      status: 2,
    };

    this.submitting = true;
    try {
      await agent.Assignments.join(assignmentMember);
      runInAction("leaving assignment", () => {
        this.submitting = false;
      });
    } catch (error) {
      runInAction("joining assignment error", () => {
        this.submitting = false;
      });
      //toast.error("Problem submitting data");
      console.log(error.response);
    }
  };

  @action acceptTeamOnAssignment = async (request: IIncomingRequests) => {
    if (!request) {
      console.log("no teamId" + request);
      return;
    }

    this.submitting = true;
    try {
      await agent.Assignments.acceptTeamOnAssignment(request);
      runInAction("aceepting team on assignment", () => {
        this.submitting = false;
      });
    } catch (error) {
      runInAction("aceepting team on assignmenterror", () => {
        this.submitting = false;
      });
      //toast.error("Problem submitting data");
      console.log(error.response);
    }
  };

  @action denyTeamOnAssignment = async (request: IIncomingRequests) => {
    if (!request) {
      console.log("no teamId" + request);
      return;
    }

    this.submitting = true;
    try {
      await agent.Assignments.denyTeamOnAssignment(request);
      runInAction("deny team on assignment", () => {
        this.incomingAssignmentRequests.forEach((storedRequest, idx) => {
          if (storedRequest.id == request.id) {
            this.incomingAssignmentRequests.splice(idx, 1);
          }
        });
        this.submitting = false;
      });
    } catch (error) {
      runInAction("deny team on assignmenterror", () => {
        this.submitting = false;
      });
      //toast.error("Problem submitting data");
      console.log(error.response);
    }
  };

  @action loadIncomingAssignmentRequests = async (companyId: string | undefined) => {
    if (!companyId) {
      console.log("no teamId" + companyId);
      return;
    }

    this.submitting = true;
    try {
      const requests = await agent.Assignments.incomingAssignmentRequests(companyId);
      runInAction("getting incoming request assignment as company", () => {
        this.incomingAssignmentRequests = [];
        requests.forEach((request) => {
          this.incomingAssignmentRequests.push(request);
        });
        this.submitting = false;
      });
    } catch (error) {
      runInAction("getting incoming request assignment as company error", () => {
        this.submitting = false;
      });
      //toast.error("Problem submitting data");
      console.log(error.response);
    }
  };

  @action leaveAssignment = async (teamId: string | undefined, assignmentId: string) => {
    if (!teamId || !assignmentId) return;
    const combinedString = teamId + "|" + assignmentId;

    this.submitting = true;
    try {
      await agent.Assignments.leave(combinedString);
      runInAction("leaving assignment", () => {
        this.submitting = false;
      });
    } catch (error) {
      runInAction("joining assignment error", () => {
        this.submitting = false;
      });
      console.error(error);
    }
  };

  @action loadTeamsOnAssignment = async (assignmentId: string) => {
    // if(!assignmentId) return;

    try {
      const teamsIds = await agent.Assignments.teams(assignmentId);
      runInAction("getting teams on assignment", () => {
        this.assignmentTeams = teamsIds;
      });
    } catch (error) {
      console.error(error);
    }
  };

  @action listAssignmentsOnCompany = async (companyId: string | undefined) => {
    if (!companyId) {
      console.log("no teamId" + companyId);
      return;
    }

    try {
      const assignments = await agent.Assignments.listAssignmentsOnCompany(companyId);
      runInAction("getting assignment on company", () => {
        this.companyAssignments = [];
        assignments.forEach((assignment) => {
          this.companyAssignments.push(assignment);
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  @action cleanTeamsOnAssignment = () => {
    this.assignmentTeams = [];
  };

  @action clearAssignments = () => {
    this.assignmentRegistry.clear();
  };

  getAssignment = (id: string) => {
    return this.assignmentRegistry.get(id);
  };

  numberToTextStatus = (number: number | string): string => {
    switch (Number(number)) {
      case 1:
        return "Fullført Oppgave";
      case 2:
        return "Åpen Oppgave";
      case 3:
        return "Låst Oppgave";
      default:
        return "errorStatus";
    }
  };
}
