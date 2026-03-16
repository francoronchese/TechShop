import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="flex flex-col items-center justify-center py-32">
      <h1 className="text-9xl font-extrabold text-orange-500 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been removed.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out tracking-wide"
      >
        Back to Home
      </Link>
    </section>
  );
};

export default NotFoundPage;
