import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "assets/First-logo.png";
import { useState } from 'react';
import DropdownMenu from "./DropdownMenu";


const Navbar = () => {

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };



if(localStorage.getItem('auth') !== null && !loggedIn){
  setLoggedIn(true);
}

  let session;
  if(setLoggedIn){;
    session = <div>
      {localStorage.getItem('auth')}
      <br></br>
      <button onClick={() => {localStorage.removeItem('auth'); setLoggedIn(false)}}>Log out</button>
    </div>
  } else{
    session = 
    <Link to="/login">
      <button className="login-button">Log in</button>
    </Link>;
  }

  return (
    <div className="navbar-outside-container">

      <div className="logo">
        <Link to="/">
          <img src={logo} className="logo-image" alt="logo" />
          {/* LOGO */}
        </Link>
      </div>

      <div
          className="menu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button>Dropdown Menu</button>
          {/* <DropdownMenu /> */}
          {isDropdownVisible && <DropdownMenu />}
        </div>

        <div className="check-stored-auth">
          {localStorage.getItem('auth')}
        </div>

      <div className="log-in">
        {session}
      </div>

    </div>
  );
};

export default Navbar;
