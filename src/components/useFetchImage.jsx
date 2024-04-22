import { useState, useEffect } from 'react';

// const useFetchImage = () => {
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchImage = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/resource",{
//           headers: {
//             'Accept': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch image. Status: ${response.status}`);
//         }

//         // console.log(response.json())

//         const img = response.json().image;
//         console.log(img)
//         // const imageUrl = URL.createObjectURL(imageData);

//         setImage(img);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchImage();
//   }, []);

//   return { image, loading, error };
// };

const useFetchImage = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
        await fetch("http://localhost:8090/resource",{
          headers: {
            'Accept': 'application/json',
          },
        })
        .then((response)=>{
          // console.log(response.json());
          response.json()})
        .then((data)=>{
          console.log("hey ya!");
          console.log(data);
          setImage(data.imageUrl);})
      .catch((err)=>{
        console.log(err.message);
        setError("Error!")}).finally(()=>{setLoading(false)});
    };
    console.log("a");
    fetchImage();
    console.log("b");

  }, []);

  return { image, loading, error };
};

export default useFetchImage;