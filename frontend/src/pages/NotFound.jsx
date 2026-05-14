import { motion } from "framer-motion";
import { AlertCircle, Zap, BookOpen } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-20 left-10 text-gray-300"
      >
        <Zap className="w-12 h-12" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -15, 15, 0] }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute bottom-20 right-20 text-gray-300"
      >
        <BookOpen className="w-14 h-14" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-1/2 right-1/3 text-gray-300"
      >
        <AlertCircle className="w-16 h-16" />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center z-10"
      >
        <motion.h1
          initial={{ y: -50, rotate: -10 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-4 text-6xl md:text-7xl font-extrabold text-red-500"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-6 text-xl text-gray-700"
        >
          Oops! Page not found
        </motion.p>
        <motion.a
          whileHover={{ scale: 1.1, rotate: [0, 3, -3, 0] }}
          whileTap={{ scale: 0.95 }}
          href="/"
          className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg inline-block"
        >
          Return to Home
        </motion.a>
      </motion.div>
    </div>
  );
};

export default NotFound;
