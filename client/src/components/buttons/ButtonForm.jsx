const ButtonForm = ({ children, disabled, maxWidth }) => {
  return (
    <button
      type='submit'
      disabled={disabled}
      style={{ maxWidth: maxWidth }}
      className={`block w-full mx-auto mt-4 mb-6 px-6 py-2 text-[1.05rem] text-white rounded-full ${
        disabled
          ? 'bg-slate-400 cursor-not-allowed'
          : 'bg-orange-600 outline-none [&:hover,&:focus]:bg-orange-500 [&:hover,&:focus]:ring-2 [&:hover,&:focus]:ring-orange-500 [&:hover,&:focus]:ring-offset-2  transition-all duration-300 ease-in-out tracking-wider cursor-pointer'
      }`}
    >
      {children}
    </button>
  );
};

export default ButtonForm;
