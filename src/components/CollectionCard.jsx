import React from 'react';
import {useParams} from 'react-router-dom';
import './CollectionCard.css';

const CollectionCard = (collection) => {
    
    const parseTitle = (title) => {
        if (title.length > 10) {
          let words = title.split(' ');
          words.forEach((word, index) => {
            if (word.length > 10) {
              words[index] = '';
              for (let i = 0; i < word.length; i += 10) {
                words[index] += word.slice(i, i + 10) + '- ';
              }
            }
          });
          title = words.join(' ');
        } else {
          for(let i = title.length; i < 17; i++){
            title += ' ';
          }
        }
        return title;
      }
    

    return (
        <div className="ag-courses_item">
            <a href={"/collections/"+collection.collection.id} className="ag-courses-item_link">
                <div className="ag-courses-item_bg"></div>
                
                    <div className="ag-courses-item_title">
                        {parseTitle(collection.collection.title)}
                    </div>

                    {/* <div className="ag-courses-item_date-box">
                    Creada:&nbsp;
                    <span className="ag-courses-item_date">
                        04.11.2022
                    </span>
                </div> */}
            </a>
        </div>
    );
};

export default CollectionCard;