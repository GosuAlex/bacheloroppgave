import React, { useState } from "react";
import { Button, List, Card, Header, Container } from 'semantic-ui-react'
const myStyle = {
    width: 500,
  };
const MyRequests = () => {
    const [activeItem, setActiveItem] = useState(null);



    return (
        <div>

            <Header as='h1'>Forespørsler</Header>
            <List>
                

                    <List.Item>
                        <Card style={myStyle}>
                            <Card.Content>
                                <Card.Header>Oppdragstittel</Card.Header>
                                <Card.Description>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec felis elit, volutpat a vestibulum a, posuere ac est. In ut leo semper, rutrum est nec, porttitor lorem.
                                 </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Container textAlign='right'>
                                    <Button color='green'>Aksepter</Button>
                                    <Button negative>Avslå</Button>
                                </Container>

                            </Card.Content>
                        </Card>
                    </List.Item>

                    <List.Item>
                        <Card style={myStyle}>
                            <Card.Content>
                                <Card.Header>Oppdragstittel</Card.Header>
                                <Card.Description>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec felis elit, volutpat a vestibulum a, posuere ac est. In ut leo semper, rutrum est nec, porttitor lorem.
                                 </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Container textAlign='right'>
                                    <Button color='green'>Aksepter</Button>
                                    <Button negative>Avslå</Button>
                                </Container>

                            </Card.Content>
                        </Card>
                    </List.Item>

                    <List.Item>
                        <Card style={myStyle}>
                            <Card.Content>
                                <Card.Header>Oppdragstittel</Card.Header>
                                <Card.Description>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec felis elit, volutpat a vestibulum a, posuere ac est. In ut leo semper, rutrum est nec, porttitor lorem.
                                 </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Container textAlign='right'>
                                    <Button color='green'>Aksepter</Button>
                                    <Button negative>Avslå</Button>
                                </Container>

                            </Card.Content>
                        </Card>
                    </List.Item>


               
            </List>

        </div>
    );
};

export default MyRequests;