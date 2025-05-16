
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

    // Initialize empty columns
    const newColumns: Image[][] = Array.from({ length: columnCount }, () => []);
    const columnHeights = Array(columnCount).fill(0);
    
    // Clone images to avoid modifying the original array
    const sortedImages = [...images];
    
    // Sort images by height for better distribution (tallest first)
    sortedImages.sort((a, b) => (b.height || 0) - (a.height || 0));
    
    sortedImages.forEach((image) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Add image to the shortest column
      newColumns[shortestColumnIndex].push(image);
      
      // Update the column height
      columnHeights[shortestColumnIndex] += image.height || 250;
    });

    setColumns(newColumns);
  }, [images, columnCount]);

  if (images.length === 0) {
    return null; // Don't render anything if there are no images
  }

  return (
    <div className="masonry-grid">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="masonry-column">
          {column.map((image) => (
            <div key={image.id} className="masonry-item">
              <ImageCard image={image} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
