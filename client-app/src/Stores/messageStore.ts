import { RootStore } from "./rootStore";
import agent from "../Api/agent";
import { observable, action, runInAction, computed, toJS } from "mobx";
import { IMessage } from "Models/messages";
import { v4 as uuid } from "uuid";

export default class MessageStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  //@observable recipientRegistry = new Map();
  @observable messageRegistry = new Map();
  @observable messageIsSelected: boolean = false;
  @observable message: IMessage[] = [];
  @observable messages: IMessage[] = [];
  //@observable recipients: IMessage[] = [];
  @observable newMessage: IMessage = {
    id: "",
    senderUserId: "",
    receiverUserId: "",
    title: "",
    content: "",
    status: "",
    firstName: "",
    lastName: "",
    date: "",
    email: "",
  };
  @observable loadingInitial = false;
  @observable loading = false;
  @observable selectedMessage: IMessage | undefined;
  @observable inbox: IMessage[] = [];
  @observable outbox: IMessage[] = [];

  @action selectInboxMessage = (id: string) => {
    this.messageIsSelected = true;
    this.selectedMessage = this.inbox.find((a) => a.id === id);
  };

  @action selectOutboxMessage = (id: string) => {
    this.messageIsSelected = true;
    this.selectedMessage = this.outbox.find((a) => a.id === id);
  };

  @action loadInbox = async () => {
    if (this.rootStore.userStore.user?.id) {
      try {
        const messages = await agent.Messages.listMyMessages(
          this.rootStore.userStore.user?.id
        );

        runInAction("loading messages", () => {
          this.inbox = [];
          messages.forEach((message) => {
            this.inbox.push(message);
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  @action loadOutbox = async () => {
    if (this.rootStore.userStore.user?.id) {
      try {
        const messages = await agent.Messages.listSentMessages(
          this.rootStore.userStore.user?.id
        );

        runInAction("loading messages", () => {
          this.outbox = [];
          messages.forEach((message) => {
            this.outbox.push(message);
            console.log(message.content + "innhold");
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  @action deleteSentMessage = async () => {
    for(var i = 0; i < this.outbox.length; i++){
      if ( this.outbox[i].id === this.selectedMessage?.id) { this.outbox.splice(i, 1); }}
    try {
      if (this.selectedMessage?.id) {
        await agent.Messages.deleteSentMessage(this.selectedMessage.id);
      }
    }catch (error) {
      console.log(error);
    }
  };

  @action deleteMessage = async () => {
    for(var i = 0; i < this.inbox.length; i++){
      if ( this.inbox[i].id === this.selectedMessage?.id) { this.inbox.splice(i, 1); }}
    try {
      if (this.selectedMessage?.id) {
        await agent.Messages.deleteMessage(this.selectedMessage.id);
      }
    }catch (error) {
      console.log(error);
    }
  };

 /*  @action listRecipients = async () => {
    try {
      const recipients = await agent.Messages.listRecipients();
      runInAction("loading recipients", () => {
        recipients.forEach((recipient) => {
          this.recipients.push(recipient);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }; */

  getMessage = (id: string) => {
    return this.messageRegistry.get(id);
  };

  @action loadMessage = async (id: string) => {
    let message = this.getMessage(id);
    if (message) {
      this.message = message;
      return toJS(message); // return JSON, not an observable.
    } else {
      this.loadingInitial = true;
      try {
        message = await agent.Messages.showMessage(id);
        runInAction("getting message", () => {
          //setActivityProps(activity, this.rootStore.userStore.user!);
          this.message = message;
          this.messageRegistry.set(message.id, message);
        });
        return message;
      } catch (error) {
        runInAction("getting activity error", () => {});
        console.log(error);
      }
    }
  };

  @action createMessage = async () => {
    
    if (this.rootStore.userStore.user?.id) {
      let newMessage = {
        id: uuid(),
        senderUserId: this.rootStore.userStore.user.id,
        receiverUserId: this.newMessage.receiverUserId,
        title: this.newMessage.title,
        content: this.newMessage.content,
        status: "1",
        date: this.newMessage.date,
        firstName: this.newMessage.firstName,
        lastName: this.newMessage.lastName,
        email: this.newMessage.email,
      };

      this.outbox.push(newMessage);

      try {
        await agent.Messages.create(newMessage);
      } catch (error) {
        console.log(error);
      }
    }
  };
}
