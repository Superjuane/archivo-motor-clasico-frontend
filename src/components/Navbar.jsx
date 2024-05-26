import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "assets/First-logo.png";
import { useState } from 'react';
import DropdownMenu from "./DropdownMenu";


const Navbar = () => {
  const navigate = useNavigate();

  //DEV DROPDOWN MENU
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };
  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  //USERDROPDOWNMENU
  const [isUserDropdownVisible, setUserDropdownVisible] = useState(false);
  const handleUserMouseEnter = () => {
    setUserDropdownVisible(true);
  };
  const handleUserMouseLeave = () => {
    const timer = setTimeout(() => {setUserDropdownVisible(false);}, 2000);
  }


//LOGIN STATE
const [loggedIn, setLoggedIn] = useState(false);

if(localStorage.getItem('auth') !== null && !loggedIn){
  setLoggedIn(true);
}

let session;
if(loggedIn){
  session = 
    <div className="Navbar-loged-in-container">
      <div className="Navbar-loged-in-user"
        onClick={handleUserMouseEnter}
        onMouseLeave={handleUserMouseLeave}
      >
        <div className='Navbar-loged-in-user-image'>
          <img 
            className='' 
            src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' 
            alt='User profile'>
          </img>
        </div>
      </div>

      {isUserDropdownVisible && <div className="Navbar-loged-in-dropdown">
        <div className="Navbar-loged-in-dropdown-button-div" >
          <button className="Navbar-loged-in-dropdown-button" onClick={() => navigate("/profile")}>
            Profile
          </button>
        </div>
        <div className="Navbar-loged-in-button">
          <button className="Navbar-loged-in-dropdown-button" onClick={() => {
            localStorage.removeItem('auth'); 
            localStorage.removeItem('username');
            setLoggedIn(false)
            navigate("/resources")
          }}>
            Log out
          </button>
        </div>
      </div>}
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
        <Link to="/" style={{"paddingTop":"50px"}}>
          <img src={logo} className="Navbar-logo-image" alt="logo" />
          {/* LOGO */}
        </Link>
      </div>

      <div
        className="Navbar-menu"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className="Navbar-dropdown-menu">Dropdown Menu</button>
          {isDropdownVisible && <DropdownMenu />}
      </div>
      <div className="Navbar-log-in-external-div">
        {session}
      </div>

    </div>
  );
};

export default Navbar;
