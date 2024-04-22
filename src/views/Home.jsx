import React from "react";
import "./Home.css";
import Navbar from "components/Navbar";

const Home = () => {

return (
    <div>
        <Navbar/>
        <div className="container">
            <a href="/resources" className="box">Browse</a>
            <a href="/resources/4" className="box">example</a>
            <a href="/search" className="box">Search</a>
            <a href="/collections" className="box">Collections</a>
        </div>
    </div>
);};

export default Home;
