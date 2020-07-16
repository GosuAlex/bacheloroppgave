import React, { useContext } from "react";
import { RootStoreContext } from "Stores/rootStore";
import { Button, Message } from "semantic-ui-react";

interface PropsDetails {
  text: string;
  type: "Error" | "Info";
}

const SimpleInfoModal: React.FC<PropsDetails> = ({ text, type }) => {
  const rootStore = useContext(RootStoreContext);
  const { closeModal } = rootStore.modalStore;

  return (
    <>
      {type === "Error" && <Message negative icon="stop circle outline" header={type} content={text} />}
      {type === "Info" && <Message color="blue" icon="question circle outline" header={type} content={text} />}
      <Button onClick={() => closeModal()} color="blue" content="Ok" />
    </>
  );
};

export default SimpleInfoModal;
