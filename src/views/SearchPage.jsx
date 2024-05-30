import React, { useState, useEffect } from 'react';
import './SearchPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleMinus, faSquarePlus, faXmark } from '@fortawesome/free-solid-svg-icons';

function SearchPage() {
  
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };
  const [competitionsOptions, setCompetitionsOptions] = useState([]);
  const [magazineNameOptions, setMagazineNameOptions] = useState([]);
  const [magazineNumberOptions, setMagazineNumberOptions] = useState([]);
  const [personsOptions, setPersonsOptions] = useState([]);
  const [personsActiveSlots, setPersonsActiveSlots] = useState(1);

  //FORM DATA TO SUBMIT
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [competition, setCompetition] = useState('');
  const [magazineName, setMagazineName] = useState('');
  const [magazineNumber, setMagazineNumber] = useState('');
  const [persons, setPersons] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    // GET
    fetch('http://localhost:8090/resources/properties/competitions', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Competitions fetched successfully:', data);
        setCompetitionsOptions(data);
      })
      .catch(error => console.error('Error fetching data:', error));

      fetch('http://localhost:8090/resources/properties/magazines', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('MagazineNames fetched successfully:', data);
        setMagazineNameOptions(data);
      })
      .catch(error => console.error('Error fetching data:', error));

      fetch('http://localhost:8090/resources/properties/persons', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then (response => response.json())
    .then (data => {
      setPersonsOptions(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setPersonsOptions(['A', 'B', 'C', 'D'])
    });

  }, []);

  const handleMagazineNameIsSet = (value) => {
    setMagazineName(value);
    console.log("magazine is set to: ", value);
    console.log("fetching magazine numbers");
    fetch('http://localhost:8090/resources/properties/magazineNumbers?magazine='+value, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('MagazineNumbers fetched successfully:', data);
        setMagazineNumberOptions(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }


  const handleSubmit = async (e) => {
    setResults([]);
    setLoading(true);
    console.log('Form data:', title, description, date1, date2, competition);
    
    let fullUrl = "http://localhost:8090/resources?"
    if(date1){
      //date: "1996-10-10T00:00:00Z"
        fullUrl += "date="+date1+"T00:00:00Z&"
    }
    if(date2){
        fullUrl += "date="+date2+"T00:00:00Z&"
    }
    if(competition !== ''){
        fullUrl += "competition="+competition+"&"
    }
    if(title !== ''){
        fullUrl += "title="+title+"&"
    }
    if(description !== ''){
        fullUrl += "description="+description+"&"
    }
    if(magazineName !== ''){
        fullUrl += "magazine="+magazineName+"&"
    }
    if(magazineNumber !== ''){
        fullUrl += "number="+magazineNumber+"&"
    }
    Array.from({ length: personsActiveSlots }, (_, index) => {
      if(persons[index] !== '' && persons[index] !== null){
        fullUrl += "persons="+persons[index]+"&"
      }
    });

    if(fullUrl.endsWith("&")){
        fullUrl = fullUrl.slice(0, -1)
    }

    console.log(fullUrl);

    fetch(fullUrl, {
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log("\n================ data ====================");
        console.log(data);
        console.log("==========================================\n");
        let resources = [];
        for(let i = 0; i < data.length; i++){
          let resource;
          let image;
          if(data[i].type === "StringBase64"){
            image = 'data:image/jpeg;base64,'+data[i].image;
          } else {image = data[i].image;}

            let text = data[i].title;
            let id = data[i].id;

            resource = {text, image, id};
            resources.push(resource);
        }
        setResults(resources);
      })
      .catch(err => {
        console.error(err.message);
        setError("Error: "+ err.message);
      })
      .finally(() => setLoading(false));
  };

  let listImages;
  // let result;

  if(loading === false && error === '' && results.length > 0){
    listImages = results.map((img, index) =>
     <div key={index} style={{borderBottom:'1px solid black'}}>
        <p>{index + " -->   " + img.text}</p>
        <div>{img.id}</div>
        <img src={img.image} alt='fetched' style={{'maxWidth':'150px'}}></img>
     </div>
    );
    // result = (<div>
    //   <h1>Image</h1>
    //   <p>{formData.title}</p>
    //   <div className='image-container'>
    //     <img className='image' src={image} alt="Fetched " />
    //     </div>
    // </div>)
  }

  const handleNewPersonAdded = (value, index) => {
    let newPersons = persons;
    console.log("persons state:")
    console.log(newPersons);

    if(value === null){
      newPersons.splice(index, 1);
    }

    else if(value === '-- selecciona una persona --'){
      newPersons[index] = '';
    }

    else{ 
      newPersons[index] = value;
    }

    console.log("final state");
    console.log(newPersons);

    setPersons(newPersons);
  }

  return (
    <div className='SearchPage-outside-container'>
    <h1>Búsqueda de recursos</h1>
    <div /*onSubmit={handleSubmit}*/ className='SearchPage-form'>

      <div className='SearchPage-form-element-row'>
        <label className='SearchPage-form-label'>
          Título:
          </label>
          <input className='SearchPage-form-input-text' type="text" name="title" onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className='SearchPage-form-element-row'>
          <label className='SearchPage-form-label'>
            Descripción:
          </label>
          <input className='SearchPage-form-input-text' type="text" name="description" onChange={(e)=>setTitle(e.target.value)} />
      </div>

      <div className='SearchPage-form-element-row-dates'>
        <div className='SearchPage-form-element-row-inside'>
          <label className='SearchPage-form-label'>
            Fecha de inicio:
          </label>
          <input className='SearchPage-form-input-text' type="date" name="date1" onChange={(e)=>setDate1(e.target.value)} />
        </div>
        <div className='SearchPage-form-element-row-inside'>
          <label className='SearchPage-form-label'>
            Fecha de fin:
          </label>
          <input className='SearchPage-form-input-text' type="date" name="date2" onChange={(e)=>{setDate2(e.target.value)}} />
        </div>
      </div>
      
      <div className='SearchPage-form-element-row'>
        <label className='SearchPage-form-label'>
          Competición:
        </label>
        <select className='SearchPage-form-input-text' name="competition" onChange={(e)=>setCompetition(e.target.value)}>
        <option selected value=""> -- selecciona una competición -- </option>
          {competitionsOptions && competitionsOptions.map((option, index) => {
            return <option key={"competition-option-"+index} value= {option} > {option} </option>
          })}
        </select>
      </div>

      <div className='SearchPage-form-element-row'>
        <label className='SearchPage-form-label'>
          Revista:
        </label>
        <select className='SearchPage-form-input-text' name="competition" onChange={(e)=>handleMagazineNameIsSet(e.target.value)}>
        <option selected value=""> -- selecciona una revista -- </option>
          {magazineNameOptions && magazineNameOptions.map((option, index) => {
            return <option key={"competition-option-"+index} value= {option} > {option} </option>
          })}
        </select>
      </div>

      {magazineName && (<div className='SearchPage-form-element-row'>
        <label className='SearchPage-form-label'>
          Número de revista:
        </label>
        <select className='SearchPage-form-input-text' name="competition" onChange={(e)=>setMagazineNumber(e.target.value)}>
        <option selected value=""> -- selecciona una persona -- </option>
          {magazineNumberOptions && magazineNumberOptions.map((option, index) => {
            return <option key={"competition-option-"+index} value= {option} > {option} </option>
          })}
        </select>
      </div>)}

      <div className='SearchPage-form-element-row'>
        <button className='SearchPage-form-date-erease' onClick={()=>{setPersonsActiveSlots(personsActiveSlots+1)}}>
            <FontAwesomeIcon icon={faSquarePlus} />
        </button>
        <label className='SearchPage-form-label'>
          Persona:
        </label>
        <select className='SearchPage-form-input-text' name="competition" onChange={(e)=>handleNewPersonAdded(e.target.value, 0)}>
        <option selected value=""> -- selecciona una persona -- </option>
          {personsOptions && personsOptions.map((option, index) => {
            return <option key={"competition-option-"+index} value= {option} > {option} </option>
          })}
        </select>
      </div>

      {Array.from({ length: personsActiveSlots-1 }, (_, index) => (
          <div className='SearchPage-form-element-row'>
            {index === personsActiveSlots-2 ? 
            (<button className='SearchPage-form-date-erease' 
                onClick={()=>{
                  setPersonsActiveSlots(personsActiveSlots-1);
                  handleNewPersonAdded(null, index+1)
                }}>
                <FontAwesomeIcon icon={faCircleMinus} />
            </button>)
            :
            (<button className='SearchPage-form-date-erease-invisible' disabled>
                <FontAwesomeIcon icon={faCircleMinus} />
            </button>)
            }
            <label className='SearchPage-form-label'>
            Persona:
            </label>
            <select className='SearchPage-form-input-text' name="competition" onChange={(e)=>handleNewPersonAdded(e.target.value, index+1)}>
            <option selected value=""> -- selecciona una persona -- </option>
              {personsOptions && personsOptions.map((option, index) => {
                return <option key={"competition-option-"+index} value= {option} > {option} </option>
              })}
            </select>
          </div>
      ))}

      <button onClick={()=>handleSubmit()}>Submit</button>
    </div>
      <br />
      {listImages}
    </div>
  );
}

export default SearchPage;
