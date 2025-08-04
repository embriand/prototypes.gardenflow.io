import React, { useEffect, useRef } from "react";

// Interfaces
import type { GardenBox } from "../../models";

interface GardenCanvasProps {
  boxes: GardenBox[];
}

export const GardenCanvas: React.FC<GardenCanvasProps> = ({ boxes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const PATH_WIDTH = 0.5;

  const renderCanvas = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const scale = 50;
    boxes.forEach((box) => {
      // Garden box
      ctx.fillStyle = "rgba(34, 197, 94, 0.5)";
      ctx.fillRect(
        box.x * scale,
        box.y * scale,
        box.width * scale,
        box.length * scale
      );

      // Paths around
      ctx.fillStyle = "rgba(120, 53, 15, 0.3)";
      // Top path
      ctx.fillRect(
        (box.x - PATH_WIDTH) * scale,
        (box.y - PATH_WIDTH) * scale,
        (box.width + 2 * PATH_WIDTH) * scale,
        PATH_WIDTH * scale
      );
      // Bottom path
      ctx.fillRect(
        (box.x - PATH_WIDTH) * scale,
        (box.y + box.length) * scale,
        (box.width + 2 * PATH_WIDTH) * scale,
        PATH_WIDTH * scale
      );
      // Left path
      ctx.fillRect(
        (box.x - PATH_WIDTH) * scale,
        (box.y - PATH_WIDTH) * scale,
        PATH_WIDTH * scale,
        (box.length + 2 * PATH_WIDTH) * scale
      );
      // Right path
      ctx.fillRect(
        (box.x + box.width) * scale,
        (box.y - PATH_WIDTH) * scale,
        PATH_WIDTH * scale,
        (box.length + 2 * PATH_WIDTH) * scale
      );
    });

    // Grid overlay
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvasRef.current.width; i += scale) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasRef.current.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvasRef.current.height; i += scale) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasRef.current.width, i);
      ctx.stroke();
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [boxes]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-auto border-2 border-green-100 rounded-lg bg-white"
      />
      <div className="absolute bottom-2 right-2 bg-white/80 text-xs text-green-600 px-2 py-1 rounded">
        1 square = 1m²
      </div>
    </div>
  );
};