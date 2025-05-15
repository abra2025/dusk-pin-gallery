
import { supabase } from '../../supabase';
import { v4 as uuid } from 'uuid';
import { toast } from 'sonner';

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
    
    // Maximum retries for upload
    const maxRetries = 3;
    let retryCount = 0;
    let uploadSuccess = false;
    let error = null;
    
    // Try to upload with retries
    while (retryCount < maxRetries && !uploadSuccess) {
      try {
        console.log(`Upload attempt ${retryCount + 1} of ${maxRetries}`);
        
        // Upload the file to the "images" bucket in Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          error = uploadError;
          console.log(`Upload attempt ${retryCount + 1} failed:`, uploadError);
          retryCount++;
          
          // Wait before retrying (exponential backoff)
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } else {
          uploadSuccess = true;
          console.log('Upload successful, file path:', filePath);
          
          // Get the public URL for the uploaded image
          const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);
            
          return urlData.publicUrl;
        }
      } catch (err) {
        error = err;
        console.log(`Upload attempt ${retryCount + 1} failed with exception:`, err);
        retryCount++;
        
        // Wait before retrying
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // If we've exhausted retries, try a fallback mechanism
    if (!uploadSuccess) {
      console.error('All upload attempts failed:', error);
      toast.error('No se pudo conectar con el servidor de almacenamiento. Por favor, inténtalo de nuevo más tarde.');
      return null;
    }
    
    // This should not be reached if all attempts fail
    return null;
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
