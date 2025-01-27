"use client";

import React, { useEffect, useRef } from "react";

interface BackgroundAnimationProps {
  opacity?: number;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({
  opacity = 0.1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<
    Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const scale = window.devicePixelRatio;
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      ctx.scale(scale, scale);
    };

    const getRandomColor = () => {
      const colors = [
        "rgba(0, 123, 255, 0.5)", // Primary Blue
        "rgba(255, 165, 0, 0.4)", // Accent Orange
        "rgba(245, 245, 220, 0.3)", // Neutral Light
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const initParticles = () => {
      particles.current = Array.from({ length: 25 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 200 + 100, // Reduced size range
        speedX: Math.random() * 0.6 - 0.3, // Slightly faster
        speedY: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.3 + 0.4, // Higher opacity range
        color: getRandomColor(),
      }));
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity * opacity;

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.6, particle.color.replace("0.5)", "0.2)"));
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        mixBlendMode: "multiply",
      }}
    />
  );
};

export default BackgroundAnimation;
