import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-6 w-full max-w-2xl">
        {/* Repeating Skeleton Loaders */}
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            className="w-full p-5 bg-gray-200 rounded-lg shadow-md animate-pulse"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0, repeat: Infinity, repeatType: "reverse" }}
          >
            {/* Title Placeholder */}
            <div className="w-1/2 h-6 bg-gray-300 rounded mb-3"></div>

            {/* Body Placeholder */}
            <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
