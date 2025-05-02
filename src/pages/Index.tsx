
import React, { useState } from 'react';
import Header from '@/components/Header';
import MasonryGrid from '@/components/MasonryGrid';
import UploadModal from '@/components/UploadModal';
import { Image, Category } from '@/types';
import { v4 as uuid } from 'uuid';
import { toast } from 'sonner';

const Index = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]); // Start with empty array instead of sample images

  const handleUploadImage = (data: {
    title: string;
    description: string;
    categories: Category[];
    imageFile: File | null;
  }) => {
    if (data.imageFile) {
      // En una app real, aquí subiríamos la imagen a un servidor
      // Por ahora, usaremos URL.createObjectURL para simular
      const imageUrl = URL.createObjectURL(data.imageFile);
      
      // Generate more varied heights for a better masonry effect
      const randomHeight = () => {
        // Create more varied heights between 200 and 800px
        return Math.floor(Math.random() * 600) + 200;
      };
      
      const newImage: Image = {
        id: uuid(),
        src: imageUrl,
        title: data.title,
        description: data.description,
        categories: data.categories,
        saved: false,
        height: randomHeight(),
      };
      
      setImages([newImage, ...images]);
      toast.success('Imagen subida correctamente');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Header onUploadClick={() => setIsUploadModalOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <MasonryGrid images={images} />
      </main>
      
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadImage}
      />
    </div>
  );
};

export default Index;
