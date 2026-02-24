import { Link } from 'react-router-dom';

export const CategoryCard = ({ id, name, image, productCount }) => {
  return (
    <Link
      to={`/category/${id}`}
      className='group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer'
    >
      {/* Image Container */}
      <div className='aspect-4/3 overflow-hidden'>
        <img
          src={image}
          alt={name}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
        />
      </div>

      {/* Dark Gradient Overlay */}
      <div className='absolute inset-0 flex flex-col justify-end p-6 bg-linear-to-t from-black/80 via-black/20 to-transparent'>
        <h3 className='text-white font-bold text-2xl mb-1'>{name}</h3>
        <p className='text-white/80 text-sm'>{productCount || 0} Products</p>
      </div>

      {/* Subtle Orange Glow on Hover */}
      <div className='absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors duration-300' />
    </Link>
  );
};