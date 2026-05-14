import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message = "Error loading sections" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center mt-20 text-center text-red-500"
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="mb-4"
      >
        <AlertCircle className="w-12 h-12" />
      </motion.div>
      <p className="text-xl font-semibold">{message}</p>
      <p className="text-sm text-red-300 mt-2">
        Please try refreshing the page or check your connection.
      </p>
    </motion.div>
  );
};

export default ErrorMessage;
