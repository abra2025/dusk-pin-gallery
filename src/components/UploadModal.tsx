import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Category } from '../types';
import { toast } from 'sonner';
import { uploadImageToStorage } from '@/services/supabaseStorage';
import { useAuth } from '@/context/AuthContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: {
    title: string;
    description: string;
    categories: Category[];
    imageUrl: string;
    userId: string;
  }) => void;
}

const categories: Category[] = [
  'brutalismo',
  'sustentable',
  'interiores',
  'paisajismo',
  'renders 3D',
  'croquis',
  'minimalismo',
  'industrial',
];

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { currentUser } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const toggleCategory = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    if (!imageFile) {
      toast.error('Debes subir una imagen');
      return;
    }

    if (!currentUser) {
      toast.error('Debes iniciar sesión para subir imágenes');
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to Supabase Storage
      const imageUrl = await uploadImageToStorage(imageFile, currentUser.uid);
      
      if (!imageUrl) {
        toast.error('Error al subir la imagen');
        setIsUploading(false);
        return;
      }

      // Pass the imageUrl to the parent component
      onUpload({
        title,
        description,
        categories: selectedCategories,
        imageUrl,
        userId: currentUser.uid,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedCategories([]);
      setImageFile(null);
      setPreviewUrl(null);
      
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-800 text-white border-neutral-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Subir imagen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!previewUrl ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging 
                  ? 'border-white bg-neutral-700/50' 
                  : 'border-neutral-600 hover:border-neutral-500'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <ImageIcon className="h-8 w-8 text-neutral-400" />
                <p className="text-sm text-neutral-300">
                  Arrastra y suelta una imagen o
                </p>
                <div className="mt-2">
                  <Label
                    htmlFor="file-upload"
                    className="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-2 rounded-md cursor-pointer text-sm inline-block"
                  >
                    Selecciona un archivo
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-contain rounded-md bg-neutral-900"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => {
                  setImageFile(null);
                  setPreviewUrl(null);
                }}
              >
                <X size={14} />
              </Button>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-neutral-700 border-neutral-600 text-white"
              placeholder="Título de la imagen"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-neutral-700 border-neutral-600 text-white resize-none"
              placeholder="Añade una descripción"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">Categorías</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  className={`cursor-pointer ${
                    selectedCategories.includes(category)
                      ? 'bg-white text-black hover:bg-neutral-200'
                      : 'bg-neutral-700 hover:bg-neutral-600'
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-700"
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-white text-black hover:bg-neutral-200"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? 'Subiendo...' : 'Subir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
