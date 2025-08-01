import { useLocation } from "wouter";
import { useEffect } from "react";
import { Link } from "wouter";

const NotFound = () => {
  const [location] = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location
    );
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Oops! Page not found</p>
        <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
