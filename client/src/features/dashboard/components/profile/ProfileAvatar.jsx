import { Camera } from 'lucide-react';

const ProfileAvatar = ({ formData, user, isEditing, onPhotoUpload }) => {
  return (
    <div className='flex flex-col min-[450px]:flex-row items-center gap-6 mb-6 min-[450px]:mb-8 pb-4 min-[450px]:pb-8 border-b border-gray-200'>
      <div className='relative mt-2'>
        {formData.avatar ? (
          <img
            src={formData.avatar}
            alt='avatar'
            className='w-25 h-25 border-gray-100 border-4 rounded-full shadow-md'
          />
        ) : (
          <div className='flex items-center justify-center w-25 h-25 text-2xl font-bold bg-teal-500 text-white border-gray-100 border-4 rounded-full shadow-md'>
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        {isEditing && (
          <label className='absolute bottom-0 right-0 p-1.5 bg-orange-500 text-white rounded-full cursor-pointer'>
            <Camera size={15} />
            <input
              type='file'
              className='hidden'
              onChange={onPhotoUpload}
              accept='.jpg,.jpeg,.png,.webp'
            />
          </label>
        )}
      </div>
      <div className='text-center min-[450px]:text-left'>
        <h3 className='mb-1 sm:mb-0 text-sm font-semibold text-gray-800'>
          {user.name}
        </h3>
        <p className='mb-3 text-xs sm:text-sm text-gray-600'>{user.email}</p>
        {isEditing && (
          <p className='text-xs text-orange-500'>
            Click the camera to change your profile picture
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
