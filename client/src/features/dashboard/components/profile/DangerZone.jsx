import { useRef, useState } from 'react';
import { Button, Loader } from '@components';

const DangerZone = ({ onDelete }) => {
  const [loading, setLoading] = useState(false);
  // Create reference to access the native DOM dialog element
  // Required to call showModal() and close() methods
  const dialogRef = useRef(null);

  // Open dialog as modal (calls native showModal() method)
  const openModal = () => {
    dialogRef.current.showModal();
  };

  // Close dialog (calls native close() method)
  const closeModal = () => {
    dialogRef.current.close();
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <>
      <div className='p-6 mt-6 bg-white rounded-xl shadow-sm border border-slate-300'>
        <h2 className='text-slate-800 text-lg font-bold'>Danger Zone</h2>
        <p className='text-sm text-slate-600'>
          Irreversible actions on your account
        </p>
        <div className='p-6 mt-6 bg-red-50 border border-red-200 rounded-xl'>
          <h3 className='mb-2 font-semibold text-slate-800'>Delete account</h3>
          <p className='mb-4 text-sm text-slate-600'>
            Once you delete your account, there's no going back. Please be
            certain.
          </p>
          <Button
            onClick={openModal}
            className='bg-red-500 text-white hover:bg-red-600'
          >
            Delete account
          </Button>
        </div>
      </div>

      {/* Native HTML dialog element */}
      <dialog
        ref={dialogRef}
        className='w-[90%] m-auto max-w-md p-6 rounded-xl border-0 shadow-xl bg-white backdrop:bg-black/50'
      >
        <h3 className='mb-3 text-lg font-bold text-slate-900'>
          Are you sure you want to permanently delete your account?
        </h3>
        <p className='mb-6 text-slate-600'>This action cannot be undone.</p>
        <div className='flex flex-col min-[350px]:flex-row gap-3 justify-end'>
          {/* Use Button component here too if you want consistency */}
          <Button
            onClick={closeModal}
            className='justify-center w-full min-[350px]:w-auto bg-slate-200 text-slate-800 hover:bg-slate-300'
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className={`justify-center w-full min-[350px]:w-auto bg-red-600 text-white hover:bg-red-700 ${
              loading ? 'opacity-85 px-16' : ''
            }`}
          >
            {loading ? <Loader /> : 'Delete Account'}
          </Button>
        </div>
      </dialog>
    </>
  );
};

export default DangerZone;
