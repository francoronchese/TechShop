import { useState } from 'react';
import { CircleUserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { SignUpForm } from '@features/auth';
import imageToBase64 from '@utils/imageToBase64';

const SignUpPage = () => {
  const [profileImage, setProfileImage] = useState('');

  const handlePhotoUpload = async (e) => {
    // Get first file from input (user can only select one image)
    const file = e.target.files[0];
    if (file) {
      try {
        // Convert to base64 for instant preview
        const base64 = await imageToBase64(file);
        setProfileImage(base64);
      } catch (err) {
        console.log('Error converting image:', err);
        toast.error('Failed to process image');
      }
    }
  };

  return (
    <section className='max-w-md mx-auto px-2 py-6 bg-white'>
      <div className='mb-3'>
        <form>
          <label>
            {profileImage ? (
              <img
                src={profileImage}
                alt='Preview'
                className='h-20 w-20 mx-auto object-cover rounded-full cursor-pointer'
              />
            ) : (
              <CircleUserRound
                size='80px'
                strokeWidth='0.85'
                className='mx-auto text-orange-600 cursor-pointer'
              />
            )}

            <span className='block -mt-0.5 text-xs text-center cursor-pointer'>
              {profileImage ? 'Change Photo' : 'Upload Photo'}
            </span>
            <input
              type='file'
              className='hidden'
              onChange={handlePhotoUpload}
              accept='.jpg,.jpeg,.png,.webp'
            />
          </label>
        </form>
      </div>

      <SignUpForm profileImage={profileImage} />
    </section>
  );
};

export default SignUpPage;
