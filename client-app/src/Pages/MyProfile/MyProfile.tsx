import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "Stores/rootStore";
import { Button, Segment, Header, Image, Divider, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import LoginForm from "Components/Forms/Login/LoginForm";
import RegisterForm from "Components/Forms/Register/RegisterForm";
import classes from "./MyProfile.module.css"
import images from "../../Images/image.png"
import CompanyForm from "Components/Forms/Company/CompanyForm";

const MyProfile = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user, logout, userCompany, getUserCompany } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

  useEffect(() => {
    getUserCompany(user!.id);

  }, [userCompany])

  return (
    <div className={classes.profileContainer}>
      {isLoggedIn ? (
        <div className={classes.profileBox}>
          <Segment className={classes.profileSegment}>
          <Image className={classes.profileImage} src={images} size='small' circular />
          <Header as='h1'>{user?.firstName} {user?.lastName}</Header>
          <Button className={classes.profileLogoutButton} onClick={logout} >Logg av</Button>
          {user?.role === 2 && !userCompany?.name ?
            <Divider style={{padding: "20px"}}>
              <Button color="blue" onClick={() => openModal(<CompanyForm />)} >Legg til bedrift for brukeren</Button>
            </Divider>
            : (user?.role === 2 && (
              <Divider style={{padding: "20px"}}>
                <Header as="h2" color="teal" >{userCompany?.name}</Header>
                <Segment className={classes.bedriftBox} >
                  {userCompany?.description}
                </Segment>
              </Divider>
              )
            )
          }
          </Segment>
        </div>


      ) : (
          <div>
            <h4>
              Logg inn for å se profil.
          </h4>
            <Button onClick={() => openModal(<LoginForm />)} >Logg inn</Button>
            <Button onClick={() => openModal(<RegisterForm />)} >Registrer</Button>
          </div>
        )}
    </div>
  );
};

export default MyProfile;
