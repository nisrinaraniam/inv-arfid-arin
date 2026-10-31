import React, { useEffect, useRef, useState } from 'react';

const Ir = { left: 33, top: 25, width: 34.1, height: 50.2 };

export const PearlScratch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;

      // Base background cream
      ctx.fillStyle = 'rgb(235,227,215)';
      ctx.fillRect(0, 0, w, h);

      // Scratch paper texture overlay
      const img = new Image();
      img.onload = async () => {
        try {
          await document.fonts.load('40px "Allura"');
        } catch {}
        const scale = Math.max(w / img.width, h / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);

        ctx.fillStyle = 'hsla(212, 22%, 38%, 0.85)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${Math.max(18, w * 0.17)}px "Allura", cursive`;
        ctx.fillText('Scratch', w / 2, h / 2 - w * 0.09);
        ctx.fillText('here', w / 2, h / 2 + w * 0.09);
      };
      img.src = '/__l5e/assets-v1/70380a8c-b7c8-4109-84b1-27805ab5240b/scratch-paper.png';
    };

    let initialized = false;
    const ro = new ResizeObserver(() => {
      if (initialized) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return;
      initialized = true;
      initCanvas();
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pt = getPos(e);
    const brushRadius = canvas.getBoundingClientRect().width * 0.09;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushRadius * 2;
    ctx.beginPath();
    const prev = lastPoint.current ?? pt;
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    lastPoint.current = pt;
  };

  const checkCompletion = () => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let total = 0;
      let cleared = 0;
      for (let i = 3; i < imgData.length; i += 4 * 16) {
        total++;
        if (imgData[i] === 0) cleared++;
      }
      if (cleared / total > 0.55) {
        setRevealed(true);
      }
    } catch {}
  };

  return (
    <section className="relative w-full scratch-section">
      <img
        src="/__l5e/assets-v1/ea706195-2fc3-4d23-8938-50abb38d7ae7/welcome-families.webp"
        alt="Pearl frame of Arfid & Arin"
        className="block w-full h-auto select-none"
        loading="lazy"
        draggable={false}
      />
      <div
        className="absolute overflow-hidden"
        style={{
          left: `${Ir.left}%`,
          top: `${Ir.top}%`,
          width: `${Ir.width}%`,
          height: `${Ir.height}%`,
          borderRadius: '50%',
        }}
      >
        <img
          src="/assets/couple/couple-hill-run.jpg"
          alt="Arfid & Arin"
          className="absolute inset-0 w-full h-full object-cover select-none"
          draggable={false}
        />
        <canvas
          ref={canvasRef}
          role="button"
          tabIndex={0}
          aria-label="Reveal photo of Arfid & Arin"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setRevealed(true);
            }
          }}
          className="absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-700"
          style={{
            touchAction: 'none',
            opacity: revealed ? 0 : 1,
            pointerEvents: revealed ? 'none' : 'auto',
          }}
          onPointerDown={(e) => {
            isDrawing.current = true;
            lastPoint.current = null;
            e.currentTarget.setPointerCapture(e.pointerId);
            draw(e);
          }}
          onPointerMove={draw}
          onPointerUp={() => {
            isDrawing.current = false;
            lastPoint.current = null;
            checkCompletion();
          }}
          onPointerCancel={() => {
            isDrawing.current = false;
            lastPoint.current = null;
          }}
        />
      </div>
      <div
        aria-hidden={true}
        className="absolute pointer-events-none"
        style={{
          left: `${Ir.left}%`,
          top: `${Ir.top}%`,
          width: `${Ir.width}%`,
          height: `${Ir.height}%`,
          borderRadius: '50%',
          boxShadow:
            '0 0 0 3px hsl(40 45% 72%), 0 0 0 5px hsl(40 30% 92%), 0 0 0 6px hsl(40 40% 62%), 0 0 0 12px hsla(40 30% 96% / 0.55), 0 0 0 13px hsl(40 40% 66%), 0 6px 18px hsla(212 22% 30% / 0.25), inset 0 0 10px hsla(40 40% 40% / 0.35)',
        }}
      />
    </section>
  );
};
