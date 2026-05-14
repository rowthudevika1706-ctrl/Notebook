import React from "react";
import { Button } from "../components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import useDeletePage from "../hooks/useDeletePage.js"; // default export

import usePageStore from "../store/usePageStore";

const Page = ({ page, sectionId }) => {
  const setCurrentPage = usePageStore((s) => s.setCurrentPage);
  const currentPage = usePageStore((s) => s.currentPage);

  const deleteMutation = useDeletePage();

  const handleDelete = () => {
    deleteMutation.mutate({ sectionId, pageId: page._id });
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
        onClick={() => setCurrentPage(page._id)}
      >
        <FileText className="w-4 h-4 mr-2" />
        <span
          className={`truncate cursor-pointer ${
            currentPage === page._id ? "text-blue-700" : ""
          }`}
        >
          {page.title}
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

export default Page;
