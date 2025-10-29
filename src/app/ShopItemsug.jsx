import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const ShopItemsuggestion = ({ item, truncateDescription }) => {
    const [hovered, setHovered] = useState(false);
    const [currentImage, setCurrentImage] = useState(1);
  
    const getUniqueRandomImage = (current, max) => {
      if (max === 1) return 1; // If there's only one image, always return 1
      let newImage;
      do {
        newImage = Math.floor(Math.random() * max) + 1;
      } while (newImage === current);
      return newImage;
    };
  
    useEffect(() => {
      if (hovered) {
        setCurrentImage(prevImage => getUniqueRandomImage(prevImage, item.imageCount));
      } else {
        setCurrentImage(1);
      }
    }, [hovered, item.imageCount]);
    const preventDefaultBehavior = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    return (
      <Link to={`/product/${item.id}`} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <div 
          className="h-48 flex items-center justify-center overflow-hidden"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={()=> setHovered(true)}
          onTouchEnd={()=>setHovered(false)}

        >
          <img
            src={`/${item.folder}/${currentImage}.webp`}
            alt={item.name}
            className="w-full h-full object-fit select-none"
            onContextMenu={preventDefaultBehavior}
            onTouchStart={preventDefaultBehavior}
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              KhtmlUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              userSelect: 'none',
            }}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-[#4A3C31] mb-2 line-clamp-2">{item.name}</h3>
          <p className="text-sm text-[#4A3C31] mb-2 flex-grow line-clamp-2">{truncateDescription(item.description)}</p>
          <p className="text-[#1A9D8F] font-bold mt-auto">
            {item.discount ? item.discount : item.price}
            <span className='line-through ml-1 text-[0.8em]'>{item.discount ? item.price : null}</span>
          </p>
        </div>
      </Link>
    );
  };
  export default ShopItemsuggestion;