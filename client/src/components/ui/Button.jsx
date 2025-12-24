export const Button = ({
  children,
  onClick,
  className,
  icon: Icon,
  iconSize,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-5 py-2 rounded-lg transition-colors cursor-pointer ${className}`}
    >
      {Icon && <Icon size={iconSize} />}
      {children}
    </button>
  );
};
