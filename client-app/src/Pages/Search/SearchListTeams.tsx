import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "Stores/rootStore";
import { Button, Icon, Item, Label, Header } from "semantic-ui-react";
import { IAssignment } from "Models/assignments";
import { Link } from "react-router-dom";
import classes from "./Search.module.css";
import { ITeam } from "Models/teams";
import { runInAction } from "mobx";

const SearchListTeams = () => {
  const rootStore = useContext(RootStoreContext);
  const { publicTeams, join } = rootStore.teamStore;

  useEffect(() => {
    rootStore.teamStore.loadPublicTeams();
  }, [rootStore.teamStore]);

  return (
    <>
      {publicTeams.map((team: ITeam) => (
        <Item key={team.id} className={classes.item}>
          <Item.Content>
            <Item.Header as={Link} to={`/oppgave/${team.id}`} className={classes.header} >{team.name}</Item.Header>
            <Item.Meta>
              <span>{team.teammembers}</span>
            </Item.Meta>
            <Item.Description style={{padding: "10px 0px"}}>{team.description.substring(0, 500)} ...</Item.Description>
            <Item.Extra>
              <Button onClick={() => join(team.id) } color='green' to={`/team/${team.id}`} floated='right'>
                Bli med
              </Button>
         
            </Item.Extra>
          </Item.Content>
        </Item>
      ))}
    </>
  );
};

export default SearchListTeams;
