import React, { useState, useEffect } from 'react';
import {useParams, useNavigate}  from 'react-router-dom';
import './ResourceEditPage.css';
import DynamicProperty from 'components/DynamicProperty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

//NEW PROPERTY:
// 1. Add property to resourceToFormData
// 2. Add property render component



function ResourceEditPage() {
  const navigate = useNavigate();

  let { id } = useParams();
  const [dataUploadedSuccessfully, setDataUploadedSuccessfully] = useState(false);
  const [competitionSuggestions, setCompetitionSuggestions] = useState([]);
  const [magazineIssueNameSuggestions, setMagazineIssueNameSuggestions] = useState([]);
  const [personNameSuggestions, setPersonNameSuggestions] = useState([]);
  const [personNameSuggestionsIndex, setPersonNameSuggestionsIndex] = useState(0);

  const [resource, setResource] = useState({
    title: '',
    description: '',
    image: '',
    properties: [],
    creator: '',
  });

  const [activatedProperties, setActivatedProperties] = useState({
    Date: false,
    Competition: false,
    MagazineIssue: false,
    Persons: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    properties: {},
  });



  const resourceToFormData = (resource) => { //formats Resource to Form (ONLY ONCE)
    let result = {
      title: resource.title,
      description: resource.description,
      properties: {},
    }

    resource.properties.forEach(p => {
      if(p.Date){
        console.log(p.Date.date.split('T')[0]);
        result.properties.Date = p.Date.date.split('T')[0];
      }
      else if(p.Competition){
        result.properties.Competition = p.Competition.name;
      }
      else if(p.MagazineIssue){
        result.properties.MagazineIssue = p.MagazineIssue;
      }
      else if(p.Persons){
        result.properties.Persons = p.Persons.persons;
      }
    });
    return result;
  };

  const fromResourceToActivateProperties = (resource) => { //activates properties in form
    let result = {
      Date: false,
      Competition: false,
      MagazineIssue: false,
      Persons: 0
    }

    resource.properties.forEach((p, index) => {
      if(p.Date){
        result.Date = true;
      }
      else if(p.Competition){
        result.Competition = true;
      }
      else if (p.MagazineIssue){
        result.MagazineIssue = true;
      }
      else if (p.Persons){
        let personsArray = p.Persons.persons;
        result.Persons = personsArray.length;
      }
    });
    return result;
  }

  const formatFormData = (formData) => { //formats Form to Resource
    let result = {}
    result.title = formData.title;
    result.description = formData.description;

    Object.keys(formData.properties).map((p, index) => {
      console.log(p)
      if(p === 'Date' && formData.properties[p] !== ''){
        console.log(formData.properties[p])
        result.date = formData.properties[p]+'T00:00:00Z';
      }
      if(p === 'Competition' && formData.properties[p] !== ''){
        result.competition = formData.properties[p];
      }
      if(p === 'MagazineIssue' 
          && formData.properties[p] !== '' 
          && formData.properties[p].title !== '' 
          && formData.properties[p].number !== ''){
            result.magazineIssue = formData.properties[p];
        delete result.magazineIssue.name;
        delete result.magazineIssue.country;
      }
      if(p === 'Persons' 
          && formData.properties[p].length > 0){
        let persons= [];
        formData.properties[p].forEach(person => {
          console.log("this is person:")
          console.log(person)
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

  useEffect(() => { //GET RESOURCE
    fetch('http://localhost:8090/resources/'+id, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Allow-Control-Allow-Origin': '*'
        }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Data fetched successfully:', data);
      setResource(data);
      setActivatedProperties(fromResourceToActivateProperties(data));
      setFormData(resourceToFormData(data));
      console.log(activatedProperties)
    })
    .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (e) => { //handles changes in form
    if(dataUploadedSuccessfully) setDataUploadedSuccessfully(false);
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {//PUT
    console.log('Submitting...');

    fetch('http://localhost:8090/resources/'+id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth')
      },
      body: JSON.stringify(formatFormData(formData))
    })
    .then(response => response.json())
    .then(data => {
      console.log('Data updated successfully:', data);
      setResource(data);
      setFormData(resourceToFormData(data));
      window.scrollTo(0, 0);
      setTimeout(()=>{setDataUploadedSuccessfully(false);},3000)
      setDataUploadedSuccessfully(true);
    })
    .catch(error => console.error('Error updating data:', error))
    .finally(() => {
    });
  };

  //DELETE
  const [showDeleteConfirmation, setshowDeleteConfirmation] = useState(false);
  const handleDelete = () => {
    setshowDeleteConfirmation(true);
  };
  const handleDeleteConfirmation = (confirmed) => {
    if (confirmed) {
      fetch('http://localhost:8090/resources/'+id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('auth')
        },
      })
      .then(response => {
        console.log(response)
        if(!response.ok) throw {code: response.status};
        if(response.status === 204){
          console.log('Resource deleted successfully');
          alert('El recurso ha sido eliminado correctamente.');
          navigate('/resources');
        }
      })
      .catch((error) => {
        if(error.code === 400){
          console.log("Bad Request")
        }
        if(error.code === 403){
          console.log("Forbidden")
        }
        if(error.code === 409){
          console.log("Conflict")
        }
        console.error('Error:', error);
      }); 
    } else {
        console.log('Deletion canceled.');
    }
    setshowDeleteConfirmation(false);
  };


  //NEW PROPERTIES
  const [showNewPropertyPopup, setshowNewPropertyPopup] = useState(false);
  const handleNewPropertyPopup = () => {
    setshowNewPropertyPopup(true);
    console.log(activatedProperties)
  }
  const handleNewPropertiesSelected = (newProps) => {
    console.log('New properties selected');
    console.log(newProps);
    setActivatedProperties(newProps);
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
      if(nameSplit === 'Competition'){
        newProperties.Competition = ''; 
      }
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
        <div className='ResourceEdit-input-group'>
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
  <div className="ResourceEdit-container">
    <h1>Editar Recurso</h1>
    {dataUploadedSuccessfully && (<label className='ResourceEdit-recurso-guardado-row'>Recurso guardado 👌</label>)}
    <br />
    <div className="ResourceEdit-navigate-to-resource-row">
      <button className='ResourceEdit-button' onClick={handleNewPropertyPopup}>Gestionar propiedades</button>
      <button 
        className="ResourceEdit-button" 
        onClick={(event)=>{
          window.open('/resources/'+id,'_blank')
        }}>Navegar al recurso </button>
    </div>

    <div className="ResourceEdit-content">
      <div className='ResourceEdit-image-div'>
        <img
          className="ResourceEdit-image-preview"
          src={'data:image/jpeg;base64,'+resource.image}
          alt="Resource Preview"
        />
        <button className="ResourceEdit-button" id='ResourceEdit-delete-button-id' onClick={handleDelete}>Borrar recurso</button>
      </div>
      <div className="ResourceEdit-form">
        <div className="ResourceEdit-input-group">
          <label>Título:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="ResourceEdit-input-group">
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
              autoComplete='off'
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
          <div className='ResourceEdit-MagazineIssue-outer-input-group'>
            <h2> Revista </h2>
            <div className='ResourceEdit-input-group'>
            <label> Nombre de la revista </label>
            <input
              type="text"
              name= "MagazineIssue-title"
              value={formData.properties.MagazineIssue.title}
              onChange={handleMagazineIssueTitleChange}
              onBlur={() => {setTimeout(() => setMagazineIssueNameSuggestions([]), 250)}}
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
            <div className='ResourceEdit-input-group'>
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

        {activatedProperties.Persons > 0 && (
          <div className='ResourceEdit-Persons-outer-input-group'>
            {/* PERSON HEADER */}
            <div className='ResourceEdit-Persons-header-row'>
              <h2> Personas </h2>
              <button className='ResourceEdit-Persons-header-row-button' onClick={()=>{
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
                <div key={index} className='ResourceEdit-Persons-element-outside-div'>
                  <button className='ResourceEdit-Persons-element-remove-button' onClick={()=>{
                    let newProperties = formData.properties;
                    newProperties.Persons.splice(index, 1);
                    setFormData(prevState => ({
                      ...prevState,
                      "properties": newProperties
                    }));
                  }}>
                    <FontAwesomeIcon icon={faMinusCircle} />
                  </button>
                  <div className='ResourceEdit-Persons-element-div'>
                    <label>Nombre:</label>
                    <input
                      type="text"
                      className='ResourceEdit-Persons-element-input'
                      value={getPersonValue(person, index)}
                      onChange={(e) => {handlePersonNameChange(e.target.value, index);}}
                      onBlur={() => {setTimeout(() => setPersonNameSuggestions([]), 250)}}
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
        
        <div className='ResourceEdit-button-outside-container-column'>
          <div className='ResourceEdit-button-outside-container-row'>
            <button id='ResourceEdit-edit-button' className='ResourceEdit-button' onClick={handleSubmit}>Guardar recurso</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  {showDeleteConfirmation && (
    <div className='ResourceEdit-NewProperty-popup-fullscreen'>
      <div className="ResourceEdit-delete-confirmation-popup">
        <p>Estas seguro de que quieres eliminar este recurso?</p>
        <p>No lo podrás recuperar !!</p>
        <div className='ResourceEdit-delete-confirmation-popup-row'>
          <button className='ResourceEdit-button' onClick={() => handleDeleteConfirmation(true)}>Si</button>
          <button className='ResourceEdit-button' id='ResourceEdit-delete-popup-rejection-button' onClick={() => handleDeleteConfirmation(false)}>No</button>
        </div>
      </div>
    </div>
  )}
  {showNewPropertyPopup && (
    <div className='ResourceEdit-NewProperty-popup-fullscreen'>
      <div className='ResourceEdit-NewProperty-popup'>
        <h2>Selecciona las propiedades que quieres agregar...</h2>
        <form className='ResourceEdit-NewProperty-popup-form' id='ResourceEdit-NewProperty-popup-form'>
          <label className='ResourceEdit-NewProperty-popup-form-label'>
            <input 
            className='ResourceEdit-NewProperty-popup-form-input' 
            type="checkbox" 
            name="NewProperty-Form-Date" 
            checked={activatedProperties.Date} 
            onChange={handleCheckboxChange} 
            /> Fecha
          </label>
          <label className='ResourceEdit-NewProperty-popup-form-label'>
            <input 
            className='ResourceEdit-NewProperty-popup-form-input' 
            type="checkbox" 
            name="NewProperty-Form-Competition" 
            checked={activatedProperties.Competition} 
            onChange={handleCheckboxChange}
            /> Competición
          </label>
          <label className='ResourceEdit-NewProperty-popup-form-label'>
            <input 
            className='ResourceEdit-NewProperty-popup-form-input' 
            type="checkbox" 
            name="NewProperty-Form-MagazineIssue" 
            checked={activatedProperties.MagazineIssue} 
            onChange={handleCheckboxChange}
            /> Revista
          </label>
          <label className='ResourceEdit-NewProperty-popup-form-label'>
            <input 
            className='ResourceEdit-NewProperty-popup-form-input' 
            type="checkbox" 
            name="NewProperty-Form-Persons" 
            checked={activatedProperties.Persons} 
            onChange={handleCheckboxChange}
            /> Personas
          </label>
          <button  className='ResourceEdit-button' type="button" 
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

export default ResourceEditPage;
