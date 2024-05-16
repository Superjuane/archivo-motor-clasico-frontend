import React, { useState, useEffect } from 'react';
import {useParams, useNavigate}  from 'react-router-dom';
import './ResourceEditPage.css';
import Navbar from '../components/Navbar';

//NEW PROPERTY:
// 1. Add property to resourceToFormData
// 2. Add property render component


function ResourceEditPage() {
  const navigate = useNavigate();

  let { id } = useParams();
  const [dataUploadedSuccessfully, setDataUploadedSuccessfully] = useState(false);
  const [resource, setResource] = useState({
    title: '',
    description: '',
    image: '',
    properties: [],
    creator: '',
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    properties: [],
  });

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };

  const resourceToFormData = (resource) => {
    let result = {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      properties: [],
      creator: resource.creator,
    }

    resource.properties.forEach(p => {
      if(p.Date){
        console.log('Date property is', p.Date.date.split('T')[0]);
        result.properties.push({"Date": p.Date.date.split('T')[0]});
      }
      else if(p.Competition){
        result.properties.push({"Competition": p.Competition.name});
      }
    });
    return result;
  };

  const formatFormData = (formData) => {
    formData.properties.forEach(p => {
      if(p.Date){
        formData.date = p.Date+'T00:00:00Z';
      }
      if(p.Competition){
        formData.competition = p.Competition;
      }
    });  
    return formData;
  };

  useEffect(() => {
    // GET
    fetch('http://localhost:8090/resources/'+id, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched successfully:', data);
        setResource(data);
        setFormData(resourceToFormData(data));
        document.getElementById("ResourceEditPage-edit-button").disabled = false;
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (e) => {
    if(dataUploadedSuccessfully) setDataUploadedSuccessfully(false);
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting:', JSON.stringify(formatFormData(formData)));

    document.getElementById("ResourceEditPage-edit-button").disabled = true;

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
      setDataUploadedSuccessfully(true);
    })
    .catch(error => console.error('Error updating data:', error))
    .finally(() => {
      document.getElementById("ResourceEdit-edit-button").disabled = false;
    });
  };

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
            let data = response.json()
            if(!response.ok) throw {code: response.status, data: data};
            return data;
          })
          .then(data => {
            console.log('Resource deleted successfully');
            alert('El recurso ha sido eliminado correctamente.');
            navigate('/resources');
          })
          .catch((error) => {
            if(error.code === 400){
                console.log("Bad Request")
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

  const propertyComponent = (label, name) => {
    if(formData){
      let prop = formData.properties.find(p => p[label]);
      let index = formData.properties.findIndex(p => p[label]);
      console.log(label+" index"+index)
      if (prop) {
        console.log(label+' property stablished, rendering component '+label);
        console.log(prop)
        return (
          <div className='ResourceEdit-input-group'>
            <label>{label}</label>
            <input
            type={name === "date" ? "date" : "text"}
            name={label}
            value={prop[label]}
            onChange={(e) => {
              let newProperties = formData.properties;
              newProperties[index][label] = e.target.value;
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
  }


  //TODO: move to component
  let dateComponent = propertyComponent("Date", "date");
  

  let competitionComponent = propertyComponent("Competition", "name");
  // if(formData){
  //   let prop = formData.properties.find(p => p.Competition);
  //   let index = formData.properties.findIndex(p => p.Competition);
  //   console.log("competition index"+index)
  //   if (prop) {
  //     console.log('Competition property stablished, rendering component Competition');
  //     console.log(prop)
  //     competitionComponent = (
  //       <div className='input-group'>
  //         <label> Competition</label>
  //         <input
  //         type="text"
  //         name="competition"
  //         value={prop.Competition}
  //         onChange={(e) => {
  //           let newProperties = formData.properties;
  //           newProperties[index].Competition = e.target.value;
  //           setFormData(prevState => ({
  //             ...prevState,
  //             "properties": newProperties
  //           }));
  //         }}
  //       />
  //       </div>

  //     );
  //   }
  // }

  return (
<div>
  <div className="ResourceEdit-container">
    <h1>Edit Resource</h1>
    <br />
    <div className="ResourceEdit-navigate-to-resource-row">
        <button className="ResourceEdit-button" onClick={()=>{navigate('/resources/'+id)}}>Navegar al recurso </button>
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
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
         
        {dateComponent}

        {competitionComponent}

        <div className="ResourceEdit-input-group">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className='ResourceEdit-button-outside-container'>
          <button id='ResourceEdit-edit-button' className='ResourceEdit-button' onClick={handleSubmit}>Subir recurso</button>
          {dataUploadedSuccessfully && <label>Data uploaded successfully!</label>}
        </div>
      </div>
    </div>
  </div>
  {showDeleteConfirmation && (
                <div className="ResourceEdit-delete-confirmation-popup">
                    <p>Estas seguro de que quieres eliminar este recurso?</p>
                    <p>No lo podrás recuperar !!</p>
                    <div className='ResourceEdit-delete-confirmation-popup-row'>
                      <button className='ResourceEdit-button' onClick={() => handleDeleteConfirmation(true)}>Si</button>
                      <button className='ResourceEdit-button' id='ResourceEdit-delete-popup-rejection-button' onClick={() => handleDeleteConfirmation(false)}>No</button>
                    </div>
                  </div>
            )}
</div>
  );
}

export default ResourceEditPage;
