const InputText = ({ label, name, value, onChange, placeholder }) => {
  return (
    <div className='grid gap-1.5'>
      <label htmlFor={name}>{label}</label>
      <input
        type='text'
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className='p-2 bg-slate-100 outline-none'
      />
    </div>
  );
};

export default InputText;
