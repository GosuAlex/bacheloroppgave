import React, { useState, useContext, useEffect } from "react";
import classes from "./MyTeams.module.css";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "Stores/rootStore";
import { runInAction } from "mobx";
import images from "../../Images/image.png"
import { Link } from 'react-router-dom';
import {
  Item,
  Button,
  Segment,
  GridColumn,
  Form,
  Image,
  Header,
  Grid,
  Input,
  Checkbox,
  Card,
  Icon,
} from "semantic-ui-react";
import { history } from "index";

const MyTeams = () => {
  {/********** TEAM STORE **********/ }
  const rootStore = useContext(RootStoreContext);
  const { teams, selectTeam, selectedTeam, leaveTeam, teamFormOpen, displayTeamForm, teamIsSelected, loadTeamMembers, teamMembers, loadTeamInvites, displayTeamInvite, teamInviteOpen, invite, newTeam, createTeam, teamMember, teamInvites, teamRequests, resetSelectedTeam, deny, accept, setTeamStatus } = rootStore.teamStore;

  useEffect(() => {
    rootStore.teamStore.resetSelectedTeam();
    rootStore.teamStore.loadTeams();
    rootStore.teamStore.loadTeamInvites();
    rootStore.teamStore.loadTeamRequests();

  }, [rootStore.teamStore]);

  {/********** INPUT CHANGES **********/ }
  const setTeamName = (evt) => {
    runInAction("setting team name", () => {
      newTeam.name = evt.target.value;
      console.log(newTeam.name);
    })
  };

  const setTeamDescription = (evt) => {
    runInAction("setting team name", () => {
      newTeam.description = evt.target.value;
      console.log(newTeam.description);
    })
  };

  const setTeamMemberEmail = (evt) => {
    runInAction("setting team member email", () => {
      teamMember.email = evt.target.value;
    })
  };

  {/********** SELECTED TEAM **********/ }
  return (

    <div className={classes.myTeamsGrid}>
      <Grid.Column>

        <Header as='h2'>Valgt team</Header>
        {teamIsSelected && (
          <div className={classes.selectedTeamCard}>
            <Card>
              <Card.Content>
                <Card.Header>{selectedTeam?.name} {selectedTeam?.status === '2' && (<div className={classes.teamStatus2}> Offentlig</div>)} {selectedTeam?.status === '1' && (<div className={classes.teamStatus1}> Privat</div>)} 
</Card.Header>
                <Card.Description>
                  {selectedTeam?.description}
                  <br></br><br></br><span className={classes.membersTitle}>Medlemmer</span>
                  {teamMembers.map((member) => (
                    <Segment className={classes.memberBox} onClick={() => history.push(`/profil/${member.userId}`)} >
                      <Image className={classes.iconProfileImage} src={images} circular />{member.firstName} {member.lastName} ({member.email})

                    </Segment>
                  ))}
                </Card.Description>
                {teamInviteOpen && (
                  <Form className={classes.inviteTeamMemberForm}>
                    <Form.Field>
                    <span className={classes.membersTitle}>E-post</span>
                      <input onChange={e => setTeamMemberEmail(e)} placeholder='' />
                    </Form.Field>

                    <Button onClick={() => invite()} color='green'>Inviter</Button>
                    <Button onClick={() => displayTeamInvite(false)} >Avbryt</Button>
                  </Form>


                )}
                {!teamInviteOpen && (
                  <div className={classes.teamInviteForm}>
                    <Button onClick={() => displayTeamInvite(true)} content='Inviter' color='blue' />
                    <Button onClick={() => leaveTeam()} content='Forlat' /><br></br>

                    <div className={classes.selectedTeamFooter}>
                      {selectedTeam?.status === '1' && (
                        <Button onClick={() => setTeamStatus('2')} className={classes.setTeamStatus} color='orange' content='Publiser'></Button>
                      )}
                      {selectedTeam?.status === '2' && (
                        <Button onClick={() => setTeamStatus('1')} className={classes.setTeamStatus} color='purple' content='Skjul'></Button>
                      )}
                      <Button className={classes.myTeamsCloseBtn} onClick={() => resetSelectedTeam()} icon content='Lukk' ></Button><br></br>
                    </div>





                  </div>

                )}


              </Card.Content>
            </Card>
          </div>
        )}

        {!teamFormOpen && (
          <Form>
            <Button color='blue' onClick={() => displayTeamForm(true)}>Opprett team</Button>
          </Form>

        )}
        {teamFormOpen && (
          <div>
            {teamIsSelected && (<Header as='h2'>Opprett team</Header>)}
          
          <Card>
            <Card.Content>
              <Form>
                <Form.Field>
                  <span className={classes.membersTitle}>Navn</span>
                  <input onChange={e => setTeamName(e)} placeholder='' />
                </Form.Field>
                <Form.Field>
                  <span className={classes.membersTitle}>Beskrivelse</span>
                  <input onChange={e => setTeamDescription(e)} placeholder='' />
                </Form.Field>
                <Button onClick={() => createTeam()} color='green'>Opprett</Button>
                <Button onClick={() => displayTeamForm(false)} >Avbryt</Button>
              </Form>
            </Card.Content>
          </Card>
          </div>
        )}


      </Grid.Column>
      <Grid.Column>
        <Header as='h2'>Mine team</Header>
        <Card.Group>
          {teams.map((team) => (
            <Card onClick={() => selectTeam(team.id)}>
              <Card.Content>
                <Card.Header >{team.name}</Card.Header>
                <Card.Description>
                </Card.Description>
              </Card.Content>
            </Card>
          ))}

        </Card.Group>
      </Grid.Column>

      {/********** REQUESTS **********/}
      <Grid.Column>
        <Header as='h2'>Forespørsler</Header>
        <Card.Group>
          {teamRequests.map((request) => (
            <Card>
              <Card.Content>
                <Card.Header>{request.firstName} {request.lastName}</Card.Header>
                <Card.Description>
                  {request.firstName} {request.lastName} ønsker å bli med i {request.teamName}.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button onClick={() => accept(request)} basic color='green'>
                    Aksepter
     </Button>
                  <Button onClick={() => deny(request)} basic color='red'>
                    Avslå
     </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
          {teamInvites.map((invite) => (
            <Card>
              <Card.Content>
                <Card.Header>{invite.teamName}</Card.Header>
                <Card.Description>
                  Du har blitt invitert til å bli med i {invite.teamName}.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button onClick={() => accept(invite)} basic color='green'>
                    Aksepter
     </Button>
                  <Button onClick={() => deny(invite)} basic color='red'>
                    Avslå
     </Button>
                </div>
              </Card.Content>
            </Card>
          ))}

        </Card.Group>

      </Grid.Column>

    </div>


  );
};

export default observer(MyTeams);