export const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  onKeyDown,
  placeholder,
  readOnly = false,
}) => {
  return (
    <div className='grid gap-1.5'>
      <label className='font-semibold text-orange-500' htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        required
        readOnly={readOnly}
        className={`p-2 bg-slate-100 rounded-lg outline-none border border-slate-300 ${
          readOnly
            ? // Hide text cursor (caret) for readonly inputs to prevent user interaction
              'text-gray-500 outline-none cursor-not-allowed caret-transparent'
            : ''
        }`}
      />
    </div>
  );
};
