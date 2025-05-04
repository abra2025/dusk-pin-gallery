
import { supabase } from '../../supabase';
import { Image, Category } from '@/types';
import { uploadImageToStorage } from './supabaseStorage';

// Save image metadata to Supabase database
export const saveImage = async (
  imageData: {
    title: string;
    description: string;
    categories: Category[];
    imageUrl: string;
    userId: string;
    height: number;
  }
): Promise<Image | null> => {
  try {
    console.log('Saving image with user ID:', imageData.userId);
    
    const { data, error } = await supabase
      .from('images')
      .insert([
        {
          title: imageData.title,
          description: imageData.description,
          categories: imageData.categories,
          image_url: imageData.imageUrl,
          user_id: imageData.userId,
          height: imageData.height
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving image metadata:', error);
      return null;
    }

    // Transform the database response to match our Image type
    const image: Image = {
      id: data.id,
      src: data.image_url,
      title: data.title,
      description: data.description,
      categories: data.categories,
      userId: data.user_id,
      saved: false,
      height: data.height,
    };

    return image;
  } catch (error) {
    console.error('Error in saveImage:', error);
    return null;
  }
};

// Get all images
export const getAllImages = async (): Promise<Image[]> => {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
      return [];
    }

    // Transform the database response to match our Image type
    const images: Image[] = data.map(item => ({
      id: item.id,
      src: item.image_url,
      title: item.title,
      description: item.description || '',
      categories: item.categories || [],
      userId: item.user_id,
      saved: false,
      height: item.height || 300,
    }));

    return images;
  } catch (error) {
    console.error('Error in getAllImages:', error);
    return [];
  }
};

// Get a single image by ID
export const getImageById = async (imageId: string): Promise<Image | null> => {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*, profiles:user_id(username, avatar_url)')
      .eq('id', imageId)
      .single();

    if (error || !data) {
      console.error('Error fetching image:', error);
      return null;
    }

    // Transform the database response to match our Image type
    const image: Image = {
      id: data.id,
      src: data.image_url,
      title: data.title,
      description: data.description || '',
      categories: data.categories || [],
      userId: data.user_id,
      username: data.profiles?.username || 'Unknown User',
      userAvatar: data.profiles?.avatar_url,
      saved: false,
      height: data.height || 300,
    };

    return image;
  } catch (error) {
    console.error('Error in getImageById:', error);
    return null;
  }
};

// Delete an image
export const deleteImage = async (imageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
};

// Toggle like on an image
export const toggleLikeImage = async (imageId: string, userId: string): Promise<boolean> => {
  try {
    // Check if user has already liked the image
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('*')
      .eq('image_id', imageId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking like status:', checkError);
      return false;
    }

    // If like exists, remove it; otherwise add it
    if (existingLike) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);

      if (error) {
        console.error('Error removing like:', error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('likes')
        .insert([{ image_id: imageId, user_id: userId }]);

      if (error) {
        console.error('Error adding like:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in toggleLikeImage:', error);
    return false;
  }
};

// Toggle save on an image
export const toggleSaveImage = async (imageId: string, userId: string): Promise<boolean> => {
  try {
    // Check if user has already saved the image
    const { data: existingSave, error: checkError } = await supabase
      .from('saved_images')
      .select('*')
      .eq('image_id', imageId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking save status:', checkError);
      return false;
    }

    // If save exists, remove it; otherwise add it
    if (existingSave) {
      const { error } = await supabase
        .from('saved_images')
        .delete()
        .eq('id', existingSave.id);

      if (error) {
        console.error('Error removing save:', error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('saved_images')
        .insert([{ image_id: imageId, user_id: userId }]);

      if (error) {
        console.error('Error adding save:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in toggleSaveImage:', error);
    return false;
  }
};

