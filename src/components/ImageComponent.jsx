import {React, useState, useEffect } from 'react';
import './ImageComponent.css';


const ImageComponent = (id) => {

    const [image, setImage] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function openNewWindow(){
        // window.open(image, 
        //     "windowName", 
        //     'width=800, height=600'); 
        //     return false;
        // window.open(image, '_blank', "noreferrer");
    }

    useEffect(() => {
            fetch("http://localhost:8090/resources/"+(id.id),{
                headers: {
                    'Accept': 'application/json',
                },
            })
                .then((response)=>
                    response.json())
                .then((data)=>{
                    console.log("hey!");
                    console.log(data);
                    console.log("data.imageUrl");
                    if (data.type ==="StringBase64")
                        console.log("image is base64")
                        setImage('data:image/jpeg;base64,'+data.image);
                    if (data.type ==="URL")
                        setImage(data.imageUrl);
                    setTitle(data.title);
                    setDescription(data.description);
            }).catch((err)=>{
                console.log(err.message);
                setError("Error!")}).finally(()=>{setLoading(false)});
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error!: {error}</p>;
    }

    return (
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
            {/* <a href={image} /*onclick = {openNewWindow()}>
                <img style={myStyles} src={image} alt="Fetched " />
             </a> */}
            <div className='image-container'>
                <img className='image' src={image} alt="Fetched " />
            </div> 
        </div>
    );
};

export default ImageComponent;