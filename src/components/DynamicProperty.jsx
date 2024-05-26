import React, { useState } from 'react';import './DynamicProperty.css';

// const DynamicPropertyRecursive = ({ properties }) => {

// }

// const RenderProperty = ({ property }) => {
//     return (
//         <div></div>
//     )}

const DynamicProperty = ({ props  }) => {
    const [properties, setproperties] = useState(props);
    console.log(props);
    console.log(properties);
    if(properties.length === 0) setproperties(props);
    return (
        <div className='DynamicProperty-external'>
            {properties.map((property, index) => (
                <div className='DynamicProperty-internal' key={index}>
                    <label className='DynamicProperty-label' htmlFor={`property-${index}`}>{property.name}</label>
                    <div className='DynamicProperty-complex-div'>
                    {property.type === 'complex' ? (
                        property.value.map((item, itemIndex) => (
                            <div  key={itemIndex}>
                                <label className='DynamicProperty-complex-label' htmlFor={`property-${index}-${itemIndex}`}>{item.name}</label>
                                <input
                                    className='DynamicProperty-complex-input'
                                    type={item.type}
                                    id={`property-${index}-${itemIndex}`}
                                    value={item.value}
                                    onChange={(e) => {
                                        // Handle input change here
                                    }}
                                />
                            </div>
                        ))
                    ) : (
                        <input
                            className='DynamicProperty-input'
                            type={property.type}
                            id={`property-${index}`}
                            value={property.value}
                            onChange={(e) => {
                            }}
                        />
                    )}
                    </div>
                </div>
            ))}
        </div>
    );
};


export default DynamicProperty;