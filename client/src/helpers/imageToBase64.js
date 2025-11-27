//Converts an image file to base64 data URL string
//Used for image preview before uploading to Cloudinary
const imageToBase64 = (image) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(image);

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default imageToBase64;