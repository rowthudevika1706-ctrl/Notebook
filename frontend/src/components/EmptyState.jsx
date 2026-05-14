import { motion } from "framer-motion";
import { Pen, BookOpen, Sparkles } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="h-full flex-1 flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden">
      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute top-20 left-1/3 opacity-50"
      >
        <Sparkles className="w-8 h-8 text-yellow-400" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute top-1/2 right-1/4 opacity-50"
      >
        <Pen className="w-8 h-8 text-blue-400" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 15, -15, 0] }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-24 left-1/2 opacity-50"
      >
        <BookOpen className="w-10 h-10 text-green-400" />
      </motion.div>

      {/* Main text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center px-4 max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-2">Your Notebook is Ready!</h2>
        <p className="text-base text-muted-foreground">
          Select a page or create a new one to start capturing your ideas ✨
        </p>
      </motion.div>
    </div>
  );
};

export default EmptyState;
