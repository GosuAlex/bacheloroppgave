import { observable, action, runInAction } from "mobx";
import { createContext } from "react";
import { ITeam } from "Models/teams";
import agent from "Api/agent";
import { RootStore } from "./rootStore";
import { ItemHeader } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { ITeamMember } from "Models/teammembers";
import { stringify } from "querystring";

export default class TeamStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }


  @observable teamMember: ITeamMember = { teamId: '0', teamName: '0', userId: '0', email: '0', firstName: '0', lastName: '0', status: '0', imagePath: '0' }
  @observable newTeam: ITeam = { id: '', name: '', description: '', userid: '', status: '', teammembers: [] }
  @observable teams: ITeam[] = [];
  @observable selectedTeam: ITeam | undefined;
  @observable teamIsSelected: boolean = false;
  @observable teamFormOpen: boolean = false;
  @observable teamMembers: ITeamMember[] = [];
  @observable teamRequests: ITeamMember[] = [];
  @observable teamRequestsPending: ITeamMember[] = [];
  @observable teamInvites: ITeamMember[] = [];
  @observable teamInviteOpen: boolean = false;
  @observable publicTeams: ITeam[] = [];
  
  @action loadPublicTeams = async () => {

      console.log('LOADING PUBLIC TEAMS')
    if (this.rootStore.userStore.user?.id) {
      try {
        
        const teams = await agent.Teams.listPublicTeams(this.rootStore.userStore.user?.id);
  
        runInAction("loading public teams", () => {
          this.publicTeams = [];
          teams.forEach((team) => {
            this.publicTeams.push(team);
            
  
          });
        });
      } catch (error) {
        console.log(error);

      }
    }


  }
  
  @action join = async (input: string) => {
    if (this.rootStore.userStore.user) {
      let teammember = {
        teamId: input,
        teamName: this.teamMember.teamName,
        userId: this.rootStore.userStore.user.id,
        email: this.teamMember.email,
        firstName: this.teamMember.firstName,
        lastName: this.teamMember.lastName,
        status: this.teamMember.status,
        imagePath: this.teamMember.imagePath
      };

      try {
        runInAction("joining team", () => {
          for(var i = 0; i < this.publicTeams.length; i++){
            if ( this.publicTeams[i].id === input) { this.publicTeams.splice(i, 1); }}

            
        });
        await agent.Teams.join(teammember);
        
       
      } catch (error) {
        console.log(error);
      }
    }
  }

  @action setTeamStatus = async (status: string) => {
    
    if (this.selectedTeam) {
      this.selectedTeam.status = status;
      try {
        await agent.Teams.setTeamStatus(this.selectedTeam);
      } catch (error) {
        console.log();
      }



      }
    
  }
  
  @action displayTeamInvite = (input: boolean) => {
    this.teamInviteOpen = input;
  }

  @action resetSelectedTeam = () => {
    this.teamIsSelected = false;
    this.selectedTeam = undefined;

  }

  @action loadTeamMembers = async (teamid: string) => {
    try {
      const members = await agent.Teams.listTeamMembers(teamid);
      const team = this.teams.find(a => a.id === teamid);
      
      runInAction("loading team members", () => {
        this.teamMembers = [];
        members.forEach((member) => {
          this.teamMembers.push(member);

        });
      });

    } catch (error) {
      console.log(error);
    }
  }

  @action accept = async (member: ITeamMember) => {
    if (member.status === '2') {
      console.log('this is an invite');
      for(var i = 0; i < this.teamInvites.length; i++){
        if ( this.teamInvites[i].userId === member.userId && this.teamInvites[i].teamId === member.teamId) { 
          this.teamInvites.splice(i, 1); }
        }

    } else if (member.status === '3') {
      console.log('this is a request');
      for(var i = 0; i < this.teamRequests.length; i++){
        if ( this.teamRequests[i].userId === member.userId && this.teamRequests[i].teamId === member.teamId) { 
          this.teamRequests.splice(i, 1); }
        }
    }
  
    try {
      await agent.Teams.accept(member);
    } catch (error) {
      console.log(error);
    }
  }

  @action deny = async (member: ITeamMember) => {
    if (member.status === '2') {
      console.log('this is an invite');
      for(var i = 0; i < this.teamInvites.length; i++){
        if ( this.teamInvites[i].userId === member.userId && this.teamInvites[i].teamId === member.teamId) { 
          this.teamInvites.splice(i, 1); }
        }
    } else if (member.status === '3') {
      console.log('this is a request');
      for(var i = 0; i < this.teamRequests.length; i++){
        if ( this.teamRequests[i].userId === member.userId && this.teamRequests[i].teamId === member.teamId) { 
          this.teamRequests.splice(i, 1); }
        }
    }

    try {
      await agent.Teams.deny(member);
    } catch (error) {
      console.log(error);
    }
  }

  @action loadTeamInvites = async () => {
    if (this.rootStore.userStore.user?.id) {
      try {
        const invites = await agent.Teams.listTeamInvites(this.rootStore.userStore.user?.id);
        
        runInAction("loading team invites", () => {
          this.teamInvites = [];
          invites.forEach((invite) => {
            this.teamInvites.push(invite);
            console.log(invite.teamName + " has invited you (" + invite.firstName + ") to join their team");
          })
  
        });
  
      } catch (error) {
        console.log(error);
      }
    }
  }

  @action loadTeamRequests = async () => {
    if (this.rootStore.userStore.user?.id) {
      try {
        const requests = await agent.Teams.listTeamRequests(this.rootStore.userStore.user?.id);
        
        runInAction("loading team requests", () => {
          this.teamRequests = [];
          requests.forEach((request) => {
            this.teamRequests.push(request);
          })
  
        });
  
      } catch (error) {
        console.log(error);
      }
    }
  }

  @action listTeamRequestsPending = async () => {
    if (this.rootStore.userStore.user?.id) {
      try {
        const requests = await agent.Teams.listTeamRequestsPending(this.rootStore.userStore.user?.id);
        
        runInAction("loading team requests", () => {
          this.teamRequestsPending = [];
          requests.forEach((request) => {
            this.teamRequestsPending.push(request);
          })
  
        });
  
      } catch (error) {
        console.log(error);
      }
    }
  }

  @action loadTeams = async () => {

    if (this.rootStore.userStore.user?.id) {
      try {
        const teams = await agent.Teams.listMyTeams(this.rootStore.userStore.user.id);

        if (this.teams.length === 0) {
          runInAction("setting teams", () => {
            teams.forEach((team) => {
              this.teams.push(team);
            });
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

  };

  @action invite = async () => {
    this.displayTeamInvite(false);

    let teammember = {
      teamId: this.teamMember.teamId,
      teamName: this.teamMember.teamName,
      userId: this.teamMember.userId,
      email: this.teamMember.email,
      firstName: this.teamMember.firstName,
      lastName: this.teamMember.lastName,
      status: this.teamMember.status,
      imagePath: this.teamMember.imagePath
    };


    try {
      await agent.Teams.invite(teammember);
    } catch (error) {
      console.log(error);
    }

  }

  @action createTeam = async () => {
    if (this.rootStore.userStore.user?.id) {
      let newTeam = {
        id: uuid(),
        name: this.newTeam.name,
        description: this.newTeam.description,
        userid: this.rootStore.userStore.user.id,
        status: "1",
        teammembers: []
      };

      this.teams.push(newTeam);
      console.log(newTeam);

      try {
        await agent.Teams.create(newTeam);


      } catch (error) {
        console.log(error);
      }

      this.displayTeamForm(false);
      this.loadTeams();
    }



  };

  @action leaveTeam = async () => {

    if (this.rootStore.userStore.user?.id) {

      this.teamIsSelected = false;

      let teammember = {
        teamId: this.teamMember.teamId,
        teamName: this.teamMember.teamName,
        userId: this.rootStore.userStore.user?.id,
        email: this.teamMember.email,
        firstName: this.teamMember.firstName,
        lastName: this.teamMember.lastName,
        status: this.teamMember.status,
        imagePath: this.teamMember.imagePath

      };
      for(var i = 0; i < this.teams.length; i++){
         if ( this.teams[i].id === this.teamMember.teamId) { this.teams.splice(i, 1); }}

      try {

        await agent.Teams.leaveTeam(teammember);

      } catch (error) {
        console.log(error);
      }

      this.displayTeamForm(false);
      this.loadTeams();

    }

  };

  @action displayTeamForm = (input: boolean) => {
    this.teamFormOpen = input;
  }

  @action selectTeam = (id: string) => {
    this.teamIsSelected = true;
    this.selectedTeam = this.teams.find((a) => a.id === id);
    this.loadTeamMembers(id);
    this.teamMember.teamId = id;
    this.displayTeamInvite(false);
    console.log(this.selectedTeam?.name);
  };

  @action deleteTeam = async () => {
    try {
      if (this.selectedTeam?.id) {
        //Remove team from database
        await agent.Teams.delete(this.selectedTeam.id);

        //Remove team from teams array
        runInAction("resetting selected team", () => {
          //this.selectedTeam = undefined;
          const teamToRemove = this.teams.findIndex(
            (a) => a.id === this.selectedTeam!.id
          );
          this.teams.splice(teamToRemove, 1);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

}
