import React from 'react';
import './DynamicProperty.css';
const DynamicProperty = ({ properties }) => {
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
                                // Handle input change here
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