import React, { useContext, useEffect } from 'react';
import './App.css';
import Navbar from 'Components/Navbar/Navbar';
import agent from "Api/agent";
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import Frontpage from 'Pages/Frontpage/Frontpage';
import MyProfile from 'Pages/MyProfile/MyProfile';
import Search from  "Pages/Search/Search";
import MyTeams from 'Pages/MyTeams/MyTeams';
import MyMessages from 'Pages/MyMessages/MyMessages';
import Assignment from 'Components/Assignment/Assignment';
import NotFound from 'Pages/NotFound/NotFound';
import { RootStoreContext } from 'Stores/rootStore';
import LoadingComponent from 'Components/Loading/LoadingComponent';
import { observer } from 'mobx-react-lite';
import ModalContainer from 'Components/Modals/ModalContainer';
import AssignmentForm from 'Components/Assignment/AssignmentForm';
import Profile from 'Pages/Profile/Profile';
import { MyAssignments } from 'Pages/MyAssignments/MyAssignments';
import classes from '*.module.css';


const App: React.FC<RouteComponentProps> = ({location}) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, appLoaded, token, getUser, isLoggedIn } = rootStore.userStore;

  useEffect(() => {
    if(token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    } 
  }, [getUser, setAppLoaded, token])

  if(!appLoaded) return <LoadingComponent content="Loading site..." />

  return (
    <div className='appContainer'>
    <ModalContainer />
    {(isLoggedIn && 
      <Navbar />
      )}
    
      <Switch>
        <Route exact path="/" component={Frontpage} />
        <Route exact path="/profil" component={MyProfile} />
        <Route path="/profil/:id" component={Profile} />
        <Route exact path="/mineteam" component={MyTeams} />
        <Route exact path="/mineoppdrag" component={MyAssignments} />
        <Route exact path="/innboks" component={MyMessages} />
        <Route exact path="/utforsk" component={Search} />
        <Route path="/oppgave/:id" component={Assignment} />
        <Route key={location.key} path={["/create/oppgave", "/edit/oppgave/:id"]} component={AssignmentForm} />
        <Route component={NotFound} />
      </Switch>
    </div> 
  );
}

export default withRouter(observer(App));
