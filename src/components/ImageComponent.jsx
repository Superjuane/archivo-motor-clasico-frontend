import {React, useState, useEffect, useRef } from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSpinner, faCheck, faCircleXmark, faPlusSquare, faMinusSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
// import Tooltip from '@mui/material/Tooltip';
import './ImageComponent.css';


const RecursiveComment = (comment) => {
    const username = localStorage.getItem('username');

    const [isCommentCreased, setIsCommentCreased] = useState(false);

    const [upvote, setUpvote] = useState({});
    const [comments, setComments] = useState([]);

    const [isReplyActive, setIsReplyActive] = useState(false);
    const [replyText, setReplyText] = useState('');

    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);


    const handleReplyButton = () => {
        if(username!=null){
            setIsReplyActive(!isReplyActive);
        }
    }

    useEffect(()=>{ //GET UPVOTES
        fetch("http://localhost:8090/upvotes/"+comment.comment.id,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('auth')

            },
        }).then((response)=>
            response.json())
        .then((data)=>{
            console.log(data);
            setUpvote(data);
            
        }).catch((err)=>{
            console.log(err.message);
        });
    }, [comment]);

    useEffect(()=>{ //GET CHILDREN COMMENTS
        if(comment.comment.comments != null && comment.comment.comments.length > 0){
            fetch("http://localhost:8090/comments?comment=" + comment.comment.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Allow-Control-Allow-Origin': '*',
                    'Authorization': localStorage.getItem('auth')
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data);
                    setComments(data);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }, [comment]);


    const handleSubmit = () => {
        if(username != null && replyText != null && replyText !== ''){
            fetch("http://localhost:8090/comments", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Allow-Control-Allow-Origin': '*',
                    'Authorization': localStorage.getItem('auth')
                },
                body: JSON.stringify({
                    text: replyText,
                    commentParentId: comment.comment.id
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setComments([...comments, data]);
                setReplyText('');
                setIsReplyActive(false);
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
    }

    const handleDelete = () => {
        fetch("http://localhost:8090/comments/"+comment.comment.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('auth')
            },
        })
        .then((response) => {
            console.log(response);
            if(response.status !== 204){
                throw new Error("Error deleting comment");
            }
            //response.json();
        })
        .then(() => {
            console.log("Comment deleted successfully");
            window.location.reload();
        })
        .catch((err) => {
            console.log(err.message);
        });

    }

    const renderMoreSubcoments = () => {
        console.log(comment.comment)
        // if(comment.comment.comments != null && comment.comment.comments.length > 0){
            fetch("http://localhost:8090/comments?comment=" + comment.comment.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Allow-Control-Allow-Origin': '*',
                    'Authorization': localStorage.getItem('auth')
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("-------- children comment of"+comment.comment.id+" ---------")
                    console.log(data);
                    setComments(data);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        // }
    }

    const handleSubmitUpvote = () => {
        if(username != null){
            fetch("http://localhost:8090/upvotes/"+comment.comment.id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Allow-Control-Allow-Origin': '*',
                    'Authorization': localStorage.getItem('auth')
                },
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUpvote(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
    }

    const handleSubmitDownvote = () => {
        if(username != null){
            fetch("http://localhost:8090/upvotes/"+comment.comment.id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Allow-Control-Allow-Origin': '*',
                    'Authorization': localStorage.getItem('auth')
                },
            })
            .then((response) => {
                if(response.status !== 204){
                    throw new Error("Error deleting upvote");
                }
                else if (response.status === 204){
                    setUpvote({upvotes: upvote.upvotes-1, users: upvote.users.filter(user => user !== username)});
                }
            })
            .catch((err) => {
                console.log("error: "+ err.message);
            });
        }
    }

    const getIsCreasedClassname = () => {
        if(isCommentCreased){
            return 'ImageComponent-comments-list-comment-creased';
        } else {
            return 'ImageComponent-comments-list-comment-not-creased';
        }
    }

    return(
        <div className="ImageComponent-comments-list-comment" key={"comment-1-"+comment.comment.id}>
                <div className='ImageComponent-comments-list-comment-heading-outside-row'>
                    <div className="ImageComponent-comments-list-comment-heading">
                        <div className="ImageComponent-comments-list-comment-voting">
                            { username !== null  && upvote.users && upvote.users.includes(username) ?
                            <button type="button" className='ImageComponent-comments-list-comment-voting-button-upvoted' onClick={()=>handleSubmitDownvote()}>
                                <span aria-hidden="true">&#9650;</span>
                                <span className="sr-only">Vote up</span>
                            </button>
                            :
                            <button type="button" onClick={()=>handleSubmitUpvote()}>
                                <span aria-hidden="true">&#9650;</span>
                                <span className="sr-only">Vote up</span>
                            </button>

                            }
                        </div>
                        <div className="ImageComponent-comments-list-comment-info">
                                <a href={"/user/"+comment.comment.creator} className="ImageComponent-comments-list-comment-author">{comment.comment.creator}</a>
                                <p className="m-0">
                                {upvote.upvotes ? upvote.upvotes : 0} upvotes
                            </p>
                        </div>
                        { username !== null && username === comment.comment.creator &&(<button className='ImageComponent-comments-list-comment-delete-button' onClick={()=>setIsDeletePopupOpen(true)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>)}
                    </div>
                    {isDeletePopupOpen && (
                        <div className="ImageComponent-comments-list-comment-delete-popup">
                            <p>¿Seguro que quieres borrar este comentario?</p>
                            <div className='ImageComponent-comments-list-comment-delete-popup-row'>
                                <button onClick={()=>handleDelete()}>Sí</button>
                                <button onClick={()=>setIsDeletePopupOpen(false)}>No</button>
                            </div>
                        </div>
                    )}
                    <div className="ImageComponent-comments-list-comment-creaser">
                        <button type="button" onClick={()=>{setIsCommentCreased(!isCommentCreased)}}>
                            {isCommentCreased ? 
                            <FontAwesomeIcon icon={faPlusSquare} />
                            :
                            <FontAwesomeIcon icon={faMinusSquare} /> 
                            }
                        </button>
                    </div>
                </div>
    
            <div className={getIsCreasedClassname()}>
                <div className="ImageComponent-comments-list-comment-body">
                    <p>
                        {comment.comment.text}
                    </p>
                    <button type="button" onClick={()=>{handleReplyButton()}}>Responder</button>
                    {(username === null || username !== comment.comment.creator) && (<button type="button">Reportar</button>)}
                </div>

                {isReplyActive && (
                    <div className="ImageComponent-comments-list-comment-reply">
                        <textarea
                            className="ImageComponent-comments-list-comment-reply-textarea"
                            autoFocus
                            onKeyDown={(e)=>{if(e.key === 'Enter' && !e.shiftKey){handleSubmit()}}}
                            value={replyText}
                            onChange={(e)=>{setReplyText(e.target.value)}}
                            placeholder="Write a reply..."
                        />
                        <button 
                            type="button" 
                            className='ImageComponent-comments-list-comment-reply-submit-button'
                            onClick={()=>{handleSubmit()}}>
                                Submit
                        </button>
                    </div>
                )}

                {comments &&(<div className="ImageComponent-comments-list-replies">
                    {comments.map(childComment => (
                        <RecursiveComment key={childComment.id} comment={childComment} />
                    ))}
                </div>)}

                { comments.length == 0 && (<button className='ImageComponent-comments-list-replies-show-more-replies-button' onClick={()=>renderMoreSubcoments()}> show more replies </button>)}
            </div>
        </div>
    );
    
}

const ImageComponent = (id) => {
    const URL = 'http://localhost:8090';
    const username = localStorage.getItem('username');
    const inputRef = useRef();


    const [image, setImage] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [creator, setCreator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorText, setErrorText] = useState(null);

    //ADD TO COLLECTIONS
    const [collections, setCollections] = useState([]);
    const [isCollectionsPopupOpen, setIsCollectionsPopupOpen] = useState(false);
    const [collectionsIdsState, setCollectionsIdsState] = useState({}); //0: no added, 1: added, -1: loadding

    //COMMENTS
    const [comments, setComments] = useState([]);

    const handleCollectionsPopup = () => {
        if(!username) {
            window.scrollTo(0, 0);
            setIsCollectionsPopupOpen(true);
            const timer = setTimeout(() => {setIsCollectionsPopupOpen(false);}, 3000);
            return;
        }

        fetch(URL+'/collections?user='+username, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Origin': '*',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("All Collections: " +data);
                setCollections(data);
                let collectionsIdsState = {};
                data.forEach(collection => {
                    console.log("  one Collection: " +collection.resourcesIds);
                    collectionsIdsState[collection.id] = 0;
                    collection.resourcesIds.forEach( (resourceId) => {
                        console.log("     Resource: " +resourceId);
                        console.log("     ID: " +id.id)
                        if(resourceId === id.id) {
                            collectionsIdsState[collection.id] = 1;
                        }
                    })
                    console.log("collectionsIdsState: ", collectionsIdsState)
                })
                setCollectionsIdsState(collectionsIdsState);
            })
            .catch(error => console.error('Error fetching collections:', error));
        window.scrollTo(0, 0)
        setIsCollectionsPopupOpen(true);
    }

    const handleSubmitResourceComment  = () => {
        let text = inputRef.current.value;
        if(text === '') return;
        if(username === null) setErrorText("You must be logged in to comment");
        fetch(URL+'/comments', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('auth')
            },
            body: JSON.stringify({
                text: text,
                resourceId: id.id
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setComments([...comments, data]);
            inputRef.current.value = '';
        })
        .catch(error => console.error('Error creating comment:', error))
        
    }

    useEffect(() => { //GET RESOURCE AND COMMENTS
            fetch("http://localhost:8090/resources/"+(id.id),{
                headers: {
                    'Accept': 'application/json',
                    'Allow-Control-Allow-Origin': '*',
                },
            })
                .then((response)=>
                    response.json())
                .then((data)=>{
                    console.log(data);
                    if (data.type ==="StringBase64")
                        setImage('data:image/jpeg;base64,'+data.image);
                    if (data.type ==="URL")
                        setImage(data.imageUrl);
                    setTitle(data.title);
                    setDescription(data.description);
                    setCreator(data.creator);
            }).catch((err)=>{
                console.log(err.message);
                setError("Error!")})
            .finally(()=>{setLoading(false)});

            fetch("http://localhost:8090/comments?resource="+id.id,{
                headers: {
                    'Accept': 'application/json',
                    'Allow-Control-Allow-Origin': '*',
                },
            })
            .then((response)=>
                response.json())
            .then((data)=>{
                console.log(data);
                setComments(data);
            }).catch((err)=>{
                console.log(err.message);
                setError("Error!")
            })
    }, [id]);

    const handleAddToCollection = (collectionId) => {
        console.log("Add to collection");
        setCollectionsIdsState({...collectionsIdsState, [collectionId]: -1});
        fetch(URL+'/collections/'+collectionId+'/resources/'+id.id, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Allow-Control-Allow-Origin': '*',
                'Authorization': localStorage.getItem('auth')
            }        })
        .then(response => {
            let data = response.json();
            console.log("Data: "+data)
            if(!response.ok) throw {code: response.status, data: data};
            return data;
        })
        .then((data)=>{
            console.log("Image uploaded successfully")
            setCollectionsIdsState({...collectionsIdsState, [collectionId]: 1});
        })
        .catch((error) => {
            setCollectionsIdsState({...collectionsIdsState, [collectionId]: 0});
            if(error.code === 400){
                console.log("Bad Request")
                console.log(error.data)
            }
            if(error.code === 401){
                console.log("Forbidden")
            }
            console.error('Error:', error);
        });


    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error!: {error}</p>;
    }

    let edit = null;
    if(creator === localStorage.getItem('username')){
        edit = (<div className='ImageComponent-edit-div'>
            <a className='ImageComponent-edit-a' href={"/edit/"+id.id} >
            <button className='ImageComponent-edit-button' style={{"fontSize":"24px"}}>
                Editar 
            </button>
            </a>
        </div>)
    }

    console.log("-------- comments before rendering ---------")
    console.log(comments)

    return (
        <div>
            <div className='ImageComponent-container'>
                <div className='ImageComponent-resource-div'>
                    {edit}
                    <div className='ImageComponent-image-background'>
                        <div className='ImageComponent-image-container'>
                                <img className='ImageComponent-image' src={image} alt="Fetched " />
                        </div>
                    </div>
                    <div className='ImageComponent-text-container-outside'>
                        <div className='ImageComponent-text-container-inside'>
                            <div className='ImageComponent-text-container-title-row'>
                                <div className='ImageComponent-text-container-title-row-title'>
                                    <h1 className='ImageComponent-h1'>{title}</h1>
                                </div>
                                <div className='ImageComponent-text-container-title-row-button'>
                                    <button className='ImageComponent-open-collections-popup-button' onClick={()=>handleCollectionsPopup()}>Agregar a colección</button>
                                </div>
                            </div>
                            <p className='ImageComponent-p'>{description}</p>
                            <p className='ImageComponent-p'>Creator: {creator}</p>
                        </div>
                    </div>    
                </div>

                <div className='ImageComponent-separator'></div>

                
                <div className='ImageComponent-comments-div'>
                    <div className='ImageComponent-comments-div-row-center'>
                        <div className='ImageComponent-comments-title'>
                            <h2>Discusión</h2>
                            {errorText && <p style={{color:"red"}}>{errorText}</p>}
                        </div>
                    </div>
                    {comments.length > 0 ?
                        (<div className='ImageComponent-comments-list-comment-thread-outside-div'>
                            <textarea  
                                className='ImageComponent-comments-list-comment-thread-textarea'
                                ref={inputRef}
                                placeholder='Escribe un opinión o...'
                            ></textarea>
                            <button className='ImageComponent-comments-list-comment-thread-submit-button' onClick={()=>handleSubmitResourceComment()}>Enviar</button>
                            {comments.length > 0 && (<div className='ImageComponent-comments-list-comment-thread'>
                                {comments.map(comment => (
                                    <RecursiveComment key={comment.id} comment={comment} />
                                ))}
                            </div>)}
                        </div>)
                        :
                        (
                            <div className='ImageComponent-comments-list-comment-thread-empty'>
                                <p>Parece que no hay opiniones sobre la imágen... <br /> Tienes algun cambio o sugerencia que agregar?  </p>
                                <textarea
                                name='new-comment-textarea'
                                ref={inputRef}  
                                className='ImageComponent-comments-list-comment-thread-textarea'
                                placeholder='Escribe un opinión o...'
                                ></textarea>
                                <button className='ImageComponent-comments-list-comment-thread-submit-button' onClick={()=>handleSubmitResourceComment()}>Enviar</button>
                            </div>
                        )
                    }

                </div>
                
            </div>

            {/* COLLECTIONS POP UP */}
            {isCollectionsPopupOpen && !username && (
                <div className='ImageComponent-collections-popup'>
                    <div className='ImageComponent-collections-popup-inside'>
                        <h2 className='ImageComponent-collections-popup-h2'>Inicia sesión para agregar a una colección</h2>
                    </div>
                </div>
            
            )}
            {isCollectionsPopupOpen && username &&
                (<div className='ImageComponent-collections-popup-fullscreen'>
                    <div className='ImageComponent-collections-popup'>
                        <div className='ImageComponent-collections-popup-inside'>
                            <div className='ImageComponent-collections-popup-title-row'>
                                <h2 className='ImageComponent-collections-popup-h2'>Agregar a colección</h2>
                                <button className='ImageComponent-collections-popup-close-button' onClick={()=>setIsCollectionsPopupOpen(false)}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                            <div className='ImageComponent-collections-popup-collections'>
                                {collections.map(collection => (
                                    <div className='ImageComponent-collections-popup-element' key={collection.id}>
                                        <div className='ImageComponent-collections-popup-element-row'>
                                            <div className='ImageComponent-collections-popup-element-title'>
                                                {collection.title}
                                            </div>
                                            <div className='ImageComponent-collections-popup-element-button'>
                                                {collectionsIdsState[collection.id] === 1 ?
                                                    <button className='ImageComponent-collections-popup-element-button-button' >
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button> 

                                                : collectionsIdsState[collection.id] === -1 ?
                                                    <button className='ImageComponent-collections-popup-element-button-button'>
                                                        <FontAwesomeIcon icon={faSpinner} />
                                                    </button>
                                                :
                                                    <button className='ImageComponent-collections-popup-element-button-button' onClick={()=>handleAddToCollection(collection.id)}>
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </button>
                                                }
                                            </div>
                                        </div> 
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>)
            }
        </div>
    );
};

export default ImageComponent;