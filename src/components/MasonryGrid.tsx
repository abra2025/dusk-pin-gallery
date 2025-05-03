
import React, { useEffect, useState } from 'react';
import { Image } from '../types';
import ImageCard from './ImageCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useWindowSize } from '@/hooks/use-window-size';

interface MasonryGridProps {
  images: Image[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ images }) => {
  const [imageColumns, setImageColumns] = useState<Image[][]>([]);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowSize();

  // Determine number of columns based on screen width
  const getColumnCount = () => {
    if (width < 640) return 2; // sm
    if (width < 768) return 3; // md
    if (width < 1024) return 4; // lg
    return 5; // xl and above
  };

  // Distribute images across columns using a greedy algorithm
  // This places each image in the column with the smallest current height
  const distributeImages = (images: Image[], columnCount: number) => {
    if (images.length === 0) return [];
    
    // Initialize columns with empty arrays
    const columns: Image[][] = Array.from({ length: columnCount }, () => []);
    
    // Initialize column heights
    const columnHeights = Array(columnCount).fill(0);
    
    // Clone and ensure all images have a height property
    const processedImages = [...images].map(img => ({
      ...img,
      height: img.height || 300, // Default height if not specified
    }));
    
    // Distribute images
    processedImages.forEach((image) => {
      // Find column with minimum height
      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Add image to that column
      columns[minHeightIndex].push(image);
      
      // Update column height
      columnHeights[minHeightIndex] += image.height;
    });
    
    return columns;
  };

  useEffect(() => {
    const columnCount = getColumnCount();
    const columns = distributeImages(images, columnCount);
    setImageColumns(columns);
  }, [images, width]); // Re-distribute when images change or screen size changes

  if (images.length === 0) {
    return null; // Don't render anything if there are no images
  }

  return (
    <div className="w-full">
      {loading ? (
        // Skeleton loading state
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="w-full">
              <Skeleton className="w-full h-[300px] rounded-lg" />
              <div className="mt-2">
                <Skeleton className="h-4 w-3/4 mb-1" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Masonry grid layout
        <div className="flex gap-4">
          {imageColumns.map((column, columnIndex) => (
            <div key={`column-${columnIndex}`} className="flex flex-col gap-4 flex-1">
              {column.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MasonryGrid;
