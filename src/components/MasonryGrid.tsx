
import React, { useEffect, useState } from 'react';
import { Image } from '../types';
import ImageCard from './ImageCard';

interface MasonryGridProps {
  images: Image[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ images }) => {
  const [columns, setColumns] = useState<Image[][]>([]);
  const [columnCount, setColumnCount] = useState(4);

  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) return 2; // sm
      if (width < 768) return 3; // md
      if (width < 1024) return 4; // lg
      return 5; // xl+
    };

    const updateColumnCount = () => {
      setColumnCount(calculateColumns());
    };

    // Set initial column count
    updateColumnCount();

    // Add event listener for window resize
    window.addEventListener('resize', updateColumnCount);

    // Clean up
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  useEffect(() => {
    if (images.length === 0) {
      setColumns([]);
      return;
    }

    // Distribute images into columns to create masonry effect
    const newColumns: Image[][] = Array.from({ length: columnCount }, () => []);
    
    images.forEach((image, index) => {
      // Find the column with the least height
      const columnIndex = index % columnCount;
      newColumns[columnIndex].push(image);
    });

    setColumns(newColumns);
  }, [images, columnCount]);

  if (images.length === 0) {
    return null; // Don't render anything if there are no images
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-3 md:gap-4">
          {column.map((image) => (
            <div key={image.id} className="w-full">
              <ImageCard image={image} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
