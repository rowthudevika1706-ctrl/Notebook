import React from "react";
import { motion } from "framer-motion";
import { Book } from "lucide-react";

const NoSectionsFound = () => {
  return (
    <div className="relative flex-1 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center text-muted-foreground mt-10 relative"
      >
        {/* Bouncing & hover-reactive Book Icon */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          whileHover={{ scale: 1.2, rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Book className="mx-auto mb-4 w-10 h-10 text-blue-400" />
        </motion.div>

        {/* Floating sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: Math.random() * 80 - 40,
              y: 0,
              scale: 0.5,
            }}
            animate={{ opacity: [0, 1, 0], y: [0, -10, 0], x: [0, 5, -5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 2,
              delay: Math.random(),
            }}
            className="absolute w-2 h-2 rounded-full bg-yellow-300"
          />
        ))}

        {/* Main message */}
        <motion.p
          animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-lg font-medium"
        >
          No notebooks yet
        </motion.p>

        {/* Playful prompt */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="mt-4 text-sm text-gray-500"
        >
          Click the <span className="font-bold">+</span> button to create your
          first notebook ✨
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NoSectionsFound;
