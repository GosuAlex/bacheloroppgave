import React, { useContext } from "react";
import { RootStoreContext } from "Stores/rootStore";
import { Button, Icon, Item, Label, Header } from "semantic-ui-react";
import { IAssignment } from "Models/assignments";
import { Link } from "react-router-dom";
import classes from "./Search.module.css";
import { format } from 'date-fns';
import {nb} from 'date-fns/esm/locale'

const SearchListAssignments = () => {
  const rootStore = useContext(RootStoreContext);
  const { assignments } = rootStore.assignmentStore;

  return (
    <>
      {assignments.map((assignment: IAssignment) => (
        <Item key={assignment.id} className={classes.item}>
          <Item.Content>
            <Item.Header as={Link} to={`/oppgave/${assignment.id}`} className={classes.header} >{assignment.title}</Item.Header>
            <Item.Meta>
              <span>Frist: </span>
              <span>{format(new Date(assignment.deadline), "EEEE do MMMM - HH:mm", {locale: nb})}</span>
            </Item.Meta>
            <Item.Description style={{padding: "10px 0px"}}>{assignment.description.substring(0, 500)} ...</Item.Description>
            <Item.Extra>
              <Button primary as={Link} to={`/oppgave/${assignment.id}`} floated="right">
                Bli med
                <span>&nbsp;&nbsp;</span>
               
              </Button>
              <Label>{assignment.categoryName}</Label>
            </Item.Extra>
          </Item.Content>
        </Item>
      ))}
    </>
  );
};

export default SearchListAssignments;
