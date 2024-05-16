import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "assets/First-logo.png";
import { useState } from 'react';
import DropdownMenu from "./DropdownMenu";


const Navbar = () => {

  //DEV DROPDOWN MENU
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };
  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };


//LOGIN STATE
const [loggedIn, setLoggedIn] = useState(false);

if(localStorage.getItem('auth') !== null && !loggedIn){
  setLoggedIn(true);
}

let session;
if(loggedIn){
  session = 
            <div className="Navbar-loged-in-button">
              <button onClick={() => {
                localStorage.removeItem('auth'); 
                localStorage.removeItem('username');
                setLoggedIn(false)}
              }>Log out</button>
            </div>
} else{
  session = 
              <Link to="/login">
                <button className="Navbar-login-button">Log in</button>
              </Link>;
}

  return (
    <div className="Navbar-outside-container">

      <div className="Navbar-logo">
        <Link to="/" style={{"padding-top":"50px"}}>
          <img src={logo} className="Navbar-logo-image" alt="logo" />
          {/* LOGO */}
        </Link>
      </div>

      <div
          className="Navbar-menu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button Navbar-dropdown-menu>Dropdown Menu</button>
          {/* <DropdownMenu /> */}
          {isDropdownVisible && <DropdownMenu />}
        </div>

      <div className="Navbar-log-in-external-div">
        {session}
      </div>

    </div>
  );
};

export default Navbar;
