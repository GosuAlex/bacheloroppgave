import React, { useContext, useEffect, useState } from 'react'
import { RootStoreContext } from 'Stores/rootStore';
import LoadingComponent from 'Components/Loading/LoadingComponent';
import { RouteComponentProps } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import AssignmentHeader from './AssignmentHeader';
import classes from "./Assignment.module.css"
import { observer } from 'mobx-react-lite';
import AssignmentBody from './AssignmentBody';

interface DetailsParams {
  id: string;
}

const Assignment: React.FC<RouteComponentProps<DetailsParams>> = ({match, history}) => {
  const rootStore = useContext(RootStoreContext);
  const {assignment, loadAssignment, deleteAssignment, loadingInitial, loadTeamsOnAssignment, cleanTeamsOnAssignment } = rootStore.assignmentStore;
  const { user } = rootStore.userStore;
  const { teams } = rootStore.teamStore;

  useEffect(() => {
    loadAssignment(match.params.id);
    loadTeamsOnAssignment(match.params.id);
    return () => {
      cleanTeamsOnAssignment();
    }
  }, [loadAssignment, match.params.id, history, loadTeamsOnAssignment])

  if(loadingInitial) return <LoadingComponent content="Laster oppgaven..." />

  if(!assignment) return <h2>Fant ikke oppgaven</h2>

  return (
    <div className={classes.selectedAssignmentContainer}>
    
          <AssignmentHeader assignment={assignment} user={user} deleteAssignment={deleteAssignment} teams={teams} />
          <AssignmentBody assignment={assignment} user={user} />
    
    </div>
  )
}

export default observer(Assignment);