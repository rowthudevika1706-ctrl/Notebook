import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Pen, Redo, RotateCcw, Undo } from "lucide-react";
const CanvasHeader = ({
  colorInputRef,
  handleStrokeColorChange,
  strokeColor,
  strokeWidth,
  setStrokeWidth,
  canvasRef,
}) => {
  const [eraseMode, setEraseMode] = useState(false);

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handleUndoClick = () => canvasRef.current?.undo();
  const handleRedoClick = () => canvasRef.current?.redo();
  const handleClearClick = () => canvasRef.current?.clearCanvas();

  return (
    <div className="flex  items-center justify-evenly gap-2 shadow-xs rounded-2xl p-2">
      {/* ✏️ Pen / Eraser */}
      <div className="flex  gap-3 ">
        <Button
          size="icon"
          type="button"
          variant="outline"
          disabled={!eraseMode}
          onClick={handlePenClick}
        >
          <Pen size={16} />
        </Button>
        <Button
          size="icon"
          type="button"
          variant="outline"
          disabled={eraseMode}
          onClick={handleEraserClick}
        >
          <Eraser size={16} />
        </Button>
      </div>

      <div className="flex gap-5">
        <Button
          size="icon"
          className="dark:border-1 dark:border-gray-400/50"
          type="button"
          onClick={() => colorInputRef.current?.click()}
          style={{ backgroundColor: strokeColor }}
        >
          <input
            type="color"
            ref={colorInputRef}
            className="sr-only"
            value={strokeColor}
            onChange={handleStrokeColorChange}
          />
        </Button>

        {/* ⚙️ Line Width */}
        <div className="flex flex-col text-center">
          <label className="text-xs text-gray-500">Stroke</label>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            className="w-20 cursor-pointer"
            style={{ color: strokeColor,backgroundColor: strokeColor }}
          />
        </div>
      </div>

      {/* 🔁 Actions */}
      <div className="flex  gap-3">
        <Button size="icon" variant="outline" onClick={handleUndoClick}>
          <Undo size={16} />
        </Button>
        <Button size="icon" variant="outline" onClick={handleRedoClick}>
          <Redo size={16} />
        </Button>
        <Button size="icon" variant="outline" onClick={handleClearClick}>
          <RotateCcw size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CanvasHeader;
