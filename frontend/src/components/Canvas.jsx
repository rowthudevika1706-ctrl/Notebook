import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import usePageStore from "../store/usePageStore";
import useDeleteCanvas from "../hooks/useDeletecanvas.js";
const Canvas = ({ canvas, sectionId }) => {
  const setCurrentCanvas = usePageStore((s) => s.setCurrentCanvas);
  const currentCanvas = usePageStore((s) => s.currentCanvas);

  const deleteMutation = useDeleteCanvas();

  const handleDelete = () => {
    deleteMutation.mutate({ sectionId, canvasId: canvas._id });
  };
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center px-2 mx-2 group"
    >
      <Button
        variant="ghost"
        className="w-[calc(100%_-_20px)] justify-start text-sm mb-1 transition-all hover:translate-x-1"
        onClick={() => setCurrentCanvas(canvas._id)}
      >
        <PencilLine className="w-4 h-4 mr-2" />
        <span
          className={`truncate cursor-pointer ${
            currentCanvas === canvas._id ? "text-blue-700" : ""
          }`}
        >
          {canvas.title}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={handleDelete}
        disabled={deleteMutation.isLoading}
      >
        <Trash2 className="w-3 h-3 text-red-600" />
      </Button>
    </motion.div>
  );
};

export default Canvas;
