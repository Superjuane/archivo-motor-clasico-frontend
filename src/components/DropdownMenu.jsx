import React from "react";
import { useState, useEffect } from 'react';
import "./DropdownMenu.css";
import { Link } from "react-router-dom";


const DropdownMenu = () => {
    const [ids, setIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8090/resources/ids",{
            headers: {
                'Accept': 'application/json',
            },
        })
            .then((response)=>
                response.json())
            .then((data)=>{
                console.log("Resources IDS gotten");

                let list = [];
                for (let i = 0; i < data.length; i++) {
                    list.push(JSON.stringify(data[i]));
                }

                setIds(list);

                setIds(data);

        }).catch((err)=>{
            console.log(err.message);
            setError("Error!")
        }).finally(()=>{
            setLoading(false)
        });
}, []);

if (loading) {
    return <p>Loading...</p>;
}

if (error) {
    return <p>Error!: {error}</p>;
}

const listItems = ids.map((id) =>
    <li key={id.id}>
        <Link to={"/resources/"+id} className="dropdown-menu-item-list">{id}</Link>
    </li>
);

  return (
    <div className="dropdown-menu">
      <ul>
        {listItems}
      </ul>
    </div>
  );

};

export default DropdownMenu;