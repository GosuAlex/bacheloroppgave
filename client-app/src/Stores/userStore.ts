import { observable, computed, action, runInAction, reaction, toJS } from "mobx";
import { IUser, IUserFormValues } from "Models/user";
import agent from "Api/agent";
import { RootStore } from "./rootStore";
import { history } from "index";
import { ICompany } from "Models/companies";
import { v4 as uuid } from "uuid";

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem("jwt", token);
        } else {
          window.localStorage.removeItem("jwt");
        }
      }
    );
  }

  @observable user: IUser | null = null;
  @observable userCompany: ICompany | undefined = undefined;

  @observable profile: IUser | undefined = undefined;

  @observable token: string | null = window.localStorage.getItem("jwt");
  @observable appLoaded = false;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/");
    } catch (error) {
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      values.role = Number(values.role);
      const user = await agent.User.register(values);
      this.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/");
    } catch (error) {
      throw error;
    }
  };

  @action setToken = (token: string | null) => {
    window.localStorage.setItem("jwt", token!);
    this.token = token;
  };

  @action setAppLoaded = () => {
    this.appLoaded = true;
  };

  @action logout = () => {
    this.setToken(null);
    this.user = null;
    history.push("/");
  };

  @action getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  @action getUserCompany = async (userId: string) => {
    if (userId === this.userCompany?.userId) {
      return toJS(this.userCompany); // return JSON, not an observable.
    } else {
      try {
        const company = await agent.Company.current(userId);
        runInAction(() => {
          this.userCompany = company;
        });
        return this.userCompany;
      } catch (error) {
        console.log(error);
      }
    }
  };

  @action createUserCompany = async (values: any, user: IUser | null) => {
    const company: ICompany = {
      ...values,
      id: uuid(),
      userId: user?.id,
    };
    try {
      await agent.Company.create(company);
      runInAction(() => {
        this.userCompany = company;
      });
      this.rootStore.modalStore.closeModal()
    } catch (error) {
      console.log(error);
    }
  };

  @action getUserProfile = async (userId: string) => {
    if (this.profile?.id === userId) {
      return toJS(this.profile);
    } else {
      try {
        const profile = await agent.User.profile(userId);
        runInAction(() => {
          this.profile = profile;
        });
        return toJS(profile);
      } catch (error) {
        console.log(error);
      }
    }
  };
}
