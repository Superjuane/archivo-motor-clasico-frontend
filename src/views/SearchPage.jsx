import React, { useState, useEffect } from 'react';

function SearchPage() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [competition, setCompetition] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);


  const handleSubmit = async (e) => {
    setResults([]);
    setLoading(true);
    console.log('Form data:', title, description, date1, date2, competition);
    e.preventDefault();
    
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
     <div key={index}>
        <p>{index + " -->   " + img.title}</p>
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

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <label>
        Title:&nbsp;&nbsp;
        <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} />
      </label>
      <br />
      <label>
        Description:&nbsp;&nbsp;
        <input type="text" name="description" onChange={(e)=>setTitle(e.target.value)} />
      </label>
      <br />
      <label>
        Date inicio:&nbsp;&nbsp;
        <input type="date" name="date1" onChange={(e)=>setDate1(e.target.value)} />
      </label>
      <br />
      <label>
        Date fin:&nbsp;&nbsp;
        <input type="date" name="date2" onChange={(e)=>setDate2(e.target.value)} />
      </label>
      <br />
      <label>
        Competition:&nbsp;&nbsp;
        <select name="competition" onChange={(e)=>setCompetition(e.target.value)}>
        <option selected value=""> -- select an option -- </option>
          <option value="Turismo_Carretera">Turismo Carretera</option>
          <option value="Rally">Rally</option>
        </select>
      </label>
      <br />
      {/* <label>
        Image (Base64 encoded):
        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData(prevState => ({
              ...prevState,
              image: reader.result
            }));
          };
          reader.readAsDataURL(file);
        }} />
      </label> */}
      <br />
      <button type="submit">Submit</button>
    </form>
      <br />
      {listImages}
    </div>
  );
}

export default SearchPage;
