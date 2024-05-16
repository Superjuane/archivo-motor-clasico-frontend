import {React, useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { fas, far, fal } from '@awesome.me/kit-KIT_CODE/icons'
import './ImageComponent.css';


const ImageComponent = (id) => {

    const [image, setImage] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [creator, setCreator] = useState(null);
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
                    setCreator(data.creator);
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

    let edit = null;
    if(creator === localStorage.getItem('username')){
        console.log("Creator: "+creator);
        edit = (<div className='ImageComponent-edit-div'>
            <a className='ImageComponent-edit-a' href={"/edit/"+id.id} >
            <button className='ImageComponent-edit-button' style={{"font-size":"24px"}}>
                Editar 
            </button>
            </a>
        </div>)
    }


    return (
        <div className='ImageComponent-div'>
            {edit}
            <div className='ImageComponent-image-background'>
                <div className='ImageComponent-image-container'>
                        <img className='ImageComponent-image' src={image} alt="Fetched " />
                </div>
            </div>
            <div className='ImageComponent-text-container-outside'>
                <div className='ImageComponent-text-container-inside'>
                    <h1 className='ImageComponent-h1'>{title}</h1>
                    <p className='ImageComponent-p'>{description}</p>
                    <p className='ImageComponent-p'>Creator: {creator}</p>
                </div>
            </div>    
        </div>
    );
};

export default ImageComponent;