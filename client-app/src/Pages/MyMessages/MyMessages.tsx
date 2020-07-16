import React, { useState, useContext, useEffect } from "react";
import classes from "./MyMessages.module.css";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "Stores/rootStore";
import {
  Item,
  Button,
  Segment,
  GridColumn,
  Form,
  Header,
  Tab,
  Divider,
  Dropdown,
  Card,
} from "semantic-ui-react";
import { runInAction } from "mobx";

const MyMessages = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    inbox,
    outbox,
    deleteMessage,
    deleteSentMessage,
    selectedMessage,
    selectInboxMessage,
    selectOutboxMessage,
    loadMessage,
    messages,
    newMessage,
    createMessage,
    //recipients,
  } = rootStore.messageStore;
  const [newMessageMode, setNewMessageMode] = useState(false);
  const [viewMessageMode, setViewMessageMode] = useState(false);
  const [viewSentMessageMode, setSentViewMessageMode] = useState(false);

  useEffect(() => {
    rootStore.messageStore.loadInbox();
    rootStore.messageStore.loadOutbox();
    //rootStore.messageStore.listRecipients();
  }, [rootStore.messageStore]);

  const panes = [
    {
      menuItem: "Innboks",
      render: () => (
        <Tab.Pane>
          {inbox.map((message) => (
            <Card
              fluid
              classname={classes.messageItemBox}
              onClick={() => {
                selectInboxMessage(message.id);
                setViewMessageMode(true);
                setSentViewMessageMode(false);
                setNewMessageMode(false);
              }}
            >
              <div className={classes.messageItemPadding}>
                <span className={classes.messageTitle}>{message?.title}</span>
                <span className={classes.messageDate}>{message?.date}</span>
                <br></br>
                <span className={classes.messageName}>
                  Fra {message?.firstName} {message?.lastName}
                </span>
              </div>
            </Card>
          ))}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Utboks",
      render: () => (
        <Tab.Pane>
          {outbox.map((message) => (
            <Card
              fluid
              classname={classes.messageItemBox}
              onClick={() => {
                selectOutboxMessage(message.id);
                setViewMessageMode(false);
                setSentViewMessageMode(true);
                setNewMessageMode(false);
              }}
            >
              <div className={classes.messageItemPadding}>
                <span className={classes.messageTitle}>{message?.title}</span>
                <span className={classes.messageDate}>{message?.date}</span>
                <br></br>
                <span className={classes.messageName}>
                  Til {message?.firstName} {message?.lastName}
                </span>
              </div>
            </Card>
          ))}
        </Tab.Pane>
      ),
    },
  ];

  const setTitle = (evt) => {
    runInAction("setting message title", () => {
      newMessage.title = evt.target.value;
      console.log(newMessage.title);
    });
  };

  const setReceiver = (evt) => {
    runInAction("setting receiver", () => {
      newMessage.email = evt.target.value;
      console.log(newMessage.email);
    });
  };

  const setContent = (evt) => {
    runInAction("setting message content", () => {
      newMessage.content = evt.target.value;
      console.log(newMessage.content);
    });
  };

  useEffect(() => {
    rootStore.messageStore.loadInbox();
  }, [rootStore.messageStore]);

  return (
    <div className={classes.myMessagesGrid}>
      <GridColumn>
        <Segment clearing>
          <Tab panes={panes} />
          <Divider hidden />
          <Button
            floated="left"
            content="Ny melding"
            color="blue"
            onClick={() => {
              setNewMessageMode(true);
              setViewMessageMode(false);
              setSentViewMessageMode(false);
            }}
          />
        </Segment>
      </GridColumn>
      <GridColumn>
        {viewMessageMode && (
          <Segment clearing>
            <Item>
              <Item.Content>
                <Item.Header as="h1">{selectedMessage?.title}</Item.Header>
                <Header as="h3">
                  <Header.Content>
                    Fra {selectedMessage?.firstName}{" "}
                    {selectedMessage?.lastName}
                    <Header.Subheader>{selectedMessage?.date}</Header.Subheader>
                  </Header.Content>
                </Header>
                <Item.Description>
                  {selectedMessage?.content}
                  <br />
                  <br />
                  <br />
                </Item.Description>
              </Item.Content>
              <Button
                floated="right"
                negative
                onClick={() => {
                  deleteMessage();
                  setViewMessageMode(false);
                }}
                content="Slett"
              />
              <Button
                floated="right"
                content="Lukk"
                onClick={() => setViewMessageMode(false)}
              />
            </Item>
          </Segment>
        )}
        {viewSentMessageMode && (
          <Segment clearing>
            <Item>
              <Item.Content>
                <Item.Header as="h1">{selectedMessage?.title}</Item.Header>
                <Header as="h3">
                  <Header.Content>
                    Til {selectedMessage?.firstName}{" "}
                    {selectedMessage?.lastName}
                    <Header.Subheader>{selectedMessage?.date}</Header.Subheader>
                  </Header.Content>
                </Header>
                <Item.Description>
                  {selectedMessage?.content}
                  <br />
                  <br />
                  <br />
                </Item.Description>
              </Item.Content>
              <Button
                floated="right"
                negative
                onClick={() => {
                  deleteSentMessage();
                  setSentViewMessageMode(false);
                }}
                content="Slett melding"
              />
              <Button
                floated="right"
                content="Lukk"
                onClick={() => setSentViewMessageMode(false)}
              />
            </Item>
          </Segment>
        )}
        {newMessageMode && (
          <Segment clearing>
            <Form fluid>
              <Form.Input onChange={(e) => setTitle(e)} placeholder="Tittel" />
              <Form.Input
                onChange={(e) => setReceiver(e)}
                placeholder="Mottakers email"
              />
              <Form.TextArea
                onChange={(e) => setContent(e)}
                placeholder="Melding"
              />
              <Button.Group widths={2}>
                <Button
                  content="Avbryt"
                  onClick={() => setNewMessageMode(false)}
                />
                <Button
                  positive
                  content="Send melding"
                  onClick={() => {
                    createMessage();
                    setNewMessageMode(false);
                  }}
                />
              </Button.Group>
            </Form>
          </Segment>
        )}
      </GridColumn>
    </div>
  );
};

export default observer(MyMessages);
