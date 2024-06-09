import React, { useEffect, useState, useRef } from 'react';
import './UserPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import CollectionCard from 'components/CollectionCard'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';


const UserPage = () => {
  let { user } = useParams();
  let username = localStorage.getItem('username');
  console.log('User:', user);
  console.log('Username:', username);
  let authorized = username === user;

  const inputRef = useRef();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [collections, setCollections] = useState([]);
  const [resources, setResources] = useState([]);
  const [isNewCollectionsPopupOpen, setIsNewCollectionsPopupOpen] = useState(false);
  const URL = 'http://localhost:8090';


  const parseTitle = (title) => {
    if (title.length > 10) {
      let words = title.split(' ');
      words.forEach((word, index) => {
        if (word.length > 10) {
          words[index] = '';
          for (let i = 0; i < word.length; i += 10) {
            words[index] += word.slice(i, i + 10) + '- ';
          }
        }
      });
      title = words.join(' ');
    } else {
      for(let i = title.length; i < 17; i++){
        title += ' ';
      }
    }
    return title;
  }

  useEffect(() => {
    if (user !== undefined) {
      username = user;
    }

    fetch(URL+'/user?name='+username, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        data.role = data.role === 'ROLE_USER' ? 'User' : 'Admin';
        setUserData(data);
      })
      .catch(error => console.error('Error fetching user data:', error));

    // Fetch collections data
    fetch(URL+'/collections?user='+username, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        // data.push({ id: 99, title: 'i2hfeuihidhfwifn' })
        // data.push({ id: 999, title: ' a' })
        // data.push({ id: 999, title: 'wiuefjoadnvh wefn ' })
        // data.push({ id: 9999, title: 'y3728hf28fg82ef23hf2eufn' })
        // data.push({ id: 1, title: '12345678901234567890123456789012345678901234567890' })
        // data.push({ id: 2, title: '12345678901234567890123456789012345678901234567890' })
        // data.push({ id: 3, title: '12345678901234567890123456789012345678901234567890' })
        // data.push({ id: 4, title: '12345678901234567890123456789012345678901234567890' })
        // data.push({ id: 4, title: '1234567890123 45678901234567890' })
        
        console.log(data);

        data.forEach(collection => {
          collection.title = parseTitle(collection.title);
        });

        setCollections(data);
      })
      .catch(error => console.error('Error fetching collections:', error));

    // Fetch resources data
    fetch(URL+'/resources/user?user='+username, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        data.forEach(resource => {
          resource.image = 'data:image/jpeg;base64,'+resource.image;
          resource.title = parseTitle(resource.title);
        })
        setResources(data)
      })
      .catch(error => console.error('Error fetching resources:', error));
  }, []);


  const handleSubmitNewCollection = () => {
    let title = inputRef.current.value;
    if(title === '') return;
    if(!authorized) return;
    console.log(title);
    fetch(URL+'/collections', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Allow-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('auth')
      },
      body: JSON.stringify({
        title: title,
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCollections(collections => [...collections, data]);
        setIsNewCollectionsPopupOpen(false);
      })
      .catch(error => console.error('Error creating collection:', error));
  }

  // if(localStorage.getItem('username') === null){
  //   return (
  //     <div className='UserPage'>
  //       <h1>
  //         Inicia sesión para ver tu perfil
  //       </h1>
  //       <br></br>
  //       <a href="/login">
  //         <h2>Log in</h2>
  //         </a>
  //     </div>
  // )}

  return (
    <div>
      <div className="UserPage">
        <div className='UserPage-user-row'>
          <div className='UserPage-user-image'>
            <img 
              className='' 
              src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' 
              alt='User profile'>
            </img>
          </div>
          <div className='UserPage-user-info'>
            <p className='UserPage-user-info-username'>@{userData ? userData.username : 'Cargando...'}</p>
            {authorized && (<p className='UserPage-user-info-email'> {userData ? userData.email : 'Cargando...'}</p>)}
            {authorized && (<p className='UserPage-user-info-role'>Role: {userData ? userData.role : 'Cargando...'}</p>)}
          </div>
        </div>

        <div className="UserPage-Collections">
          <div className='UserPage-Collections-Header'>
            {authorized?(<h2>Tus colecciones</h2>):(<h2>Colecciones de {userData ? userData.username : 'Cargando...'}</h2>)}
            {authorized && (<button title='Agregar una colección' className='UserPage-Collection-Header-Add-Collection-Button' onClick={()=>setIsNewCollectionsPopupOpen(true)}>
              <FontAwesomeIcon icon={faCirclePlus} />
            </button>)}
          </div>
          
          {collections.length > 0 ? (
            // <ul>
            <div className='UserPage-Collections-container'>
              {collections.map(collection => (
                // <a href={'/collections/'+collection.id} className='UserPage-Collections-element' key={collection.id}>
                //   {collection.title}
                // </a>
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          ) : (
            <div>
              <br></br>
              {authorized? <p>Todavía no has creado ninguna colección </p> : <p>Este usuario no tiene colecciones</p>}
              <br></br>
            </div>
          )}
        </div>

        <div className="UserPage-Resources">
          {/* <div className='UserPage-Collections-Header'>
            <h2>Tus colecciones</h2>
            <button className='UserPage-Collection-Header-Add-Collection-Button' onClick={()=>setIsNewCollectionsPopupOpen(true)}>
              <FontAwesomeIcon icon={faCirclePlus} />
            </button>
          </div> */}
          <div className='UserPage-Resources-Header'>
            {authorized ? (<h2>Tus recursos</h2>):(<h2>Recursos de {userData ? userData.username : 'Cargando...'}</h2>)}
            {authorized && (<button title='Subir un recurso nuevo' className='UserPage-Collection-Header-Add-Collection-Button' onClick={()=>navigate('/upload')}>
              <FontAwesomeIcon icon={faCirclePlus} />
            </button>)}
          </div>
          {resources.length > 0 ? (
            <div className='UserPage-Resources-container'>
              {resources.map(resource => (
                <div className='UserPage-Resources-element' key={resource.id}>
                  <a className='UserPage-Resource-link' href={"/resources/"+resource.id}>
                    <h3>{resource.title}</h3>
                    <img className='UserPage-Resources-element-image' src={resource.image} alt={resource.title} />
                  </a>
                </div>
              ))}
            </div>
          ) : 
            authorized ? <p> Todavía no has subido ningún recurso </p> : <p>Este usuario no tiene recursos</p>
          }
        </div>
      </div>

      {isNewCollectionsPopupOpen &&
        (<div className='UserPage-collections-popup-fullscreen'>
            <div className='UserPage-collections-popup'>
                <div className='UserPage-collections-popup-inside'>
                    <div className='UserPage-collections-popup-title-row'>
                        <h2 className='UserPage-collections-popup-h2'>Nueva Colección</h2>
                        <button className='UserPage-collections-popup-close-button' onClick={()=>setIsNewCollectionsPopupOpen(false)}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    </div>
                    <div className='UserPage-collections-popup-content'>
                        <input ref={inputRef} type='text' placeholder='Nombre de la colección' className='UserPage-collections-popup-input' maxLength={50}></input>
                        <button className='UserPage-collections-popup-button' onClick={()=>handleSubmitNewCollection()}>Crear</button>
                    </div>
                </div>
            </div>
        </div>)
      }

    </div>
  );
};

export default UserPage;

