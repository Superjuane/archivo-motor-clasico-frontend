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
const [resources, setResources] = useState([]);

const [isDeleteModeOn, setIsDeleteModeOn] = useState(false);
const [isEditTitleModeOn, setIsEditTitleModeOn] = useState(false);

useEffect(() => {
    console.log('Fetching collection with id: ', id);
    fetch(URL+'/collections/'+id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
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


//RENDER
if(!collection) return <div>Cargando colección...</div>;
if(!resources) return (
    <div className='CollectionPage-outiside-div'>
        <div className='CollectionPage-header-div'>
            <h1>{collection.title}</h1> 
        </div>
    </div>
);

return (
    <div className='CollectionPage-outiside-div'>
        <div className='CollectionPage-header-div'>
            <div className='CollectionPage-header-div-second'>
                {!isEditTitleModeOn || username === null || collection.creator !== username ? 
                    <h1>{collection.title}</h1>
                    :
                    <input 
                        type='text' 
                        value={collection.title} 
                        onChange={(e)=>setCollection({...collection, title: e.target.value})} 
                        maxLength={50}
                        className='CollectionPage-header-title-input' />
                }
                {username !== null && collection.creator === username &&
                    (!isEditTitleModeOn ?
                        <button onClick={()=>setIsEditTitleModeOn(!isEditTitleModeOn)}>
                            <FontAwesomeIcon icon={faPencil} />
                        </button>
                    :
                        <button onClick={()=>{setIsEditTitleModeOn(!isEditTitleModeOn);
                                            fetch(URL+'/collections/'+id, {
                                                method: 'PUT',
                                                headers: { 
                                                    'Content-Type': 'application/json',
                                                    'Allow-Control-Allow-Origin': '*',
                                                    'Authorization': localStorage.getItem('auth') 
                                                },
                                                body: JSON.stringify({newTitle: collection.title})
                                            })
                                            .then(response => response.json())
                                            .then(data => {
                                                console.log(data);
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
);
};

export default CollectionPage;
