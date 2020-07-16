import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import classes from "./MyAssignments.module.css";
import { Grid, Header, Card, Button } from "semantic-ui-react";
import { RootStoreContext } from "Stores/rootStore";
import { Link } from "react-router-dom";
import { history } from "index";

export const MyAssignments = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    myAssignments,
    myAssignmentRequests,
    acceptTeamOnAssignment,
    denyTeamOnAssignment,
    loadIncomingAssignmentRequests,
    incomingAssignmentRequests,
    listAssignmentsOnCompany,
    companyAssignments,
    setSelectedCompanyAssignment,
    assignmentIsSelected,
    mySelectedAssignment,
    setSelectedAssignment,
  } = rootStore.assignmentStore;
  const { user, userCompany, getUserCompany } = rootStore.userStore;

  useEffect(() => {
    console.log("her");
    getUserCompany(user!.id);
    rootStore.assignmentStore.loadMyAssignments();
    rootStore.assignmentStore.loadMyAssignmentRequests();
    loadIncomingAssignmentRequests(userCompany?.id);
    listAssignmentsOnCompany(userCompany?.id);
  }, [rootStore.assignmentStore]);

  return (
    <div className={classes.myAssignmentsGrid}>
      <Grid.Column>
        <Header as="h2">Valgt oppdrag</Header>
        {assignmentIsSelected && (
          <Card>
            <Card.Content>
              <span className={classes.selectedAssignmentTitle}>{mySelectedAssignment?.title}</span>
              <br></br>
              <span className={classes.selectedAssignmentCompanyName}>{mySelectedAssignment?.companyName}</span>
              <br></br>
              <div className={classes.selectedAssignmenDescription}>{mySelectedAssignment?.description}</div>
              <br></br>
            </Card.Content>
          </Card>
        )}

        {user?.role === 2 && userCompany?.id && (
          <Button color="blue" as={Link} to={"/create/oppgave"}>
            Opprett oppdrag
          </Button>
        )}
      </Grid.Column>
      <Grid.Column>
        <Header as="h2">Mine oppdrag</Header>

        {user?.role != 2
          ? myAssignments.map((assignment) => (
              <Card onClick={() => setSelectedAssignment(assignment.id)}>
                <Card.Content>
                  <Card.Header>{assignment.title}</Card.Header>
                </Card.Content>
              </Card>
            ))
          : companyAssignments.map((assignment) => (
              <Card onClick={() => setSelectedCompanyAssignment(assignment.id)}>
                <Card.Content>
                  {console.log(assignment.id)}
                  <Card.Header>{assignment.title}</Card.Header>
                </Card.Content>
              </Card>
            ))}
      </Grid.Column>
      <Grid.Column>
        <Header as="h2">Forespørsler</Header>

        {user?.role != 2
          ? myAssignmentRequests.map((assignment) => (
              <Card onClick={() => setSelectedAssignment(assignment.id)}>
                <Card.Content>
                  <Card.Header>
                    {assignment.title} <div className={classes.myAssignmentStatus2}>Venter</div>
                  </Card.Header>
                </Card.Content>
              </Card>
            ))
          : incomingAssignmentRequests.map((request) => (
              <Card>
                <Card.Content>
                  <Card.Header>{request.teamName}</Card.Header>
                  <Card.Description>{request.teamName} ønsker å bli med i</Card.Description>
                  <Header
                    color="blue"
                    style={{ margin: "10px 0px", cursor: "pointer" }}
                    onClick={() => history.push(`/oppgave/${request.assignmentId}`)}
                  >
                    {request.assignmentTitle}
                  </Header>
                </Card.Content>
                <Card.Content extra>
                  <div className="ui two buttons">
                    <Button basic color="green" onClick={() => acceptTeamOnAssignment(request)}>
                      Aksepter
                    </Button>
                    <Button basic color="red" onClick={() => denyTeamOnAssignment(request)}>
                      Avslå
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
      </Grid.Column>
    </div>
  );
};

export default observer(MyAssignments);
