
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MasonryGrid from '@/components/MasonryGrid';
import UploadModal from '@/components/UploadModal';
import { Image, Category } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { getAllImages } from '@/services/imageService';
import { saveImage } from '@/services/imageService';

const Index = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const fetchedImages = await getAllImages();
        setImages(fetchedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Error al cargar las imágenes');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleUploadImage = async (data: {
    title: string;
    description: string;
    categories: Category[];
    imageUrl: string;
    userId: string;
  }) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para subir imágenes');
      return;
    }
    
    try {
      console.log('Uploading image for user:', currentUser.uid);
      
      // Generate more varied heights for a better masonry effect
      const randomHeight = () => Math.floor(Math.random() * 600) + 200;
      
      const newImage = await saveImage({
        title: data.title,
        description: data.description,
        categories: data.categories,
        imageUrl: data.imageUrl,
        userId: data.userId,
        height: randomHeight(),
      });
      
      if (newImage) {
        setImages([newImage, ...images]);
        toast.success('Imagen subida correctamente');
      } else {
        toast.error('Error al guardar la imagen');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Error al guardar la imagen');
    }
  };

  const handleImageClick = (imageId: string) => {
    navigate(`/image/${imageId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Header onUploadClick={() => setIsUploadModalOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <MasonryGrid 
          images={images} 
          loading={loading} 
          onImageClick={handleImageClick}
        />
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
