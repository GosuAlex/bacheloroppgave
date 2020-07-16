import React from "react";
import { Segment, Header, Icon, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { history } from "index";

const NotFound = () => {
  return (
    <div style={{marginTop: "0px"}}>
      <div style={{paddingTop: "35vh"}}></div>
      <Segment placeholder>
        <Header icon>
          <Icon name="search" />
          Oops! - Vi fant dessverre ikke denne siden. Kanskje adressen var feil?.
        </Header>
        <Segment.Inline>
          <Button onClick={() => history.goBack()} primary>
            Gå tilbake til forrige side
          </Button>
        </Segment.Inline>
      </Segment>
    </div>
  );
};

export default NotFound;
