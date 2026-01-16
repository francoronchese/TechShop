import { Pencil, X, Check } from 'lucide-react';
import { Button, Loader } from '@components';

const ProfileHeader = ({ isEditing, onEdit, onCancel, onSave, loading }) => {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4'>
      {/* Title & Description */}
      <div>
        <h2 className='text-gray-800 text-lg font-bold'>
          Personal Information
        </h2>
        <p className='text-sm text-gray-600'>Manage your account profile</p>
      </div>

      {/* Dynamic Buttons Logic */}
      {isEditing ? (
        <div className='flex flex-col sm:flex-row items-center gap-2'>
          <Button
            onClick={onCancel}
            className='w-full sm:w-auto justify-center bg-gray-700 text-white hover:bg-gray-800'
            icon={X}
            iconSize={20}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className={`w-full sm:w-auto justify-center bg-orange-500 text-white hover:bg-orange-600 ${
              loading ? 'opacity-85 px-10' : ''
            }`}
            icon={loading ? null : Check}
            iconSize={20}
          >
            {loading ? <Loader /> : 'Save'}
          </Button>
        </div>
      ) : (
        <Button
          onClick={onEdit}
          className='w-full sm:w-auto justify-center bg-orange-500 text-white hover:bg-orange-600'
          icon={Pencil}
          iconSize={18}
        >
          Edit
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader;
