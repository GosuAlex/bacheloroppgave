import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Item,
  Segment,
  Container,
  Card,
  Button,
  Divider,
  Icon,
  Input,
  Dropdown,
  Label,
  Tab,
  GridColumn,
} from "semantic-ui-react";

import classes from "./Search.module.css";
import images from "../../Images/image.png";
import { RootStoreContext } from "Stores/rootStore";
import LoadingComponent from "Components/Loading/LoadingComponent";
import SearchListAssignments from "./SearchListAssignments";
import { observer } from "mobx-react-lite";
import SearchListTeams from "./SearchListTeams";
import { Link } from "react-router-dom";
import SelectInput from "Components/Forms/FormElements/SelectInput";
import { category } from "Components/Forms/FormElements/categoryOptions";
import { Field } from "react-final-form";
import DropdownCategory from "Components/Dropdown/DropdownCategory";
import { IAssignment } from "Models/assignments";
import { format } from "date-fns";
import { nb } from "date-fns/esm/locale";
import { ITeam } from "Models/teams";

const Search = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadAssignments,
    loadingInitial,
    loadAssignmentsCategory,
    assignments,
    clearAssignments,
  } = rootStore.assignmentStore;
  const {
    loadTeams,
    publicTeams,
    teamRequestsPending,
    listTeamRequestsPending,
    loadPublicTeams,
    join,
  } = rootStore.teamStore;

  const [switchTab, setswitchTab] = useState("Oppdrag");
  const [pickedCategory, setPickedCategory] = useState<string | undefined>("");

  const handleJoinTeam = (teamid: string) => {
    join(teamid);
  };

  useEffect(() => {
    if (pickedCategory) {
      loadAssignmentsCategory(pickedCategory);
    } else {
      loadAssignments();
    }
    loadPublicTeams();
    listTeamRequestsPending();
    return () => {
      // clearAssignments();
    };
  }, [loadAssignmentsCategory, switchTab, loadTeams, pickedCategory]);

  const panes = [
    {
      menuItem: "Teams",
      render: () => (
        <Tab.Pane>
          {publicTeams.map((team: ITeam) => (
            <Segment clearing key={team.id} className={classes.item}>
              <Item.Content>
                <Item.Header className={classes.header}>
                  {" "}
                  {team.name}
                </Item.Header>
                <Item.Description style={{ padding: "10px 0px" }}>
                  {team.description.substring(0, 500)} ...
                </Item.Description>
                <Item.Extra>
                  <Image
                    className={classes.iconProfileImage}
                    src={images}
                    circular
                  />

                  {teamRequestsPending.find((tm) => tm.teamId === team.id)
                    ?.status == "3" ? (
                    <Button
                      onClick={() => console.log("klikked på venter på svar")}
                      disabled={true}
                      color="grey"
                      floated="right"
                    >
                      Venter på svar
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleJoinTeam(team.id)}
                      color="green"
                      floated="right"
                    >
                      Bli med
                    </Button>
                  )}
                </Item.Extra>
              </Item.Content>
            </Segment>
          ))}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Oppdrag",
      render: () => (
        <Tab.Pane>
          <Card>
            <Card.Content>
              <Card.Header style={{ marginBottom: "10px" }}>
                Kategori{" "}
              </Card.Header>
              {/* <Field name="category" placeholder="Kategori" value="category" component={SelectInput} options={category} /> */}
              <DropdownCategory
                categories={category}
                setPickedCategory={setPickedCategory}
              />
            </Card.Content>
          </Card>

          {assignments.map((assignment: IAssignment) => (
            <Segment clearing key={assignment.id}>
              <Item.Content>
                <Item.Header>
                  {" "}
                  {assignment.title}
                  <Label className={classes.categoryIcon}>
                    {assignment.categoryName}
                  </Label>
                </Item.Header>
                <Item.Description style={{ padding: "10px 0px" }}>
                  {assignment.description.substring(0, 500)} ...
                </Item.Description>
                <Item.Extra>
                  <Image
                    className={classes.iconProfileImage}
                    src={images}
                    circular
                  />
                  <Button
                    color="blue"
                    as={Link}
                    to={`/oppgave/${assignment.id}`}
                    floated="right"
                  >
                    Bli med
                  </Button>
                </Item.Extra>
              </Item.Content>
            </Segment>
          ))}
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div className={classes.searchGrid}>
      <GridColumn>
        <Segment clearing>
          <Tab panes={panes} />
          {/*   {loadingInitial ? ( // NEED PROPER LOADING, THIS IS ONLY FOR FIRsT TIME OPEN PAGE
                
              )} 
               */}
        </Segment>
      </GridColumn>
    </div>
  );
};

export default observer(Search);
