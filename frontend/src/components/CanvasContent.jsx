import { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
// import { optimizeCanvasWithAI } from "../helper/api";
import { Card } from "./ui/card";
import CanvasHeader from "./CanvasHeader";
import CanvasFooter from "./CanvasFooter";
import { toast } from "sonner";

const CanvasContent = ({ content, title, canvasId }) => {
  const canvasRef = useRef(null);
  const colorInputRef = useRef(null);

  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);

  const handleStrokeColorChange = (event) => {
    const newColor = event.target.value;
    setStrokeColor(newColor);
  };

  return (
    <div className="mt-2 flex flex-col max-w-5xl gap-2">
      {/* Toolbar */}
      <CanvasHeader
        colorInputRef={colorInputRef}
        handleStrokeColorChange={handleStrokeColorChange}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        canvasRef={canvasRef}
      />

      {/* Canvas */}
      <Card className="w-full overflow-auto show-scroll p-0 m-0 rounded-none">
        <ReactSketchCanvas
          width="1000px"
          ref={canvasRef}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          backgroundImage={content}
          canvasColor="white"
          className="!aspect-video border-none"
        />
      </Card>

      <CanvasFooter
        canvasRef={canvasRef}
        title={title}
        canvasId={canvasId}
        content={content}
      />
    </div>
  );
};

export default CanvasContent;
