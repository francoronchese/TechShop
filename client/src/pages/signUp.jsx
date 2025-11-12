import { useState } from 'react';
import { CircleUserRound } from 'lucide-react';
import SignUpForm from '../components/forms/SignUpForm';
import imageToBase64 from '../helpers/imageToBase64';

const SignUpPage = () => {
  const [profileImage, setProfileImage] = useState('');

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await imageToBase64(file);
        setProfileImage(base64);
      } catch (err) {
        console.log('Error converting image:', err);
      }
    }
  };

  return (
    <section id='signup' className='max-w-md mx-auto px-2 py-6 bg-white'>
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
              onChange={handleUploadPhoto}
            />
          </label>
        </form>
      </div>

      <SignUpForm profileImage={profileImage} />
    </section>
  );
};

export default SignUpPage;
