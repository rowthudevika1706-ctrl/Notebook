import React from "react";
import { motion } from "framer-motion";

const ListSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-3 p-2 w-full overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
          }}
          className="flex flex-col space-y-2 p-3 bg-gray-200 rounded-md dark:bg-gray-700"
        >
          {/* Simulated lines for list item */}
          <div className="h-4 w-3/4 bg-gray-300 rounded dark:bg-gray-600"></div>
          <div className="h-3 w-1/2 bg-gray-300 rounded dark:bg-gray-600"></div>
        </motion.div>
      ))}
    </div>
  );
};

export default ListSkeleton;
