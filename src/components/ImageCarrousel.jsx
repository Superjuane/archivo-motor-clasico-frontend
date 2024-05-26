import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageCarousel.css';

const images = [
  "https://static.zara.net/photos///2024/V/0/3/p/5767/521/712/2/w/2048/5767521712_3_1_1.jpg?ts=1707751046435",
  "https://static.zara.net/photos///2024/V/0/1/p/5862/059/811/2/w/2048/5862059811_3_1_1.jpg?ts=1707511076020",
  "https://static.zara.net/photos///2024/V/0/1/p/6147/105/427/2/w/2048/6147105427_3_1_1.jpg?ts=1710507096429",
  "https://static.zara.net/photos///2024/V/0/1/p/2513/750/500/2/w/2048/2513750500_3_1_1.jpg?ts=1706866499269",
  "https://static.zara.net/photos///2024/V/0/2/p/0840/465/444/2/w/2048/0840465444_3_1_1.jpg?ts=1712655394433",
  "https://static.zara.net/photos///2024/V/0/3/p/4442/660/712/2/w/2048/4442660712_3_1_1.jpg?ts=1705317447332",
  "https://static.zara.net/photos///2024/V/1/3/p/4546/330/010/2/w/2048/4546330010_3_1_1.jpg?ts=1708438825678",
  "https://static.zara.net/photos///2023/I/1/3/p/1251/230/800/2/w/2048/1251230800_3_1_1.jpg?ts=1697466806411",
  "https://static.zara.net/photos///2023/I/0/2/p/4767/488/723/2/w/2048/4767488723_3_1_1.jpg?ts=1685607087434",
  "https://static.zara.net/photos///2023/I/0/3/p/6887/602/250/2/w/2048/6887602250_3_1_1.jpg?ts=1689860680377",
  "https://static.zara.net/photos///2023/I/0/2/p/5847/261/800/2/w/2048/5847261800_3_1_1.jpg?ts=1687417901991",
  "https://static.zara.net/photos///2024/V/0/1/p/2910/004/701/2/w/2048/2910004701_3_1_1.jpg?ts=1708441849214"
];

const ImageCarousel = () => {
  const listRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate(); // Obtiene el objeto de navegación

  useEffect(() => {
    const listNode = listRef.current;
    if (listNode && currentIndex >= 0 && currentIndex < images.length) {
      const imgNode = listNode.children[currentIndex].querySelector("img");
      imgNode.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  }, [currentIndex]);

  const scrollToImage = (direction) => {
    setCurrentIndex(prevIndex => {
      if (direction === 'prev') {
        return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      } else {
        return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      }
    });
  };

  const handleImageClick = (index) => {
    // Guarda la URL de la imagen seleccionada en el localStorage
    localStorage.setItem('selectedImage', images[index]);
    // Navega a Detail.jsx
    navigate('/detail');
  };

  return (
    <div className="main-container">
      <div className='leftArrow' onClick={() => scrollToImage('prev')}>&#10092;</div>
      <div className="container-images">
        <ul ref={listRef}>
          {images.map((image, index) => (
            <li key={index} onClick={() => handleImageClick(index)}>
              <img src={image} alt={`Image ${index}`} />
            </li>
          ))}
        </ul>
      </div>
      <div className="dots-container">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`dot-container-item ${idx === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(idx)}
          >
            &#9865;
          </div>
        ))}
      </div>
      <div className='rightArrow' onClick={() => scrollToImage('next')}>&#10093;</div>
    </div>
  );
};

export default ImageCarousel;
