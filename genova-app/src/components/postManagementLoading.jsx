import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex space-x-2">
        {[ "#ff3d00", "#ff9100", "#00bfa5" ].map((color, index) => (
          <motion.div
            key={index}
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ opacity: 0.3, y: 0 }}
            animate={{ opacity: 1, y: -10 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.2, // Staggered effect
            }}
          ></motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
