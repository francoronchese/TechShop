// Uploads image to Cloudinary and returns the secure URL
// Used for storing user avatars in cloud storage
// base64Image - The image in base64 format
// presetName - The specific Cloudinary preset to use (e.g., techshop_avatars, techshop_categories)
const uploadToCloudinary = async (base64Image, presetName) => {
  try {
    // Create FormData - native browser API for form data
    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('upload_preset', presetName);

    // Send upload request to Cloudinary API
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_NAME
      }/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error: ', error);
    throw new Error('Image upload failed. Please try again.');
  }
};

export default uploadToCloudinary;
