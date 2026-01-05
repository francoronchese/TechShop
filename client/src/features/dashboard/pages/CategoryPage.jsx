import { useState } from 'react';
import { Button } from '@components';

export const CategoryPage = () => {
  const [addCategory, setAddCategory] = useState(false);

  return (
    <div className='p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4'>
        <div>
          <h2 className='text-gray-800 text-lg font-bold'>
            Categories Management
          </h2>
          <p className='text-sm text-gray-600'>
            Create and manage product categories
          </p>
        </div>
        <Button
          onClick={() => setAddCategory(true)}
          className={
            'w-full sm:w-auto justify-center bg-orange-500 text-white hover:bg-orange-600'
          }
        >
          Add Category
        </Button>
      </div>
    </div>
  );
};
