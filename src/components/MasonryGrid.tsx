
import React from 'react';
import { Image } from '../types';
import ImageCard from './ImageCard';

interface MasonryGridProps {
  images: Image[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ images }) => {
  // Distribuir las imágenes en columnas para crear un efecto masonry
  const getColumnCount = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 2; // sm
      if (width < 768) return 3; // md
      if (width < 1024) return 4; // lg
      return 5; // xl+
    }
    return 4; // Default column count
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {images.map((image) => (
        <div key={image.id} className="masonry-grid-item">
          <ImageCard image={image} />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
