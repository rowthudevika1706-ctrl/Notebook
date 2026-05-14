import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const NoteEditorSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-pulse">
      {/* Title placeholder */}
      <div className="flex flex-col p-6 gap-4">
        <Skeleton className="h-10 w-1/2 rounded-lg" /> {/* Title */}
      </div>

      {/* Note content placeholders */}
      <div className="flex-1 flex flex-col p-6 gap-3 overflow-auto">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-6 rounded-md ${
              i % 3 === 0 ? "w-5/6" : i % 3 === 1 ? "w-4/6" : "w-full"
            }`}
          />
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-4 p-4">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export default NoteEditorSkeleton;
