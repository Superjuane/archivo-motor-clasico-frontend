import React, { useState, useEffect } from 'react';
import './CollectionPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleMinus, faFloppyDisk, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'


const CollectionPage = () => {
    const URL = 'http://localhost:8090';
    const { id } = useParams();
    const navigate = useNavigate();
    let username = localStorage.getItem('username');


const [collection, setCollection] = useState();
const [collectionTitle, setCollectionTitle] = useState();
const [resources, setResources] = useState([]);

const [isDeleteModeOn, setIsDeleteModeOn] = useState(false);
const [isEditTitleModeOn, setIsEditTitleModeOn] = useState(false);
const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

useEffect(() => {
    console.log('Fetching collection with id: ', id);
    fetch(URL+'/collections/'+id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        setCollectionTitle(data.title);
        setCollection(data);
    })
    .catch(error => console.error('Error fetching user data:', error));
}, [id]);

useEffect(() => {
    if(collection){
        setResources([]);
        collection.resourcesIds.forEach( resourceId => {
            fetch(URL+'/resources/'+resourceId, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data.type === 'StringBase64'){
                    data.image = 'data:image/png;base64,'+data.image;
                }
                setResources(resources => [...resources, data]);
            })
            .catch(error => console.error('Error fetching user data:', error));
        });
    }
    
}, [collection]);

const getDeleteButtonClassName = () => {
    let className = 'CollectionPage-edit-button';
    if(isDeleteModeOn) className += ' CollectionPage-edit-button-active';
    return className;
};

const handleDeleteResource = (resourceId) => {
    fetch(URL+'/collections/'+id+'/resources/'+resourceId, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Allow-Control-Allow-Origin': '*',
            'Authorization': localStorage.getItem('auth') 
            
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        setResources(resources.filter(resource => resource.id !== resourceId));
    })
    .catch(error => console.error('Error fetching user data:', error));
};

const handleDeleteConfirmation = (confirmation) => {
    console.log("Deleting collection with id: ", id, " Confirmation: ", confirmation)
    if(confirmation){
        fetch(URL+'/collections/'+id, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('auth') 
            }
        })
        .then((response)=>{
            if(!response.ok) throw{code: response.status, message: response.statusText}
            console.log("collection deleted");
            navigate('/profile');
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
    setIsDeletePopupOpen(false);
};

//RENDER
if(!collection) return (
    <div className='CollectionPage-outiside-div'>
        <p>Cargando colección...</p>    
    </div>
);
if(!resources) return (
    <div className='CollectionPage-outiside-div'>
        <div className='CollectionPage-header-div'>
            <h1>{collection.title}</h1> 
        </div>
    </div>
);

return (
    <div>
        <div className='CollectionPage-outiside-div'>
            <div className='CollectionPage-header-div'>
                <div className='CollectionPage-header-div-second'>
                    {!isEditTitleModeOn || username === null || collection.creator !== username ? 
                        <div className='CollectionPage-nonexistent-div'></div>
                        :
                        <button onClick={()=>setIsDeletePopupOpen(true)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    }
                    {!isEditTitleModeOn || username === null || collection.creator !== username ? 
                        <h1>{collectionTitle}</h1>
                        :
                        <input 
                            type='text' 
                            value={collectionTitle} 
                            onChange={(e)=>setCollectionTitle(e.target.value)} 
                            maxLength={50}
                            className='CollectionPage-header-title-input' />
                    }
                    {username !== null && collection.creator === username &&
                        (!isEditTitleModeOn ?
                            <button onClick={()=>setIsEditTitleModeOn(!isEditTitleModeOn)}>
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                        :
                            <button onClick={()=>{
                                            setIsEditTitleModeOn(!isEditTitleModeOn);
                                                fetch(URL+'/collections/'+id, {
                                                    method: 'PUT',
                                                    headers: { 
                                                        'Content-Type': 'application/json',
                                                        'Allow-Control-Allow-Origin': '*',
                                                        'Authorization': localStorage.getItem('auth') 
                                                    },
                                                    body: JSON.stringify({newTitle: collectionTitle})
                                                })
                                                .then(response => response.json())
                                                .then(data => {
                                                    console.log(data);
                                                    setCollectionTitle(data.title);
                                                    setIsEditTitleModeOn(false);
                                                })
                                                .catch(error => console.error('Error fetching user data:', error));
                                                }}>
                                <FontAwesomeIcon icon={faFloppyDisk} />
                            </button>
                        )               
                    }
                </div>
                {username !== null && collection.creator === username && (<button onClick={()=>{setIsDeleteModeOn(!isDeleteModeOn)}} className={getDeleteButtonClassName()}> Borrar elementos </button>)}
            </div>
            <div className='CollectionPage-creator-div'>Creado por: <a className='CollectionPage-creator-div' href={'/user/'+collection.creator}>{collection.creator}</a></div>
            
            <div className='CollectionPage-Resources-outside-div'>
                {resources.map(resource => (                    
                        <div className='CollectionPage-Resources-element' key={resource.id}>
                            {isDeleteModeOn && 
                                <button onClick={()=>handleDeleteResource(resource.id)} className='CollectionPage-Resource-delete-button'> 
                                    <FontAwesomeIcon icon={faCircleMinus} />
                                </button>
                            }
                            <a className='CollectionPage-Resource-link' href={"/resources/"+resource.id}>
                            <h3>{resource.title}</h3>
                            <img className='CollectionPage-Resources-element-image' src={resource.image} alt={resource.title} />
                            </a>
                        </div>
                ))}
            </div>
        </div>
        {isDeletePopupOpen && (
        <div className='ResourceEdit-NewProperty-popup-fullscreen'>
            <div className="ResourceEdit-delete-confirmation-popup">
                <p>Estas seguro de que quieres eliminar esta colección?</p>
                <p>No la podrás recuperar !!</p>
                <div className='ResourceEdit-delete-confirmation-popup-row'>
                <button className='ResourceEdit-button' onClick={() => handleDeleteConfirmation(true)}>Si</button>
                <button className='ResourceEdit-button' id='ResourceEdit-delete-popup-rejection-button' onClick={() => handleDeleteConfirmation(false)}>No</button>
                </div>
            </div>
        </div>
        )}
    </div>
);
};

export default CollectionPage;
