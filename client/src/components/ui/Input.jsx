export const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  readOnly = false,
}) => {
  return (
    <div className='grid gap-1.5'>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        readOnly={readOnly}
        className={`p-2 bg-slate-100 rounded-lg outline-none ${
          readOnly
            ? // Hide text cursor (caret) for readonly inputs to prevent user interaction
              'text-gray-500 outline-none cursor-not-allowed caret-transparent'
            : ''
        }`}
      />
    </div>
  );
};
