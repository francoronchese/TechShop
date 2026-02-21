export const PageLoader = ({ color = "border-orange-500" }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <div
        className={`h-10 w-10 animate-spin rounded-full border-4 ${color} border-t-transparent`}
      ></div>
    </div>
  );
};
