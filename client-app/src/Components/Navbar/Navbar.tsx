import React, { useState, useEffect } from "react";
import { Icon, Menu, Responsive, Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import classes from "./Navbar.module.css";

const Navbar = () => {
  const [activeItem, setActiveItem] = useState(null);

  const [matches, setMatches] = useState<any>(window.matchMedia("(min-width: 768px)").matches);
  const [showNavBar, setShowNavBar] = useState(false);

  const handleClickHamburgerIcon = () => {
    setShowNavBar(!showNavBar);
  };

  // useEffect(() => {
  //   console.log("her")
  //   const handler = e => setMatches({matches: e.matches});
  //   window.matchMedia("(min-width: 768px)").addListener(handler);
  //   return () => {
  //     window.matchMedia("(min-width: 768px)").removeListener(handler);
  //   }
  // }, [matches])

  return (
    <>
      <Responsive minWidth={700} style={{
            position: "sticky",
            left: "0",
            top: "0",
            zIndex: "100",
          }}
          >
        <Menu
          className={classes.fullNav}
          icon="labeled"
          floated
          vertical
          fixed="left"
          style={{
            height: "100vh",
            position: "sticky",
            left: "0",
            top: "0",
            zIndex: "100",
          }}
        >
          <Menu.Item name="Utforsk" as={NavLink} exact to="/utforsk" active={activeItem === "Utforsk"}>
            <Icon name="compass outline" />
            Utforsk
          </Menu.Item>

          <Menu.Item name="Innboks" active={activeItem === "Innboks"} as={NavLink} exact to="/innboks">
            <Icon name="envelope outline" />
            Innboks
          </Menu.Item>

          <Menu.Item name="Mine Team" active={activeItem === "Mine Team"} as={NavLink} exact to="/mineteam">
            <Icon name="users" />
            Mine Team
          </Menu.Item>

          <Menu.Item name="Mine Oppdrag" active={activeItem === "Mine Oppdrag"} as={NavLink} exact to="/mineoppdrag">
            <Icon name="suitcase" />
            Mine Oppdrag
          </Menu.Item>

          <Menu.Item name="Min Profil" active={activeItem === "Min Profil"} as={NavLink} exact to="/profil">
            <Icon name="user outline" />
            Meg
          </Menu.Item>
        </Menu>
      </Responsive>
      {showNavBar ? (
        <Responsive maxWidth={699} style={{
          position: "sticky",
          left: "0",
          top: "0",
          zIndex: "100",
          }}
        >
          <Menu
            className={classes.fullNav}
            icon="labeled"
            floated
            vertical
            fixed="left"
            onScreen="false"
            style={{
              height: "100vh",
              position: "sticky",
              left: "0",
              top: "0",
              zIndex: "100",
            }}
          >
            <Icon name="align justify" className={classes.hamburger} onClick={() => handleClickHamburgerIcon()} />
            <Menu.Item style={{marginTop: "25px"}} name="Utforsk" as={NavLink} exact to="/utforsk" active={activeItem === "Utforsk"}>
              <Icon name="compass outline" />
              Utforsk
            </Menu.Item>

            <Menu.Item name="Innboks" active={activeItem === "Innboks"} as={NavLink} exact to="/innboks">
              <Icon name="envelope outline" />
              Innboks
            </Menu.Item>

            <Menu.Item name="Mine Team" active={activeItem === "Mine Team"} as={NavLink} exact to="/mineteam">
              <Icon name="users" />
              Mine Team
            </Menu.Item>

            <Menu.Item name="Mine Oppdrag" active={activeItem === "Mine Oppdrag"} as={NavLink} exact to="/mineoppdrag">
              <Icon name="suitcase" />
              Mine Oppdrag
            </Menu.Item>

            <Menu.Item name="Min Profil" active={activeItem === "Min Profil"} as={NavLink} exact to="/profil">
              <Icon name="user outline" />
              Meg
            </Menu.Item>
          </Menu>
        </Responsive>
      ) : (
        <Responsive maxWidth={699} style={{
          position: "sticky",
          left: "0",
          top: "0",
          zIndex: "100",
        }}>
          <Icon name="align justify" className={classes.hamburger} onClick={() => handleClickHamburgerIcon()} />
        </Responsive>
      )}
    </>
  );
};

export default Navbar;
