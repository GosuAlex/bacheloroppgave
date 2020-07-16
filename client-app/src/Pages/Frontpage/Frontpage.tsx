import React, { useContext } from 'react'
import classes from './Frontpage.module.css'
import CookieConsent from "react-cookie-consent";
import blobTop from 'Assets/SVG/Vector 9.svg';
import blobBottom from 'Assets/SVG/Vector 7.svg';
import blobRightBig from 'Assets/SVG/Vector 6.svg';
import blobRightSmall from 'Assets/SVG/Vector 8.svg';
import people from 'Assets/SVG/people.svg';
import peoplePicker from 'Assets/SVG/peoplePicker.svg';
import { RootStoreContext } from 'Stores/rootStore';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import LoginForm from 'Components/Forms/Login/LoginForm';
import RegisterForm from 'Components/Forms/Register/RegisterForm';

const Frontpage = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

  return (
    <div>
      <section className={classes.sectionOne}>
        <div className={classes.left}>
          <div className={classes.top}>
            <img src={blobTop} alt="background art" className={[classes.svg, classes.topBlob].join(" ")} />
          </div>
          <div className={classes.topContent}>
            <h1 className={classes.headline}>Daedalus</h1>
            {isLoggedIn && user ? (
              <>
                <h4 className={classes.headlineSub}>Velkommen tilbake, {user.firstName}!<br/></h4>
              </>
            ) : (
              <>
                <h4 className={classes.headlineSub}>Daedalus er en plattform<br/> hvor studenter og bedrifter møtes.</h4>
                <CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>
                <Button onClick={() => openModal(<LoginForm />)} className={[classes.btn, classes.btnPrimary].join(" ")}>Logg inn</Button>
                <Button onClick={() => openModal(<RegisterForm />)} className={[classes.btn, classes.btnSecondary].join(" ")}>Registrer</Button>
              </>
            )}

          </div>
          <div className={classes.bottom}>
            <img src={blobBottom} alt="background art" className={[classes.svg, classes.bottomBlob].join(" ")} />
            
                            {/*
                
                
                
                            <div className={classes.bottomContent}>

              <div className={classes.card}>
                <div className={classes.cardTop}>
                  <img className={classes.img} src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="" />
                </div>


                <div className={classes.cardContent}>
                  <h2 className={classes.cardHeader}>Header</h2>
                  <h3 className={classes.cardHeaderSub}>Name name</h3>
                  <p className={classes.cardText}>This is how it work dude. Take a look at ma site. Will you runa marar together to the moon person how to get? Yes yes yes..Yup...</p>
                </div>
              </div>
              <div className={classes.card}>
                <div className={classes.cardTop}>
                  <img className={classes.img} src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80" alt="" />
                </div>
                <div className={classes.cardContent}>
                  <h2 className={classes.cardHeader}>Header</h2>
                  <h3 className={classes.cardHeaderSub}>Name name</h3>
                  <p className={classes.cardText}>This is how it work dude. Take a look at ma site. Will you runa marar together to the moon person how to get? Yes yes yes..Yup...</p>
                </div>
              </div>

            </div>
                
                
                
                
                
                */}
            

          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.rightContent}>
            <img src={people} alt="background art" className={classes.svg} />
            <img src={peoplePicker} alt="background art" className={classes.svg} />
            <img src={blobRightBig} alt="background art" className={[classes.svg, classes.rightBlobBig].join(" ")} />
            <img src={blobRightSmall} alt="background art" className={[classes.svg, classes.rightBlobSmall].join(" ")} />
            <div className={classes.rightText}>
            </div>
          </div>
        </div>
        <div className={classes.test}></div>
      </section>

 
    </div>
  )
}

export default Frontpage
