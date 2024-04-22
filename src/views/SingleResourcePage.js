// Esta creo que acabará siendo la página /resources/:id/discussion (por lo de los comentarios)
// Hará falta otra (más senzilla creo) para un resource en si, 
//                      que tenga solo el recurso (sea imagen, pdf...) raw 
//                      o
//                      que tenga poquito más que un ImageComponent 
//                          (podria tener mejor un ResourceComponent que decida segun el tipo si es PDFComponent, ImageComponent...)

import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom";

import "./SingleResourcePage.css";
import ImageComponent from "components/ImageComponent";

const SingleResourcePage = () => {
    let { id } = useParams();

    const [text, setText] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8090/sayhello') 
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setText(data.result);
            })
        .catch((err) => {
            console.log(err.message);
            setText("Failed")
        });
    },[]);

    

return (
    <div className="App">
            <div className="tweet-container">
                    <ImageComponent id={id} ></ImageComponent>
                <div className="API-TEST-TEXT">
                    {text}
                </div>
                <ul className="comment-list">
                    <li>Comment 1</li>
                    <li>Comment 2</li>
                    <li>Comment 3</li>
                </ul>
            </div>
        </div>
    );
};

export default SingleResourcePage;
