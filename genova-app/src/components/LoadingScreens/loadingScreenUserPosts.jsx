import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PostsManagementLoading = () => {
  const [isDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pt-16">
      <div className="max-w-6xl mx-auto">
        {/* Page Title Skeleton */}
        <div className={`h-10 w-48 mb-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'} animate-pulse`}></div>

        {/* Posts Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            >
              {/* Post Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={`h-7 w-3/4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'}`}></div>
                <div className="flex space-x-2">
                  <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'}`}></div>
                  <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'}`}></div>
                </div>
              </div>

              {/* Post Content */}
              <div className="space-y-2">
                <div className={`h-4 w-full rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'}`}></div>
                <div className={`h-4 w-2/3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'}`}></div>
              </div>

              {/* Post Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <div className={`h-3 w-24 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'}`}></div>
                  <div className={`h-3 w-32 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'}`}></div>
                </div>
                <div className={`mt-2 h-3 w-40 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'}`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Navigation Skeleton */}
        <div className="flex justify-center mt-8 space-x-8">
          <div className={`h-6 w-16 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
          <div className={`h-6 w-16 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default PostsManagementLoading;