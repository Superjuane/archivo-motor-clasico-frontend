import { useState, useEffect } from 'react';


const useFetchResourcesIDs = () => {
  const [resourcesIDs, setResourcesIDs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const FetchResourcesIDs = async () => {
        await fetch("http://localhost:8090/resources/ids",{
          headers: {
            'Accept': 'application/json',
          },
        })
        .then((response)=>{
          // console.log(response.json());
          response.json()})
        .then((data)=>{
        //   console.log("hey ya!");
        //   console.log(data);
          setResourcesIDs(data);})
      .catch((err)=>{
        console.log(err.message);
        setError("Error!")}).finally(()=>{setLoading(false)});
    };
    console.log("a");
    FetchResourcesIDs();
    console.log("b");

  }, []);

  return { resourcesIDs, loading, error };
};

export default useFetchResourcesIDs;