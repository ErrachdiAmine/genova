import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <p className="text-2xl font-semibold mb-4">Page Not Found</p>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 dark:bg-blue-500 dark:hover:bg-blue-400">
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
