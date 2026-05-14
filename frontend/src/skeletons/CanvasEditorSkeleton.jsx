import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CanvasEditorSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-700 animate-pulse">
      {/* Toolbar */}
      <div className="flex gap-3 p-4 bg-white dark:bg-gray-600 shadow rounded-b-md">
        <Skeleton className="h-10 w-12 rounded-full" /> {/* Circle button */}
        <Skeleton className="h-10 w-12 rounded-full" />
        <Skeleton className="h-10 w-12 rounded-full" />
        <Skeleton className="h-10 w-1/3 rounded-lg" /> {/* Input/search */}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col p-6 gap-4 overflow-auto">
        <Skeleton className="h-6 w-1/2 rounded-lg" /> {/* Page title */}
        <Skeleton className="flex-1 w-full rounded-xl shadow-inner dark:shadow-gray-700" />{" "}
        {/* Canvas */}
      </div>

      {/* Footer / Actions */}
      <div className="flex justify-end gap-4 p-4">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export default CanvasEditorSkeleton;
