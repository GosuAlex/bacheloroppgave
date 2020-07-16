import React, { useContext } from "react";
import { Grid, Header, Button, Segment } from "semantic-ui-react";
import { profile } from "console";
import { RootStoreContext } from "Stores/rootStore";
import { observer } from "mobx-react-lite";
import { IAssignment } from "Models/assignments";

const AssignmentBody: React.FC<{ assignment: IAssignment, user: any }> = ({ assignment, user }) => {
  const rootStore = useContext(RootStoreContext);

  const style = {
    paddingBottom: "50px"
  }

  return (
    <div>

          {assignment.companyId === user?.id && (
            <Segment style={style}>
                  <Grid>
                  <Grid.Column width={16}>
            <Button
              floated="right"
              basic
              content={"editMode" ? "Cancel" : "Edit Profile"}
              // onClick={() => setEditMode(!editMode)}
            />
                    </Grid.Column>
      </Grid>
      </Segment>
          )}

</div>   
  );
};

export default observer(AssignmentBody);
