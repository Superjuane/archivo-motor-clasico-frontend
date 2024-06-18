import React, { useState, useEffect } from 'react';
import {useParams, useNavigate}  from 'react-router-dom';
import './ResourceUploadPageNew.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

//NEW PROPERTY:
// 1. Add property to resourceToFormData
// 2. Add property render component



function ResourceUploadPageNew() {
  const navigate = useNavigate();

  const [dataUploadedSuccessfully, setDataUploadedSuccessfully] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const [competitionSuggestions, setCompetitionSuggestions] = useState([]);
  const [magazineIssueNameSuggestions, setMagazineIssueNameSuggestions] = useState([]);
  const [personNameSuggestions, setPersonNameSuggestions] = useState([]);
  const [personNameSuggestionsIndex, setPersonNameSuggestionsIndex] = useState(0);

  const [activatedProperties, setActivatedProperties] = useState({
    Date: false,
    Competition: false,
    MagazineIssue: false,
    Persons: false
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    properties: {},
  });

  const setExtractedDate = (date) => {

    console.log('Date extracted:', date);
   
      let newProperties = formData.properties;
      newProperties.Date = date;
      setFormData(prevState => ({
        ...prevState,
        "properties": newProperties
      }));

      setActivatedProperties((prevProperties) => ({
        ...prevProperties,
        Date: true,
      }));

  }

  function checkIfFilenameContainsDate(filename) {
    const dateRegex = /(\d{4}([.\-/ ])\d{2}\2\d{2}|\d{2}([.\-/ ])\d{2}\3\d{4})/;
    const dateMatch = filename.match(dateRegex);
    if (dateMatch) {
      console.log('Date found from title');
      let date = dateMatch[0];
      let day = parseInt(date.split(/[.\-/ ]/)[0]);
      let month = parseInt(date.split(/[.\-/ ]/)[1]);
      let year = parseInt(date.split(/[.\-/ ]/)[2]);
      if(day.toString().length === 4) { //year <-> day
        const temp = day;
        day = year;
        year = temp;
      }
      if(month > 12){ //day <-> month
        const temp = month;
        month = day;
        day = temp;
      }

      if(day < 1 || day > 31 || month < 1 || month > 12 || year < 0 || year > 9999){
        console.log('Invalid date found from title');
        return;
      }

      if(month < 10) month = '0'+month;

      setExtractedDate(year+'-'+month+'-'+day);

    }
  }

  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        setFiles({"image":reader.result, "text":file.name});
        setFormData(prevState => ({
          ...prevState,
          "title": (file.name).replace('_', ' ').replace('-',' ').replace('.jpg', '').replace('.jpeg', '').replace('.png', '').replace('.gif', '').replace('.webp', '').replace('.bmp', '').replace('.tiff', ''),
        }));

        checkIfFilenameContainsDate(file.name);

    };
    reader.onerror = function (error) {
        setFiles('Error: ' + error);
    };
  }

  const formatFormData = (formData) => { //formats Form to Resource
    let result = {}
    result.title = formData.title;
    result.description = formData.description;
    result.image = files.image;

    Object.keys(formData.properties).map((p, index) => {
      if(p === 'Date' && formData.properties[p] !== ''){
        if(activatedProperties.Date){
          result.date = formData.properties[p]+'T00:00:00Z';
        }
      }
      if(p === 'Competition' && formData.properties[p] !== ''){
        if(activatedProperties.Competition){
          result.competition = formData.properties[p];
        }
      }
      if(p === 'MagazineIssue' 
          && formData.properties[p] !== '' 
          && formData.properties[p].title !== '' 
          && formData.properties[p].number !== ''){
            if(activatedProperties.MagazineIssue){
              result.magazineIssue = formData.properties[p];
              delete result.magazineIssue.name;
              delete result.magazineIssue.country;
            }
      }
      if(p === 'Persons' 
          && formData.properties[p].length > 0 && activatedProperties.Persons){
        let persons= [];
        formData.properties[p].forEach(person => {
          delete person.Person.alias;
          if(person.Person.name !== ''){
            persons.push(person.Person);
          }
        });
        result.persons = persons;
      }
    });
    return result;
  };

  const handleChange = (e) => { //handles changes in form
    if(dataUploadedSuccessfully) setDataUploadedSuccessfully(false);
    if(error) setError(null);
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCompetitionChange = (e) => {
    console.log('Competition change')
    console.log(e)
    console.log(formData)
    const value = e.target.value;

    let newProperties = formData.properties;
    newProperties.Competition = value;
    setFormData(prevState => ({
      ...prevState,
      "properties": newProperties
    }));

    // if (value.length > 0) {
      fetch('http://localhost:8090/resources/properties/competitions?competition='+value, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then (response => response.json())
      .then (data => {
        setCompetitionSuggestions(data);
      })
      .catch(error => console.error('Error fetching data:', error));
    // }
  }

  const handleCompetitionSuggestionClick = (suggestion) => {
    console.log('Suggestion clicked:', suggestion);
    let newProperties = formData.properties;
    newProperties.Competition = suggestion;
    setFormData(prevState => ({
      ...prevState,
      "properties": newProperties
    }));
    setCompetitionSuggestions([]);
  }

  const handleSubmit = () => {//POST

    if(localStorage.getItem('auth') === null){
      setError("Necesitas iniciar sesión para subir un recurso");
      return;
    }

    if(selectedImage === null){
      setError("Selecciona una imagen primero");
      return;
    }

    if(formData.title ===''){
      setError("Es necesario poner un título al recurso");
      return;
    }

    if(formData.title !== '' && selectedImage !== null){
      setError(null);
    }

    fetch('http://localhost:8090/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Allow-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('auth')
      },
      body: JSON.stringify(formatFormData(formData))
    })
    .then(response => {
      if(!response.ok) throw {code: response.status, message: response.json()};
      return response.json()
    })
    .then(data => {
      console.log('Data updated successfully:', data);
      navigate('/resources/'+data.id);
    })
    .catch(error => {
      console.error('Error updating data:', error);
      if(error.code === 401){
        setError("Necesitas iniciar sesión para subir un recurso");
        return;
      }
      if(error.code === 409){
        alert("Este recurso recurso ya existe en la base de datos. ¿Deseas verlo?");
        console.log(error);
        error.message.then((data) => {
          console.log(data);
          window.open('/resources/'+data.id, '_blank');
      })
        return;
      }
    })
    .finally(() => {
    });
  };


  //NEW PROPERTIES
  const [showNewPropertyPopup, setshowNewPropertyPopup] = useState(false);
  const handleNewPropertyPopup = () => {
    setshowNewPropertyPopup(true);
    console.log(activatedProperties)
  }
  const handleNewPropertiesSelected = (newProps) => {
    // console.log('New properties selected');
    // console.log(newProps);
    // for(let prop in newProps){
    //   console.log(prop);
    // }
    // setActivatedProperties(newProps);
    setshowNewPropertyPopup(false);
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    let nameSplit = name.split('-');
    nameSplit = nameSplit[nameSplit.length - 1];
    console.log(nameSplit);

    if(formData.properties[nameSplit] === undefined){
      console.log('Adding property to form data');
      let newProperties = formData.properties;  
      if(nameSplit === 'MagazineIssue'){
        newProperties.MagazineIssue = {"title": '', "number": ''};
      }
      else if(nameSplit === 'Persons'){
        newProperties.Persons = [];
      }
      else{
        newProperties[nameSplit] = '';
      }
    }

    setActivatedProperties((prevProperties) => ({
      ...prevProperties,
      [nameSplit]: checked,
    }));
  };

