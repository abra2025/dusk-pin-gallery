import React, { useEffect, useState, useRef } from 'react';
import { Image } from '../types';
import ImageCard from './ImageCard';

interface MasonryGridProps {
  images: Image[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ images }) => {
  const [columns, setColumns] = useState<Image[][]>([]);
  const [columnCount, setColumnCount] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine number of columns based on screen width
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

  // Distribute images across columns using a greedy algorithm
  // This places each image in the column with the smallest current height
  useEffect(() => {
    if (images.length === 0) {
      setColumns([]);
      return;
    }

    // Initialize columns with empty arrays
    const newColumns: Image[][] = Array.from({ length: columnCount }, () => []);
    
    // Initialize column heights
    const columnHeights = Array(columnCount).fill(0);

    // Distribute images
    images.forEach((image) => {
      // Find column with minimum height
      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));

      // Add image to that column
      newColumns[minHeightIndex].push(image);

      // Update column height - use a default height if not specified
      columnHeights[minHeightIndex] += image.height || 250;
    });

    setColumns(newColumns);
  }, [images, columnCount]);

  if (images.length === 0) {
    return null; // Don't render anything if there are no images
  }

  return (
    <div ref={containerRef} className="flex gap-4">
      {columns.map((column, columnIndex) => (
        <div key={`column-${columnIndex}`} className="flex flex-col gap-4 flex-1">
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