import React, { useState, useEffect } from "react";

import "./ResourcesExplorationPage.css";

const ResourceExplorationPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function ImageGridItem({ image }) {
        const style = {
            width: '150px',
            gridColumnEnd: `span ${getSpanEstimate(image.width)}`,
            gridRowEnd: `span ${getSpanEstimate(image.height)}`,
        }


        return <a href={"/resources/"+image.id}>
                    <img style={style} src={image.url} alt={image.alt} />
                </a>
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
                setImages(data);
            
        }).catch((err)=>{
            console.log(err.message);
            setError("Error!")
        }).finally(()=>{
            setLoading(false)
        });
}, []);

useEffect(() => {
    if(loading === false){
        // Calculate the size of each image grid item dynamically
        const imageGrid = document.getElementById('imageGrid');
        const gridItems = imageGrid.querySelectorAll('.grid-item');
        const containerWidth = imageGrid.offsetWidth;
        const numColumns = Math.floor(containerWidth / 200); // Adjust the value as needed

        gridItems.forEach(item => {
            item.style.width = `${containerWidth / numColumns}px`;
        });
    }
}, [images, loading]); // Run the effect whenever images change

    if (loading) {
        return <p>Loading...</p>;
    }
    
    if (error) {
        return <p>Error!: {error}</p>;
    }

    const listImages = images.map((img) => 
        <ImageGridItem image={{"id":img.id,"url":'data:image/jpeg;base64,'+img.image, "alt":"fetched"}} />
    );


return (
    <div className="App">
            <div className="gridContainer" id="imageGrid">
                {listImages}
            </div>
        </div>
    );
};

export default ResourceExplorationPage;
