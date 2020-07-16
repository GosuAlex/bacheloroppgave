import React, { useContext, useState, useEffect } from 'react'
import { RootStoreContext } from 'Stores/rootStore';
import { RouteComponentProps } from 'react-router-dom';
import classes from "./Profile.module.css"
import { Segment, Header, Button, Image } from 'semantic-ui-react';
import images from "../../Images/image.png"

interface DetailsParams {
  id: string;
}

const Profile: React.FC<RouteComponentProps<DetailsParams>> = ({match, history}) => {
  const rootStore = useContext(RootStoreContext);
  const { getUserProfile, profile } = rootStore.userStore;
  
  const [thisProfile, setThisProfile] = useState(profile)

  useEffect(() => {
    getUserProfile(match.params.id)
    .then((gotProfile) => setThisProfile(gotProfile));

  }, [getUserProfile, match.params.id, profile])

  return (
    <div className={classes.profileContainer}>
        <div className={classes.profileBox}>
          <Segment className={classes.profileSegment}>
          <Image className={classes.profileImage} src={images} size='small' circular />
          <Header as='h1'>{thisProfile?.firstName} {thisProfile?.lastName}</Header>
          <span className={classes.profileEmail}>{thisProfile?.email}</span>
          
          </Segment>
        </div>
    </div>
  )
}

export default Profile
