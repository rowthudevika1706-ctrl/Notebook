import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateCanvasDrawing } from "../helper/api";
import { toast } from "sonner";
import useUpdateCanvasContent from "../hooks/useUpdateCanvasContent.js";

const CanvasFooter = ({ canvasRef, title, content, canvasId }) => {
  const { mutateAsync: updateCanvasContent } = useUpdateCanvasContent();
  const inputRef = useRef(null);
  const [isloadingAI, setisLoadingAI] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Download canvas + background
  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      if (!canvasRef.current) return;

      const imageData = await canvasRef.current.exportImage("png");

      // Create offscreen canvas
      const canvasEl = document.createElement("canvas");
      const width = canvasRef.current.width || 1000;
      const height = canvasRef.current.height || 600;
      canvasEl.width = width;
      canvasEl.height = height;
      const ctx = canvasEl.getContext("2d");

      // Draw background image if exists
      if (content) {
        const bgImg = new Image();
        bgImg.src = content;
        await new Promise((res, rej) => {
          bgImg.onload = res;
          bgImg.onerror = rej;
        });
        ctx.drawImage(bgImg, 0, 0, width, height);
      }

      // Draw user drawing on top
      const userImg = new Image();
      userImg.src = imageData;
      await new Promise((res, rej) => {
        userImg.onload = res;
        userImg.onerror = rej;
      });
      ctx.drawImage(userImg, 0, 0, width, height);

      // Export final combined PNG
      const finalImage = canvasEl.toDataURL("image/png");

      // Trigger download
      const link = document.createElement("a");
      link.href = finalImage;
      link.download = `${title || "canvas_with_bg"}.png`;
      link.click();

      toast.success("Canvas + background downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download canvas with background.");
    } finally {
      setDownloading(false);
    }
  };

  const handleExportPNG = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const image = await canvasRef.current?.exportImage("png");

      if (!image) {
        toast.error("Nothing to export.");
        return;
      }
      await updateCanvasContent({
        canvasId,
        updatedData: { content: image },
      });
      toast.success("Drawing saved!");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save drawing.");
    } finally {
      setSaving(false);
    }
  };

  // Generate canvas from AI prompt
  const handleGenerate = async () => {
    const prompt = inputRef.current.value.trim();
    if (!prompt || isloadingAI) return;
    setisLoadingAI(true);

    // console.log(await canvasRef.current.exportPaths());

    try {
      const res = await generateCanvasDrawing({ prompt });
      // canvasRef.current.loadPaths(res.content);
      const shapePaths = res.content.map((shape) => {
        const { stroke, strokeWidth, type, paths } = shape;
        let points = [];

        if (type === "line" || type === "path" || type === "curve") {
          // For line/path/curve, use points as given
          points = shape.paths.map((pt) => ({ x: pt.x, y: pt.y }));
        } else if (type === "rectangle") {
          // Generate rectangle corners (close loop back to start)
          const p1 = paths[0];
          const p2 = paths[1];
          points = [
            { x: p1.x, y: p1.y },
            { x: p1.x, y: p2.y },
            { x: p2.x, y: p2.y },
            { x: p2.x, y: p1.y },
            { x: p1.x, y: p1.y },
          ];
        } else if (type === "circle") {
          // Approximate circle: center = paths[0], second point defines radius
          const center = paths[0];
          const edge = paths[1];
          const dx = edge.x - center.x;
          const dy = edge.y - center.y;
          const radius = Math.sqrt(dx * dx + dy * dy);
          const numSegments = 32;
          for (let i = 0; i <= numSegments; i++) {
            const theta = (i * 2 * Math.PI) / numSegments;
            points.push({
              x: center.x + radius * Math.cos(theta),
              y: center.y + radius * Math.sin(theta),
            });
          }
        }

        return {
          drawMode: true,
          strokeColor: stroke,
          strokeWidth: strokeWidth,
          paths: points,
        };
      });

      // console.log(shapePaths);

      await canvasRef.current.loadPaths(shapePaths);
    } catch (err) {
      console.error("Canvas generation failed:", err);
      toast.error("Failed to generate canvas.");
    } finally {
      inputRef.current.value = "";
      setisLoadingAI(false);
    }
  };

  // console.log(canvasRef.current);

  return (
    <div className="flex justify-between items-center px-4">
      <div className="peer group/generate flex items-center gap-2 flex-1 transition-all duration-500 ease-in-out group-hover/generate:blur-[0px]">
        <Input
          ref={inputRef}
          className="w-0 transition-all p-0 border-0 duration-500 ease-in-out group-hover/generate:w-full group-hover/generate:border group-hover/generate:p-3 focus:w-full focus:border focus:p-3"
          placeholder="Type prompt..."
        />
        <Button
          variant="outline"
          onClick={handleGenerate}
          disabled={isloadingAI}
          className="transition-all duration-500 ease-in-out cursor-pointer"
        >
          {isloadingAI ? "Generating..." : "Generate"}
        </Button>
      </div>

      <div className="space-x-3 peer-hover:hidden transition-all duration-500 ease-in-out">
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={downloading || isloadingAI}
          className="cursor-pointer"
        >
          {downloading ? "Downloading..." : "Download"}
        </Button>
        <Button
          variant="outline"
          onClick={handleExportPNG}
          title="Save"
          className="cursor-pointer"
          disabled={saving || isloadingAI}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default CanvasFooter;
