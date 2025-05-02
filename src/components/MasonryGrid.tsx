import React, { useState, useEffect, useRef } from "react";
import { Image } from '../types';
import ImageCard from './ImageCard';
import { supabase } from "@/lib/supabase"; // Adjust path if needed

interface MasonryGridProps {
  images?: Image[];
  uploadedImage?: {
    id: string;
    url: string;
    title: string;
    description: string;
    width: number;
    height: number;
    categories: string[];
  };
  deletedImageId?: string | null;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ 
  images: propImages, 
  uploadedImage, 
  deletedImageId 
}) => {
  const [images, setImages] = useState<Image[]>(propImages || []);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [columnCount, setColumnCount] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 12;

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

  // Fetch images from Supabase if not provided as props
  const fetchImages = async (page = 0) => {
    console.log("Fetching images, page:", page);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("images")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      // Process images to add URLs
      const processedImages = await Promise.all(
        (data || []).map(async (image) => {
          const {
            data: { publicUrl },
          } = supabase.storage.from("images").getPublicUrl(image.storage_path);

          return {
            ...image,
            url: publicUrl,
          } as Image;
        })
      );

      if (page === 0) {
        setImages(processedImages);
      } else {
        setImages((prev) => [...prev, ...processedImages]);
      }

      // Check if there are more images to load
      if (count !== null) {
        setHasMore(from + processedImages.length < count);
      }

      return processedImages;
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  };

  // Initial load
  useEffect(() => {
    // Only fetch if images weren't provided as props
    if (!propImages) {
      const loadInitialImages = async () => {
        setLoading(true);
        await fetchImages(0);
        setLoading(false);
      };
      loadInitialImages();
    } else {
      setImages(propImages);
      setLoading(false);
    }
  }, [propImages]);

  // Update images when a new image is uploaded
  useEffect(() => {
    if (uploadedImage && !loading) {
      // Create a new image object with the uploaded image data
      const newImage: Image = {
        id: uploadedImage.id,
        title: uploadedImage.title,
        description: uploadedImage.description,
        storage_path: "", // This is stored in the database but not needed here
        width: uploadedImage.width,
        height: uploadedImage.height,
        url: uploadedImage.url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categories: uploadedImage.categories,
      };

      // Add the new image to the beginning of the array
      setImages((prev) => [newImage, ...prev]);
    }
  }, [uploadedImage, loading]);

  // Remove deleted images from the grid
  useEffect(() => {
    if (deletedImageId) {
      setImages((prevImages) => prevImages.filter((image) => image.id !== deletedImageId));
    }
  }, [deletedImageId]);

  // Function to load more images
  const loadMoreImages = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const page = Math.ceil(images.length / PAGE_SIZE);
    await fetchImages(page);
    setLoadingMore(false);
  };

  // Distribute images across columns using a greedy algorithm
  // This places each image in the column with the smallest current height
  const distributeImages = (images: Image[], columnCount: number) => {
    // Initialize columns with empty arrays
    const columns: Image[][] = Array.from({ length: columnCount }, () => []);

    // Initialize column heights
    const columnHeights = Array(columnCount).fill(0);

    // Distribute images
    images.forEach((image) => {
      // Find column with minimum height
      const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));

      // Add image to that column
      columns[minHeightIndex].push(image);

      // Calculate display height based on aspect ratio
      let displayHeight: number;
      
      if (image.height && image.width) {
        const aspectRatio = image.width / image.height;
        // Calculate display height based on approximate column width
        // Using 300 as a base column width for calculation
        displayHeight = 300 / aspectRatio;
      } else {
        // Default height if dimensions aren't available
        displayHeight = 300;
      }

      columnHeights[minHeightIndex] += displayHeight;
    });

    return columns;
  };

  // Only distribute images if we have images and aren't loading
  const imageColumns = loading || images.length === 0 
    ? [] 
    : distributeImages(images, columnCount);

  // Don't render anything if there are no images
  if (images.length === 0 && !loading) {
    return null;
  }

  return (
    <div>
      {loading ? (
        // If you want loading state, implement it here
        <div>Loading...</div>
      ) : (
        // Masonry grid layout
        <div ref={containerRef} className="flex gap-4">
          {imageColumns.map((column, columnIndex) => (
            <div key={`column-${columnIndex}`} className="flex flex-col gap-4 flex-1">
              {column.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && hasMore && (
        <button 
          onClick={loadMoreImages} 
          disabled={loadingMore}
          className="mt-8 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {loadingMore ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default MasonryGrid;