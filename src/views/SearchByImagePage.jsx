import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SearchByImagePage.css';

const SearchByImagePage = () => {
    const id = useParams();
    const URL = 'http://localhost:8090'
    const [originalResource, setOriginalResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);


    useEffect(() => {
        fetch(URL+'/resources/'+id.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((res) => res.json())
        .then((data) => {
            setOriginalResource(data);
            fetchImages(data);
        })
        .catch((error) => {
            setError(error);
            setLoading(false);
        });
    }, [id]);

    const fetchImages = async (resource) => {
        fetch(URL+'/resources/imagesearch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: resource.image, limit: 15 })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Data fetched")
            setData(data);
            setLoading(false);
            console.log(data);
        })
        .catch((error) => {
            setError(error);
            setLoading(false);
        });
    }

    
    if (loading) {
        return <div className='SearchByImagePage-outside-div'>
            Cargando...
        </div>;
    }

    return (
        <div className='SearchByImagePage-outside-div'>
            <div className='SearchByImagePage-header'>
                <h1>Imagenes similares a: </h1>
                <a href={'/resources/'+originalResource.id}>{"\""+originalResource.title+"\""}</a>
            </div>
            <div className='SearchByImagePage-body-outside'>
                {data.similar && data.similar.length > 0 && (<div className='SearchByImagePage-body'>
                    {data.similar.map((resource) => (
                        <a className='SearchByImagePage-body-element' key={resource.id} href={'/resources/'+resource.id}>
                            <h2>{resource.title}</h2>
                            <img src={"data:image/png;base64,"+ resource.image} alt={resource.title} />
                        </a>
                    ))}
                </div>)}

                {(!data.similar || data.similar.length < 1) && 
                (<div className='SearchByImagePage-body-no-similars'>
                    <h2>
                        No se encontraron imagenes similares
                    </h2>
                </div>)
                }

                {data.lessSimilar && data.lessSimilar.length > 0 && (
                    <div className='SearchByImagePage-body-lessSimilar'>
                        <h1> Aqui tienes algunas imagenes recomendadas </h1>
                        <div className='SearchByImagePage-body-lessSimilar-grid'>
                            {data.lessSimilar.map((resource) => (
                                <a className='SearchByImagePage-body-element-lessSimilar' key={resource.id} href={'/resources/'+resource.id}>
                                    <h2>{resource.title}</h2>
                                    <img src={"data:image/png;base64,"+ resource.image} alt={resource.title} />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SearchByImagePage;