//component for DATE and COMPETITION
  const propertyComponent = (label, name) => { 
     //PROPERTY COMPONENT MARK II
    if(formData){
      let prop = formData.properties[label];
      // let index = formData.properties.findIndex(p => p[label]);
      if (!prop) {
        formData.properties[label] = '';
      }
      return (
        <div className='ResourceUploadPageNew-input-group'>
          <label>{label === "Date" ? "Fecha" : "Competición"}</label>
          <input
          type={name === "date" ? "date" : "text"}
          name={label}
          value={formData.properties[label]}
          onChange={(e) => {
            let newProperties = formData.properties;
            newProperties[label] = e.target.value;
            setFormData(prevState => ({
              ...prevState,
              "properties": newProperties
            }));
          }}
        />
        </div>
      );
    }
  }

  let dateComponent = propertyComponent("Date", "date");


  //MAGAZINE ISSUES
  const handleMagazineIssueTitleChange = (e) => {

    const value = e.target.value;

    let newProperties = formData.properties;
    newProperties.MagazineIssue.title = value;
    setFormData(prevState => ({
      ...prevState,
      "properties": newProperties
    }));

    // if (value.length > 0) {
      fetch('http://localhost:8090/resources/properties/magazines?magazine='+value, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then (response => response.json())
      .then (data => {
        setMagazineIssueNameSuggestions(data);
      })
      .catch(error => console.error('Error fetching data:', error));
    // }
  }

  const handleMagazineIssueSuggestionClick = (suggestion) => {
    console.log('Suggestion clicked:', suggestion);
    let newProperties = formData.properties;
    newProperties.MagazineIssue.title = suggestion;
    setFormData(prevState => ({
      ...prevState,
      "properties": newProperties
    }));
    setMagazineIssueNameSuggestions([]);
  }

  //PERSONS
  const getPersonValue = (person, index) => {

    if(!formData.properties.Persons[index]){
      formData.properties.Persons[index].Person.name ='';
    }
    return formData.properties.Persons[index].Person.name;
  }

  const handlePersonNameChange = (value, index) => {
    setPersonNameSuggestionsIndex(index);

    let newProperties = formData.properties;
    newProperties.Persons[index].Person.name = value;
    setFormData(prevState => ({
      ...prevState,
      "properties": newProperties
    }));

    fetch('http://localhost:8090/resources/properties/persons?person='+value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then (response => response.json())
    .then (data => {
      setPersonNameSuggestions(data);
    })
    .catch(error => console.error('Error fetching data:', error));

  }

  const handlePersonSuggestionClick = (suggestion, index) => {
    let newProperties = formData.properties;
    newProperties.Persons[index].Person.name = suggestion;
    setFormData(prevState => ({
      ...prevState,
      "properties": newProperties
    }));
    setPersonNameSuggestions([]);
    setPersonNameSuggestionsIndex(-1);
  }

return (
<div>
  <div className="ResourceUploadPageNew-container">
    <h1>Subir recurso</h1>
    {error && (<p className='ResourceUploadPageNew-error'> {error}</p>)}
    <br />
    <div className="ResourceUploadPageNew-navigate-to-resource-row">
      <button className='ResourceUploadPageNew-button' onClick={handleNewPropertyPopup}>Gestionar propiedades</button>
    </div>

    <div className="ResourceUploadPageNew-content">
      <div className='ResourceUploadPageNew-image-div'>
        { selectedImage ?
          (
            <div className='ResourceUploadPageNew-image-inside-column-div'>
              <img
                className="ResourceUploadPageNew-image-preview"
                src={URL.createObjectURL(selectedImage)}
                alt="Resource Preview"
              />
              <button
                    className="ResourceUploadPageNew-button"
                    onClick={() => {
                    setSelectedImage(null);
                    setFiles([null]);
                }}>Quitar archivo</button>
            </div>
          )
          :
          (
            <label className='ResourceUploadPageNew-button'>
              <input
                className="ResourceUploadPageNew-input"
                type="file"
                name="myImage"
                onChange={(event) => {
                    setSelectedImage(event.target.files[0]);
                    setFiles([])
                    getBase64(event.target.files[0]);
                    
                }}
              />
              Seleccionar recurso
            </label>
          )
        }
      </div>
      <form autoComplete='off' className="ResourceUploadPageNew-form">
        <div className="ResourceUploadPageNew-input-group">
          <label>Título:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="ResourceUploadPageNew-input-group">
          <label>Descripción:</label>
          <textarea
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {activatedProperties.Date ? dateComponent :null}

        {activatedProperties.Competition && (
          <div>
          <div className='ResourceEdit-input-group'>
            <label>Competición</label>
            <input
            type="text"
            name= "Competition"
            value={formData.properties.Competition}
            autoComplete="new-password"
            onChange={handleCompetitionChange}
            onBlur={() => {setTimeout(() => setCompetitionSuggestions([]), 250)}}
          />
          </div>
          {competitionSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {competitionSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={()=>handleCompetitionSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        )}

        {activatedProperties.MagazineIssue && (
          <div className='ResourceUploadPageNew-MagazineIssue-outer-input-group'>
            <h2> Revista </h2>
            <div className='ResourceUploadPageNew-input-group'>
            <label> Nombre de la revista </label>
            <input
              type="text"
              name= "MagazineIssue-title"
              value={formData.properties.MagazineIssue.title}
              onChange={handleMagazineIssueTitleChange}
              onBlur={() => {setTimeout(() => setMagazineIssueNameSuggestions([]), 100)}}
            />
            {magazineIssueNameSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {magazineIssueNameSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={()=>handleMagazineIssueSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            </div>
            <div className='ResourceUploadPageNew-input-group'>
            <label> Número de la revista </label>
            <input
              type="number"
              name= "MagazineIssue-number"
              value={formData.properties.MagazineIssue.number}
              onChange={(e) => {
                let newProperties = formData.properties;
                newProperties.MagazineIssue.number = e.target.value;
                setFormData(prevState => ({
                  ...prevState,
                  "properties": newProperties
                }));
              }}
            />
            </div>
          </div>
        )}

        {activatedProperties.Persons && (
          <div className='ResourceUploadPageNew-Persons-outer-input-group'>
            {/* PERSON HEADER */}
            <div className='ResourceUploadPageNew-Persons-header-row'>
              <h2> Personas </h2>
              <button className='ResourceUploadPageNew-Persons-header-row-button' onClick={()=>{
                let newProperties = formData.properties;
                newProperties.Persons.push ({"Person":{"name": '', "alias": ''}});
                setFormData(prevState => ({
                  ...prevState,
                  "properties": newProperties
                }));
              }}>
                <FontAwesomeIcon icon={faPlusSquare} />
              </button>
            </div>

            {/* PERSONS LIST */}
            <div>
              {formData.properties.Persons.map((person, index) => (
                <div key={index} className='ResourceUploadPageNew-Persons-element-outside-div'>
                  <button className='ResourceUploadPageNew-Persons-element-remove-button' onClick={()=>{
                    let newProperties = formData.properties;
                    newProperties.Persons.splice(index, 1);
                    setFormData(prevState => ({
                      ...prevState,
                      "properties": newProperties
                    }));
                  }}>
                    <FontAwesomeIcon icon={faMinusCircle} />
                  </button>
                  <div className='ResourceUploadPageNew-Persons-element-div'>
                    <label>Nombre:</label>
                    <input
                      type="text"
                      className='ResourceUploadPageNew-Persons-element-input'
                      value={getPersonValue(person, index)}
                      onChange={(e) => {handlePersonNameChange(e.target.value, index);}}
                      onBlur={() => {setTimeout(() => setPersonNameSuggestions([]), 100)}}
                    />
                    {personNameSuggestions.length > 0 && index === personNameSuggestionsIndex && (
                      <ul className="suggestions-list">
                        {personNameSuggestions.map((suggestion, i) => (
                          <li
                            key={i}
                            onClick={()=>handlePersonSuggestionClick(suggestion, index)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className='ResourceUploadPageNew-button-outside-container-column'>
          <div className='ResourceUploadPageNew-button-outside-container-row'>
            <button id='ResourceUploadPageNew-edit-button' className='ResourceUploadPageNew-button' onClick={handleSubmit}>Subir recurso</button>
          </div>
          {dataUploadedSuccessfully && <label>Recurso guardado 👌</label>}
        </div>
      </form>
    </div>
  </div>
  {showNewPropertyPopup && (
    <div className='ResourceUploadPageNew-NewProperty-popup-fullscreen'>
      <div className='ResourceUploadPageNew-NewProperty-popup'>
        <h2>Selecciona las propiedades que quieres agregar...</h2>
        <form className='ResourceUploadPageNew-NewProperty-popup-form' id='ResourceUploadPageNew-NewProperty-popup-form'>
          <label className='ResourceUploadPageNew-NewProperty-popup-form-label'>
            <input 
            className='ResourceUploadPageNew-NewProperty-popup-form-input' 
            type="checkbox" 
            name="NewProperty-Form-Date" 
            checked={activatedProperties.Date} 
            onChange={handleCheckboxChange} 
            /> Fecha
          </label>
          <label className='ResourceUploadPageNew-NewProperty-popup-form-label'>
            <input 
            className='ResourceUploadPageNew-NewProperty-popup-form-input' 
            type="checkbox" 
            name="NewProperty-Form-Competition" 
            checked={activatedProperties.Competition} 
            onChange={handleCheckboxChange}
            /> Competición
          </label>
          <label className='ResourceUploadPageNew-NewProperty-popup-form-label'>
            <input 
            className='ResourceUploadPageNew-NewProperty-popup-form-input' 
            type="checkbox" 
            name="NewProperty-Form-MagazineIssue" 
            checked={activatedProperties.MagazineIssue} 
            onChange={handleCheckboxChange}
            /> Revista
          </label>
          <label className='ResourceUploadPageNew-NewProperty-popup-form-label'>
            <input 
            className='ResourceUploadPageNew-NewProperty-popup-form-input' 
            type="checkbox" 
            name="NewProperty-Form-Persons" 
            checked={activatedProperties.Persons} 
            onChange={handleCheckboxChange}
            /> Personas
          </label>
          <button  className='ResourceUploadPageNew-button' type="button" 
            onClick={()=>{
              let newProps ={
                Date: document.getElementsByName('NewProperty-Form-Date')[0].checked,
                Competition: document.getElementsByName('NewProperty-Form-Competition')[0].checked,
                MagazineIssue: document.getElementsByName('NewProperty-Form-MagazineIssue')[0].checked,
                Persons: document.getElementsByName('NewProperty-Form-Persons')[0].checked
              };

              handleNewPropertiesSelected(newProps)
            }}>
            Aceptar
          </button>
        </form>
      </div>
    </div>
  )}
</div>
  );
}

export default ResourceUploadPageNew;
