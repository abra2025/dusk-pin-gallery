
import React, { useState } from 'react';
import Header from '@/components/Header';
import MasonryGrid from '@/components/MasonryGrid';
import UploadModal from '@/components/UploadModal';
import { Image, Category } from '@/types';
import { sampleImages } from '@/data/sampleImages';
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
      
      const newImage: Image = {
        id: uuid(),
        src: imageUrl,
        title: data.title,
        description: data.description,
        categories: data.categories,
        saved: false,
        height: 250 * (Math.floor(Math.random() * 3) + 1), // Altura aleatoria para variedad en el grid
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
