// Esta creo que acabará siendo la página /resources/:id/discussion (por lo de los comentarios)
// Hará falta otra (más senzilla creo) para un resource en si, 
//                      que tenga solo el recurso (sea imagen, pdf...) raw 
//                      o
//                      que tenga poquito más que un ImageComponent 
//                          (podria tener mejor un ResourceComponent que decida segun el tipo si es PDFComponent, ImageComponent...)

import React, { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";

import "./SingleResourcePage.css";
import ImageComponent from "components/ImageComponent";
import Navbar from "components/Navbar";

const SingleResourcePage = () => {
    let { id } = useParams();

return (
    <div className="App">
            <div className="tweet-container" style={{"min-height":"100vh"}}>
                <ImageComponent id={id} ></ImageComponent>
            </div>
        </div>
    );
};

export default SingleResourcePage;
