export const Button = ({
  children,
  onClick,
  className,
  icon: Icon,
  iconSize,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 px-4 py-2 font-semibold rounded-lg transition-all cursor-pointer ${className}`}
    >
      {Icon && <Icon size={iconSize} />}
      {children}
    </button>
  );
};
