import React from "react";
import "./Home.css";

const Home = () => {

return (
    <div>
        {/* <Navbar/> */}
        <div className="Home-container-outside"> 
            <div className="Home-container">
                <a href="/resources" className="box">Navegar</a>
                <a href="/resources/a9223bcf-ee5e-4d92-aa4a-47ed1f25ef80" className="box">Ejemplo</a>
                <a href="/search" className="box">Realizar búsqueda</a>
                <a href="/upload" className="box">Subir recurso nuevo</a>
            </div>
        </div>
    </div>
);};

export default Home;
