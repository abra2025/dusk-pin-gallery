
import { supabase } from '../../supabase';
import { v4 as uuid } from 'uuid';

// Upload an image to Supabase Storage
export const uploadImageToStorage = async (
  file: File,
  userId: string
): Promise<string | null> => {
  try {
    console.log('Starting upload with userId:', userId);
    
    // Create a unique file name using UUID
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuid()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload the file to the "images" bucket in Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    console.log('Upload successful, file path:', filePath);

    // Get the public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error);
    return null;
  }
};

// Delete an image from Supabase Storage
export const deleteImageFromStorage = async (
  imageUrl: string,
  userId: string
): Promise<boolean> => {
  try {
    // Extract the file path from the public URL
    const storageUrl = supabase.storage.from('images').getPublicUrl('').data.publicUrl;
    const filePath = imageUrl.replace(storageUrl, '');
    
    // Make sure the file belongs to the user before deletion (security check)
    if (!filePath.startsWith(`/${userId}/`)) {
      console.error('User does not own this image');
      return false;
    }
    
    // Remove the leading slash if present
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    
    // Delete the file
    const { error } = await supabase.storage
      .from('images')
      .remove([cleanPath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteImageFromStorage:', error);
    return false;
  }
};
