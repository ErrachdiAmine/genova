import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex items-center justify-center">
      <div className="space-y-6 w-full max-w-2xl">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            className={`w-full p-5 rounded-lg shadow-md animate-pulse ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-300'
            }`}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          >
            <div className={`w-1/2 h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'} rounded mb-3`}></div>
            <div className={`w-full h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'} rounded mb-2`}></div>
            <div className={`w-3/4 h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'} rounded mb-2`}></div>
            <div className={`w-2/3 h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'} rounded`}></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
