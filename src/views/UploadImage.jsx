//CONVERT TO Base64: https://stackoverflow.com/questions/47176280/how-to-convert-files-to-base64-in-react
//navigate with state? : https://reach.tech/router/api/navigate

import React, { useState } from "react";
import FileBase64 from 'react-file-base64';
import { useNavigate  } from "react-router-dom";
import "./UploadImage.css";

const UploadAndDisplayImage = () => {
const navigate = useNavigate();

const [selectedImage, setSelectedImage] = useState(null);
const [files, setFiles] = useState([]);
const [title, setTitle] = useState(null);
const [description, setDescription] = useState(null);
const [user, setUser] = useState(null);
const [date, setDate] = useState(null);
const [competition, setCompetition] = useState(null);

const [result, setResult] = useState(null);
const [missingTitle, setMissingTitle] = useState(null);
const [missingCreator, setMissingCreator] = useState(null);
const [missingImage, setMissingImage] = useState(null);

function sendToBackend(){
    // console.log(JSON.stringify({ 
    //             title: title,
    //             image: files.image.split(',')[1],
    //             description: description,
    //             creator: user
    
    //         }));
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Allow-Control-Allow-Origin': '*',
            'Authorization': localStorage.getItem('auth')
        },
        body: JSON.stringify({ 
            title: title,
            image: files.image,
            description: description,
            creator: user,
            date: date,
            competition: competition

        })
    };
    fetch('http://localhost:8090/resources', requestOptions)
        .then(response => {
            let data = response.json();
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
                error.data.then((data) => {
                    if(data.parameters.includes("title")) setMissingTitle(true);
                    if(data.parameters.includes("creator")) setMissingCreator(true);
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
let creatorErrorPlaceholder = missingCreator ? "missing creator !!" : "Creator";

return (
    <div>
        <h1>Upload and Display Image usign React Hook's</h1>

        {selectedImage && (
            <div>
                <img
                    alt="not found"
                    width={"max-content"}
                    src={URL.createObjectURL(selectedImage)}
                />
                <br />
                <button onClick={() => {
                    setSelectedImage(null);
                    setFiles([null]);
                }}>Remove</button>
            </div>
        )}

        <br />
        <br />

        <input
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
            name="description"
            onChange={(event) => {
                console.log(event.target.value);
                setDescription(event.target.value);
            }} 
        /> 

        <br />
        <br />

        &nbsp;&nbsp;User:&nbsp;&nbsp; 
        <input
            type="text"
            name="user"
            placeholder={creatorErrorPlaceholder}
            onChange={(event) => {
                console.log(event.target.value);
                setUser(event.target.value);
                setMissingCreator(false);
            }}
        />

        <br />
        <br />

        &nbsp;&nbsp;Date:&nbsp;&nbsp;
        <input
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
        {user && <p>{user}</p>}

        <br />

        {files && (
            <div>
                <div>
                    {files.image && <p >{files.image}</p>}
                </div>
                <div>
                    <button onClick={() => sendToBackend()}>Submit</button>
                </div>
            </div>
        )}

    </div>
);};

export default UploadAndDisplayImage;