import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SummaryApi, { baseURL } from '@config/summaryApi';
import { setUserDetails, endUserSession } from '@store/slices/userSlice';
import imageToBase64 from '@utils/imageToBase64';
import uploadToCloudinary from '@helpers/cloudinaryUpload';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import ProfileActions from '../components/profile/ProfileActions';
import ProfileInfoForm from '../components/profile/ProfileInfoForm';
import DangerZone from '../components/profile/DangerZone';

export const ProfilePage = () => {
  // Get authenticated user data from Redux store
  const user = useSelector((state) => state.user);
  // Send actions to update Redux store
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    avatar: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  // Temporary base64 image for preview before Cloudinary upload
  const [profileImage, setProfileImage] = useState('');

  // Update local state whenever Redux user data updates
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      avatar: user.avatar || '',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      // Phone field: allows only numeric input; other fields: no restrictions
      [name]: name === 'mobile' ? value.replace(/\D/g, '') : value,
    });
  };

  const handlePasswordChange = () => {
    // Navigate to reset-password page with user's email
    navigate('/reset-password', {
      state: {
        email: user.email,
      },
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      avatar: user.avatar || '',
    });
    setIsEditing(false);
  };

  // Handle profile picture selection and preview
  const handlePhotoUpload = async (e) => {
    // Get first file from input (user can only select one image)
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await imageToBase64(file);
      setProfileImage(base64);
      // Update form data for immediate preview display
      setFormData((prev) => ({ ...prev, avatar: base64 }));
    } catch (error) {
      toast.error('Failed to upload image');
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use current user avatar unless a new image was selected for upload
      let avatarUrl = user.avatar || '';
      if (profileImage) {
        avatarUrl = await uploadToCloudinary(profileImage);
      }

      const res = await fetch(baseURL + SummaryApi.updateProfile.url, {
        method: SummaryApi.updateProfile.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile || null,
          avatar: avatarUrl, // Cloudinary URL or existing avatar
        }),
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        // Update Redux store with new user data
        dispatch(
          setUserDetails({
            ...user,
            name: formData.name,
            mobile: formData.mobile,
            avatar: avatarUrl,
          })
        );
        // Clear temporary image state after successful save
        setProfileImage('');
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Connection error. Please try again later.');
      console.log(error);
    }
  };

  const handleDeleteAccount = async () => {
try {
      // Send DELETE request to backend account deletion endpoint
      const res = await fetch(baseURL + SummaryApi.deleteAccount.url, {
        method: SummaryApi.deleteAccount.method,
        credentials: 'include', // Include authentication cookies
      });

      const data = await res.json();

      // Display backend response messages
      if (data.error) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        // Clear user data from Redux store
        dispatch(endUserSession());
        // Redirect to home page after successful deletion
        navigate('/');
      }
    } catch (error) {
      toast.error('Connection error. Please try again later.');
      console.log(error);
    }
  };

  return (
    <>
      <div className='p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm'>
        {/* Personal Information section header with action buttons */}
        <ProfileActions
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={handleCancel}
          onSave={handleSubmit}
        />
        {/* Profile Picture */}
        <ProfileAvatar
          formData={formData}
          user={user}
          isEditing={isEditing}
          onPhotoUpload={handlePhotoUpload}
        />
        {/* Editable profile information form */}
        <ProfileInfoForm
          formData={formData}
          user={user}
          isEditing={isEditing}
          onChange={handleChange}
          onPasswordChange={handlePasswordChange}
        />
      </div>

      {/* Delete Account */}
      <DangerZone onDelete={handleDeleteAccount} />
    </>
  );
};
