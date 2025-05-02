
import React, { useState } from 'react';
import { Image } from '../types';
import { cn } from '@/lib/utils';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';

interface ImageCardProps {
  image: Image;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(image.saved || false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    
    if (!isSaved) {
      toast('Imagen guardada', {
        description: `"${image.title}" ha sido añadida a tu colección`,
      });
    } else {
      toast('Imagen eliminada de guardados', {
        description: `"${image.title}" ha sido eliminada de tu colección`,
      });
    }
  };

  const aspectRatio = image.height ? `${Math.min(image.height / 100, 1.8)}` : '1';

  return (
    <div 
      className={cn(
        "rounded-lg overflow-hidden relative cursor-pointer transition-all duration-300",
        { "shadow-lg": isHovered }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ aspectRatio }}
    >
      <div className="w-full h-full">
        <img 
          src={image.src} 
          alt={image.title}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            { "opacity-0": !isLoaded, "opacity-100": isLoaded }
          )}
          onLoad={() => setIsLoaded(true)}
        />
        {!isLoaded && (
          <div className="absolute inset-0 bg-neutral-800 animate-pulse"></div>
        )}
      </div>
      
      {/* Overlay on hover */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 flex flex-col justify-end transition-opacity duration-300",
          { "opacity-0": !isHovered && !isSaved, "opacity-100": isHovered || isSaved }
        )}
      >
        <div className="flex justify-between items-end">
          <h3 className="text-white font-medium text-sm md:text-base line-clamp-2">
            {image.title}
          </h3>
          
          <button 
            onClick={handleSave}
            className={cn(
              "p-2 rounded-full bg-black/30 backdrop-blur-sm transition-all", 
              { "opacity-100": isHovered || isSaved, "opacity-0": !isHovered && !isSaved }
            )}
            aria-label={isSaved ? "Quitar de guardados" : "Guardar imagen"}
          >
            {isSaved ? (
              <BookmarkCheck size={18} className="text-white" />
            ) : (
              <Bookmark size={18} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
