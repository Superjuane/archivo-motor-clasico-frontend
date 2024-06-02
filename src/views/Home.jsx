import React from "react";
import "./Home.css";

const Home = () => {

return (
    <div>
        {/* <Navbar/> */}
        <div className="Home-container-outside"> 
            <div className="Home-container">
                <a href="/resources" className="box">Browse</a>
                <a href="/resources/6fafed5e-c64d-42e3-8666-dc6f997f88d1" className="box">example</a>
                <a href="/search" className="box">Search</a>
                <a href="/uploadresource" className="box">Upload</a>
            </div>
        </div>
    </div>
);};

export default Home;
