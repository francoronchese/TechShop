import { Key } from 'lucide-react';
import { Input, Button } from '@components';

const ProfileInfoForm = ({
  formData,
  user,
  onChange,
  onPasswordChange,
  isEditing,
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
        isEditing ? 'text-gray-700' : 'text-gray-600'
      }`}
    >
      <Input
        label='Full Name'
        name='name'
        value={formData.name}
        onChange={onChange}
        placeholder={user.name}
        readOnly={!isEditing}
      />
      <Input
        label='Email'
        name='email'
        value={user.email}
        placeholder={user.email}
        readOnly={true}
      />
      <Input
        type='tel'
        label='Phone'
        name='mobile'
        value={formData.mobile || ''}
        onChange={onChange}
        placeholder={user.mobile || 'No phone number added'}
        readOnly={!isEditing}
      />
      <div className='flex items-end'>
        <Button
          onClick={onPasswordChange}
          className='w-full bg-gray-700 text-white hover:bg-gray-800'
          icon={Key}
          iconSize={20}
        >
          Change Password
        </Button>
      </div>
    </div>
  );
};

export default ProfileInfoForm;
