import React, { useContext, useState, useEffect } from 'react'
import { Segment, Image, Item, Button, Header, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from 'Stores/rootStore';
import { IAssignment } from 'Models/assignments';
import { ITeam } from 'Models/teams';
import DropdownTeams from 'Components/Dropdown/DropdownTeams';
import { observer } from 'mobx-react-lite';
import LoadingComponent from 'Components/Loading/LoadingComponent';
import SimpleInfoModal from 'Components/Modals/SimpleInfoModal';
import { format } from 'date-fns';
import {nb} from 'date-fns/esm/locale'
import { history } from 'index';
import classes from "./Assignment.module.css";


interface AssignmentHeaderProps {
  assignment: IAssignment;
  user: any;
  deleteAssignment(id: string): void;
  teams: ITeam[];
}

const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({assignment, user, deleteAssignment, teams}) => {

  useEffect(() => {
    rootStore.teamStore.loadTeams();
  });

  const rootStore = useContext(RootStoreContext);
  const { joinAssignment, leaveAssignment, submitting, getAssignmentTeams } = rootStore.assignmentStore;
  const { openModal} = rootStore.modalStore;

  const [pickedTeam, setPickedTeam] = useState<string>();
  const [alreadyOnAssignment, setAlreadyOnAssignment] = useState("")

  const handleSubmitPickedTeam = () => {
    if(!pickedTeam) {
      openModal(<SimpleInfoModal text={"Du må velge et team til å melde på oppgaven"} type={"Error"} />)
    } else {
      joinAssignment(pickedTeam, assignment.id)
      setAlreadyOnAssignment(pickedTeam)
    }
  }

  const handleLeaveAssignment = () => {
    leaveAssignment(alreadyOnAssignment, assignment.id)
    setAlreadyOnAssignment("")
  }

  useEffect(() => {
    teams.forEach(team => {
      if(getAssignmentTeams.includes(team.id)) {
        setAlreadyOnAssignment(team.id);
      }
    })
  }, [teams, getAssignmentTeams, alreadyOnAssignment])

  return (
    <div className={classes.assignmentHeaderContainer}>
    <Button onClick={() => history.goBack() } style={{marginLeft: "5px"}} >
      Tilbake
    </Button>
    <Segment>
    
        
      
              {/* <Item.Image avatar size='small' src={"assignment.creator.image" || '/assets/user.png'} /> */}
 
                <Header as='h1'>{assignment.title} </Header>{assignment.status === "Åpen Oppgave"
            ? <span className={classes.assignmentStatusOpen}>{assignment.status}</span>
            : <span className={classes.assignmentStatusClosed}>{assignment.status}</span>
          } 
             
        
  
        <Grid.Column width={6}>
          <Header as="h3">{assignment.companyName} </Header>
        <p>{assignment.description}</p>

          {assignment.creator.id === user.id ? (
          <div>
            <Button
              as={Link}
              to={`/edit/oppgave/${assignment.id}`}
              color='orange'
              floated='right'
            >
              Rediger oppgaven
            </Button>
            <Button color="red" floated="right" onClick={() => deleteAssignment(assignment.id)}>
              Slett oppgaven
            </Button>
          </div>
        ) : alreadyOnAssignment ? (
          <Button loading={submitting} onClick={() => handleLeaveAssignment()}  >
            Forlat
          </Button>
        ) : (
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Button loading={submitting} onClick={() => handleSubmitPickedTeam()} color='green' >
                  Bli med
                </Button>
              </Grid.Column>
              <Grid.Column>
                <DropdownTeams teams={teams} setPickedTeam={setPickedTeam} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
        </Grid.Column>
     
                <span>Publisert: {format(new Date(assignment.timePosted), "EEEE do MMMM - HH:mm", {locale: nb})}</span><br></br>
          <span>Frist: {format(new Date(assignment.deadline), "EEEE do MMMM - HH:mm", {locale: nb})}</span>
    </Segment>
    </div>
  );
}

export default observer(AssignmentHeader)
