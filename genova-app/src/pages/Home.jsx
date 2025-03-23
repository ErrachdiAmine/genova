import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Apply dark mode based on local storage theme
  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg m-4 shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Welcome to Genova!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">This is your place to discover and explore new content.</p>
        <Link
          to="/posts"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300"
        >
          Explore Posts!
        </Link>
      </div>
    </div>
  );
};

export default Home;
