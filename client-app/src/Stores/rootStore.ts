import { createContext } from "react";
import { configure } from "mobx";
import AssignmentStore from "./assignmentStore";
import UserStore from "./userStore";
import TeamStore from "./teamStore";
import ModalStore from "./modalStore";
import MessageStore from "./messageStore";

configure({enforceActions: "always"});

export class RootStore {
  assignmentStore: AssignmentStore;
  userStore: UserStore;
  teamStore: TeamStore
  modalStore: ModalStore
  messageStore: MessageStore

  constructor() {
    this.assignmentStore = new AssignmentStore(this);
    this.userStore = new UserStore(this);
    this.teamStore = new TeamStore(this);
    this.modalStore = new ModalStore(this);
    this.messageStore = new MessageStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());