import React, { useEffect, useRef } from 'react';

/**
 * Animated Multi-Colored Cyberpunk Sine Wave & Synthwave Grid Background
 * High-performance canvas animation with flowing neon waves and vibrant gradients.
 */
export const CyberpunkWaveBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Multi-colored cyberpunk wave definitions
    const WAVES = [
      { color: 'rgba(255, 0, 128, 0.35)', stroke: '#ff007f', speed: 0.025, freq: 0.008, amp: 45, yOffset: 0.72 },
      { color: 'rgba(0, 240, 255, 0.28)', stroke: '#00f0ff', speed: 0.035, freq: 0.012, amp: 38, yOffset: 0.78 },
      { color: 'rgba(121, 40, 202, 0.35)', stroke: '#7928ca', speed: 0.02, freq: 0.006, amp: 55, yOffset: 0.83 },
      { color: 'rgba(0, 255, 136, 0.22)', stroke: '#00ff88', speed: 0.04, freq: 0.015, amp: 30, yOffset: 0.88 },
      { color: 'rgba(255, 210, 63, 0.25)', stroke: '#ffd23f', speed: 0.03, freq: 0.01, amp: 25, yOffset: 0.92 },
    ];

    const render = () => {
      step++;
      const w = canvas.width;
      const h = canvas.height;

      // Deep cyberpunk dark night backdrop
      ctx.fillStyle = '#060210';
      ctx.fillRect(0, 0, w, h);

      // Cyberpunk perspective horizon grid
      const horizonY = h * 0.55;
      ctx.strokeStyle = 'rgba(76, 201, 240, 0.08)';
      ctx.lineWidth = 1;

      // Vanishing point perspective lines
      const vpX = w / 2;
      for (let x = -w * 0.5; x <= w * 1.5; x += w / 12) {
        ctx.beginPath();
        ctx.moveTo(vpX, horizonY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Horizontal retro grid lines moving forward
      const gridOffset = (step * 0.8) % 30;
      for (let y = horizonY; y <= h; y += 18) {
        const lineY = y + gridOffset;
        if (lineY <= h) {
          const alpha = ((lineY - horizonY) / (h - horizonY)) * 0.2;
          ctx.strokeStyle = `rgba(255, 77, 109, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(0, lineY);
          ctx.lineTo(w, lineY);
          ctx.stroke();
        }
      }

      // Draw undulating multi-colored cyberpunk waves
      WAVES.forEach((wave, idx) => {
        const baseY = h * wave.yOffset;
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, baseY);

        for (let x = 0; x <= w; x += 6) {
          const y =
            baseY +
            Math.sin(x * wave.freq + step * wave.speed) * wave.amp +
            Math.cos(x * wave.freq * 0.5 + step * wave.speed * 0.7) * (wave.amp * 0.4);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();

        // Wave fill with neon tint
        ctx.fillStyle = wave.color;
        ctx.fill();

        // Glowing neon crest stroke
        ctx.strokeStyle = wave.stroke;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = wave.stroke;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Ambient floating cyberpunk dust particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let i = 0; i < 18; i++) {
        const px = (i * 73 + step * 0.4) % w;
        const py = (i * 47 + Math.sin(step * 0.02 + i) * 20) % (h * 0.7);
        ctx.fillRect(px, py, 2, 2);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-75"
    />
  );
};
