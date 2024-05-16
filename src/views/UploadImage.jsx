//CONVERT TO Base64: https://stackoverflow.com/questions/47176280/how-to-convert-files-to-base64-in-react
//navigate with state? : https://reach.tech/router/api/navigate

import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";
import "./UploadImage.css";

const UploadAndDisplayImage = () => {
const navigate = useNavigate();

const [selectedImage, setSelectedImage] = useState(null);
const [files, setFiles] = useState([]);
const [title, setTitle] = useState(null);
const [description, setDescription] = useState(null);
const [date, setDate] = useState(null);
const [competition, setCompetition] = useState(null);

const [missingTitle, setMissingTitle] = useState(null);
const [missingImage, setMissingImage] = useState(null);

function sendToBackend(){

    const requestOptions = {
        method: 'post',
        headers: { 
            'Content-Type': 'application/json',
            'Allow-Control-Allow-Origin': '*',
            'Authorization': localStorage.getItem('auth')
        },
        body: JSON.stringify({ 
            title: title,
            description: description? description : null,
            date: date? date: null,
            competition: competition? competition : null,
            image: files.image})
    };

    console.log("Submitting: "  + JSON.stringify({ 
        title: title,
        description: description,
        date: date? date: null,
        competition: competition,
        image: files.image})
    )
    fetch('http://localhost:8090/resources', requestOptions)
        .then(response => {
            let data = response.json();
            console.log("Data: "+data)
            if(!response.ok) throw {code: response.status, data: data};
            return data;
        })
        .then((data)=>{
            console.log("Image uploaded successfully")
            navigate("/resources/"+data.id)
        })
        .catch((error) => {
            if(error.code === 400){
                console.log("Bad Request")
                console.log(error.data)
                error.data.then((data) => {
                    console.log(data)
                    if(data.parameters.includes("title")) setMissingTitle(true);
                    if(data.parameters.includes("image")) setMissingImage(true);
                })
            }
            if(error.code === 409){
                console.log("Conflict")
                error.data.then((data) => {
                    navigate("/resources/"+data.id)
                })
            }
            console.error('Error:', error);
        });

}

function getBase64(file) {

    //https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        setFiles({"image":reader.result, "text":file.name});
    };
    reader.onerror = function (error) {
        setFiles('Error: ' + error);
    };
}

let titleErrorPlaceholder = missingTitle ? "missing title !!" : "Title";
let imageErrorPlaceholder = missingImage ? <div style={{"color":"red"}}> IMAGE IS MISSING ! </div> : null;

return (
    <div className="UploadImage-div">
        <h1 className="UploadImage-h1">Upload new image</h1>

        {selectedImage && (
            <div className="UploadImage-div">
                <img
                    className="UploadImage-img"
                    alt="not found"
                    width={"max-content"}
                    src={URL.createObjectURL(selectedImage)}
                />
                <br />
                <button
                    className="UploadImage-button"
                    onClick={() => {
                    setSelectedImage(null);
                    setFiles([null]);
                }}>Remove</button>
            </div>
        )}

        <br />
        <br />

        <input
            className="UploadImage-input"
            type="file"
            name="myImage"
            onChange={(event) => {
                setSelectedImage(event.target.files[0]);
                setFiles([])
                getBase64(event.target.files[0]);
                setMissingImage(false);
            }}
        />
        <br />
        {imageErrorPlaceholder}

        <br />
        <br />
        &nbsp;&nbsp;Title:&nbsp;&nbsp; 
        <input
            className="UploadImage-input"
            type="text"
            name="title"
            placeholder= {titleErrorPlaceholder}
            onChange={(event) => {
                console.log(event.target.value);
                setTitle(event.target.value);
                setMissingTitle(false);
            }}
        />

        <br />
        <br />
        &nbsp;&nbsp;Description:&nbsp;&nbsp;
        <br />
        <textarea
            className="UploadImage-textarea"
            name="description"
            onChange={(event) => {
                console.log(event.target.value);
                setDescription(event.target.value);
            }} 
        /> 

        <br />
        <br />

        
        &nbsp;&nbsp;Date:&nbsp;&nbsp;
        <input
            className="UploadImage-input"
            type="date"
            name="date"
            onChange={(event) => {
                console.log(event.target.value);
                setDate(event.target.value+"T00:00:00Z");
            }}
        />

        <br />
        <br />

        &nbsp;&nbsp;Competition:&nbsp;&nbsp;
        <input
            className="UploadImage-input"
            type="text"
            name="competition"
            onChange={(event) => {
                console.log(event.target.value);
                setCompetition(event.target.value);
            }}
        />

        <br />
        <br />

        {title && <p>{title}</p>}
        {description && <p>{description}</p>}

        <br />

        {files && (
            <div className="UploadImage-div">
                <div className="UploadImage-div">
                    {files.image && <p >{files.image}</p>}
                </div>
                <div className="UploadImage-div">
                    <button onClick={() => sendToBackend()}>Submit</button>
                </div>
            </div>
        )}

    </div>
);};

export default UploadAndDisplayImage;