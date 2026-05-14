import React from "react";
import { getCanvas } from "../helper/api";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../components/ErrorMessage";
import CanvasTitle from "./CanvasTitle";
import CanvasContent from "./CanvasContent";
import CanvasEditorSkeleton from "../skeletons/CanvasEditorSkeleton";
const CanvasEditor = ({ canvasId }) => {
  const {
    data: canvasPage,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["canvas", canvasId],
    queryFn: () => getCanvas(canvasId),
  });

  if (isLoading) return <CanvasEditorSkeleton />;
  if (error) return <ErrorMessage />;
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        <CanvasTitle title={canvasPage?.title} canvasId={canvasId} />
        <CanvasContent
          content={canvasPage?.content}
          title={canvasPage?.title}
          canvasId={canvasId}
        />
      </div>
    </div>
  );
};

export default CanvasEditor;
