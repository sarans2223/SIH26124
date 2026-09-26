import React, { useEffect, useRef } from 'react';

/**
 * Visual evidence thumbnail generator rendering simulated camera feed
 * with AI bounding box overlay & confidence badge.
 */
export const EvidenceCanvas = ({ item, width = 360, height = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw realistic asphalt / road background
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, width, height);

    // Add noise & texture to simulate road surface
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const opacity = Math.random() * 0.12;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fillRect(x, y, Math.random() * 2, Math.random() * 2);
    }

    // Draw lane markings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.moveTo(width * 0.15, 0);
    ctx.lineTo(width * 0.25, height);
    ctx.stroke();

    // Defect or infra detection subject
    const bbox = item?.yoloBox || { x: 35, y: 30, width: 35, height: 35 };
    const boxX = (bbox.x / 100) * width;
    const boxY = (bbox.y / 100) * height;
    const boxW = (bbox.width / 100) * width;
    const boxH = (bbox.height / 100) * height;

    // Defect anomaly graphic in canvas
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(217, 48, 37, 0.35)';
    ctx.beginPath();
    ctx.ellipse(boxX + boxW / 2, boxY + boxH / 2, boxW / 2.2, boxH / 2.2, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Crack lines or inner detail inside bounding box
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boxX + 4, boxY + boxH / 2);
    ctx.lineTo(boxX + boxW - 4, boxY + boxH / 2 + 2);
    ctx.lineTo(boxX + boxW / 2, boxY + boxH - 4);
    ctx.stroke();

    // Draw Flat Bounding Box
    const boxColor = item?.severity === 'Critical' ? '#D93025' : 
                     item?.status === 'MISSING' ? '#D93025' : '#1A73E8';
    ctx.strokeStyle = boxColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Label Badge above Bounding Box
    const labelText = `${item?.type || item?.category || 'Defect'} ${(item?.confidence || 94.2).toFixed(1)}%`;
    ctx.font = '500 11px Inter, sans-serif';
    const textWidth = ctx.measureText(labelText).width;
    
    ctx.fillStyle = boxColor;
    ctx.fillRect(boxX, Math.max(0, boxY - 18), textWidth + 8, 18);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(labelText, boxX + 4, Math.max(12, boxY - 5));

    // Camera Watermark in top corner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(8, 8, 175, 20);
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(`CAM-FLEET-04 [REC] | ${item?.lastDetected || item?.lastCameraPass || '2026-09-23'}`, 14, 22);

  }, [item, width, height]);

  return (
    <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-800">
      <canvas ref={canvasRef} width={width} height={height} className="w-full h-auto block object-cover" />
      <div className="absolute bottom-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] text-slate-200">
        AI Camera Telemetry Verified
      </div>
    </div>
  );
};

export default EvidenceCanvas;
