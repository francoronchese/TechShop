import { DashboardSidebar } from './DashboardSidebar';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = () => {
  return (
    <section className='relative grid grid-cols-1 lg:grid-cols-[250px_1fr] lg:grid-rows-[auto_1fr] lg:gap-6'>
      <div className='lg:col-start-2 lg:row-start-1'>
        <h1 className='mb-2 font-bold text-xl text-gray-900 '>
          My Dashboard
        </h1>
        <p className='text-gray-600'>
          Manage your account, orders and preferences
        </p>
      </div>

      {/* Navegation */}
      <div className='lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky top-24 lg:self-start mt-6 lg:mt-0'>
        <DashboardSidebar />
      </div>

      <div className='lg:col-start-2 lg:row-start-2'>
        <Outlet />
      </div>
    </section>
  );
};
