import React, { useState, useEffect } from "react";
import "./ResourcesExplorationPage.css";

const ResourceExplorationPage = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function ImageGridItem({ image }) {
        const style = {
            width: '150px',
            gridColumnEnd: `span ${getSpanEstimate(image.width)}`,
            gridRowEnd: `span ${getSpanEstimate(image.height)}`,
        }


        return (
            <div className="ResourceExploration-ImageGridItem-div-outside" style={{"border-style":"solid", "border-color":"red"}}>
                <div className="ResourceExploration-ImageGridItem-div-inside">
                    <a href={"/resources/"+image.id} >
                        <div>
                            <img style={style} src={image.url} alt={image.alt} />
                            <p>{image.title}</p>
                        </div>
                    </a>
                </div>
            </div>)
    }

    function getSpanEstimate(size) {
        if (size > 250) {
            return 2
        }
        return 1
    }

    useEffect(() => {
        fetch('http://localhost:8090/resources',{
            headers: {
                'Accept': 'application/json',
            },
        }) 
            .then((response) => 
                response.json())
            .then((data) => {
                console.log(" -------------- data: --------------");
                console.log(data);
                setResources(data);
            
        }).catch((err)=>{
            console.log(err.message);
            setError("Error!")
        }).finally(()=>{
            setLoading(false)
        });
}, []);

// useEffect(() => {
//     if(loading === false){
//         // Calculate the size of each image grid item dynamically
//         const imageGrid = document.getElementById('imageGrid');
//         const gridItems = imageGrid.querySelectorAll('.grid-item');
//         const containerWidth = imageGrid.offsetWidth;
//         const numColumns = Math.floor(containerWidth / 200); // Adjust the value as needed

//         gridItems.forEach(item => {
//             item.style.width = `${containerWidth / numColumns}px`;
//         });
//     }
// }, [resources, loading]); // Run the effect whenever images change

    if (loading) {
        return(
        <div className="ResourcesExplorationPage-page">
            <h1>Explorar recursos</h1>
            <p>Cargando...</p>
        </div>
        );
    }
    
    if (error) {
        return(
            <div className="ResourcesExplorationPage-page">
                <h1>Explorar recursos</h1>
                <p>{error}</p>
            </div>
            );
    }

    // const listImages = images.map((img) => 
    //     <ImageGridItem image={{"id":img.id,"url":'data:image/jpeg;base64,'+img.image, "alt":img.title, "title":img.title}} />
    // );


return (
    <div className="ResourcesExplorationPage-page">
        <h1>Explorar recursos</h1>
        <div className='ResourcesExplorationPage-results-outside-container'>
        {resources && resources.length > 0 && (<div className='ResourcesExplorationPage-results-body'>
          {resources.map((resource) => (
            <a className='ResourcesExplorationPage-results-body-element' key={resource.id} href={'/resources/'+resource.id}>
              <h2>{resource.text}</h2>
              <img src={"data:image/jpg;base64,"+resource.image} alt={resource.title} />
            </a>
          ))}
        </div>)}
      </div>
    </div>
    );
};

export default ResourceExplorationPage;
