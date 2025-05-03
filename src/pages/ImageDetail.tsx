
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getImageById, deleteImage, toggleLikeImage, toggleSaveImage } from '@/services/imageService';
import { Image } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Trash, Heart, BookmarkCheck, Upload, Bookmark, HeartOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import UploadModal from '@/components/UploadModal';

const ImageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchImage = async () => {
      if (!id) return;
      setLoading(true);
      
      try {
        const imageData = await getImageById(id);
        setImage(imageData);
        
        // Check if the current user has liked or saved this image
        // This would typically come from the backend
        setIsLiked(imageData?.liked || false);
        setIsSaved(imageData?.saved || false);
      } catch (error) {
        console.error('Error fetching image:', error);
        toast.error('No se pudo cargar la imagen');
      } finally {
        setLoading(false);
      }
    };
    
    fetchImage();
  }, [id]);
  
  const handleDelete = async () => {
    if (!image || !currentUser) return;
    
    // Check if the current user is the owner of the image
    if (image.userId !== currentUser.uid) {
      toast.error('No tienes permiso para eliminar esta imagen');
      return;
    }
    
    try {
      const success = await deleteImage(image.id);
      if (success) {
        toast.success('Imagen eliminada correctamente');
        navigate('/');
      } else {
        toast.error('Error al eliminar la imagen');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error al eliminar la imagen');
    }
  };
  
  const handleToggleLike = async () => {
    if (!image || !currentUser) {
      toast.error('Debes iniciar sesión para dar me gusta');
      return;
    }
    
    try {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      const success = await toggleLikeImage(image.id, currentUser.uid);
      if (!success) {
        // Revert the state if the update fails
        setIsLiked(!newLikedState);
        toast.error('Error al actualizar me gusta');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsLiked(!isLiked); // Revert on error
      toast.error('Error al actualizar me gusta');
    }
  };
  
  const handleToggleSave = async () => {
    if (!image || !currentUser) {
      toast.error('Debes iniciar sesión para guardar la imagen');
      return;
    }
    
    try {
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);
      
      const success = await toggleSaveImage(image.id, currentUser.uid);
      if (!success) {
        // Revert the state if the update fails
        setIsSaved(!newSavedState);
        toast.error('Error al guardar la imagen');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      setIsSaved(!isSaved); // Revert on error
      toast.error('Error al guardar la imagen');
    }
  };
  
  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-8 w-32 bg-neutral-700" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg bg-neutral-800" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4 bg-neutral-700" />
              <Skeleton className="h-24 w-full bg-neutral-700" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-full bg-neutral-700" />
                <Skeleton className="h-8 w-24 rounded-full bg-neutral-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!image) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Imagen no encontrada</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" size={18} />
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700"
          >
            <ArrowLeft className="mr-2" size={18} />
            Volver
          </Button>
          
          <Button
            onClick={handleUploadClick}
            variant="outline"
            size="sm"
            className="border-neutral-600 bg-neutral-600 text-neutral-50 rounded-xl px-4 py-2"
          >
            <Upload size={18} className="mr-2" />
            <span>Subir</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-neutral-800 rounded-lg overflow-hidden">
              <img 
                src={image.src} 
                alt={image.title} 
                className="w-full object-contain max-h-[600px]" 
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{image.title}</h1>
            
            {image.description && (
              <p className="text-neutral-300">{image.description}</p>
            )}
            
            {image.categories && image.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {image.categories.map((category) => (
                  <Badge key={category} className="bg-neutral-700 hover:bg-neutral-700 cursor-default">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
            
            {image.username && (
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border border-neutral-700">
                  <AvatarImage src={image.userAvatar || ''} />
                  <AvatarFallback className="bg-neutral-800 text-neutral-300">
                    {image.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{image.username}</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className={isLiked 
                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600" 
                  : "bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700"
                }
                onClick={handleToggleLike}
              >
                {isLiked ? (
                  <Heart className="mr-2" size={18} fill="white" />
                ) : (
                  <HeartOff className="mr-2" size={18} />
                )}
                {isLiked ? 'Me gusta' : 'Me gusta'}
              </Button>
              
              <Button
                variant="outline"
                className={isSaved 
                  ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600"
                  : "bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700"
                }
                onClick={handleToggleSave}
              >
                {isSaved ? (
                  <BookmarkCheck className="mr-2" size={18} />
                ) : (
                  <Bookmark className="mr-2" size={18} />
                )}
                {isSaved ? 'Guardada' : 'Guardar'}
              </Button>
              
              {currentUser && image.userId === currentUser.uid && (
                <Button
                  variant="outline"
                  className="bg-red-900 border-red-900 text-white hover:bg-red-800"
                  onClick={handleDelete}
                >
                  <Trash className="mr-2" size={18} />
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={() => {}} // This will be handled by the parent component
      />
    </div>
  );
};

export default ImageDetail;
