import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface FluidCanvasProps {
  width: number;
  height: number;
  viscosity: number;
  diffusion: number;
  flowSpeed: number;
  gridResolution: number;
  stepSize: number;
  visualizationMode: 'velocity' | 'pressure' | 'vorticity';
  isPlaying: boolean;
  showParticles: boolean;
  onExport: (canvas: HTMLCanvasElement) => void;
}

interface FluidGrid {
  u: number[][];
  v: number[][];
  u_prev: number[][];
  v_prev: number[][];
  dens: number[][];
  dens_prev: number[][];
}

export default function FluidCanvas({
  width,
  height,
  viscosity,
  diffusion,
  flowSpeed,
  gridResolution,
  stepSize,
  visualizationMode,
  isPlaying,
  showParticles,
  onExport
}: FluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const fluidGridRef = useRef<FluidGrid | undefined>(undefined);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number }>>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const initializeGrid = useCallback(() => {
    const N = gridResolution;
    const grid: FluidGrid = {
      u: Array(N + 2).fill(null).map(() => Array(N + 2).fill(0)),
      v: Array(N + 2).fill(null).map(() => Array(N + 2).fill(0)),
      u_prev: Array(N + 2).fill(null).map(() => Array(N + 2).fill(0)),
      v_prev: Array(N + 2).fill(null).map(() => Array(N + 2).fill(0)),
      dens: Array(N + 2).fill(null).map(() => Array(N + 2).fill(0)),
      dens_prev: Array(N + 2).fill(null).map(() => Array(N + 2).fill(0)),
    };
    fluidGridRef.current = grid;
  }, [gridResolution]);

  const addDensity = useCallback((x: number, y: number, amount: number) => {
    const grid = fluidGridRef.current;
    if (!grid) return;
    
    const N = gridResolution;
    const i = Math.floor((x / width) * N) + 1;
    const j = Math.floor((y / height) * N) + 1;
    
    if (i >= 1 && i <= N && j >= 1 && j <= N) {
      grid.dens_prev[i][j] += amount;
    }
  }, [gridResolution, width, height]);

  const addVelocity = useCallback((x: number, y: number, vx: number, vy: number) => {
    const grid = fluidGridRef.current;
    if (!grid) return;
    
    const N = gridResolution;
    const i = Math.floor((x / width) * N) + 1;
    const j = Math.floor((y / height) * N) + 1;
    
    if (i >= 1 && i <= N && j >= 1 && j <= N) {
      grid.u_prev[i][j] += vx * flowSpeed;
      grid.v_prev[i][j] += vy * flowSpeed;
    }
  }, [gridResolution, width, height, flowSpeed]);

  const setBoundary = useCallback((b: number, x: number[][]) => {
    const N = gridResolution;
    
    for (let i = 1; i <= N; i++) {
      x[0][i] = b === 1 ? -x[1][i] : x[1][i];
      x[N + 1][i] = b === 1 ? -x[N][i] : x[N][i];
      x[i][0] = b === 2 ? -x[i][1] : x[i][1];
      x[i][N + 1] = b === 2 ? -x[i][N] : x[i][N];
    }
    
    x[0][0] = 0.5 * (x[1][0] + x[0][1]);
    x[0][N + 1] = 0.5 * (x[1][N + 1] + x[0][N]);
    x[N + 1][0] = 0.5 * (x[N][0] + x[N + 1][1]);
    x[N + 1][N + 1] = 0.5 * (x[N][N + 1] + x[N + 1][N]);
  }, [gridResolution]);

  const diffuse = useCallback((b: number, x: number[][], x0: number[][], diff: number, dt: number) => {
    const N = gridResolution;
    const a = dt * diff * N * N;
    
    for (let k = 0; k < 20; k++) {
      for (let i = 1; i <= N; i++) {
        for (let j = 1; j <= N; j++) {
          x[i][j] = (x0[i][j] + a * (x[i - 1][j] + x[i + 1][j] + x[i][j - 1] + x[i][j + 1])) / (1 + 4 * a);
        }
      }
      setBoundary(b, x);
    }
  }, [gridResolution, setBoundary]);

  const advect = useCallback((b: number, d: number[][], d0: number[][], u: number[][], v: number[][], dt: number) => {
    const N = gridResolution;
    const dt0 = dt * N;
    
    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= N; j++) {
        let x = i - dt0 * u[i][j];
        let y = j - dt0 * v[i][j];
        
        if (x < 0.5) x = 0.5;
        if (x > N + 0.5) x = N + 0.5;
        const i0 = Math.floor(x);
        const i1 = i0 + 1;
        
        if (y < 0.5) y = 0.5;
        if (y > N + 0.5) y = N + 0.5;
        const j0 = Math.floor(y);
        const j1 = j0 + 1;
        
        const s1 = x - i0;
        const s0 = 1 - s1;
        const t1 = y - j0;
        const t0 = 1 - t1;
        
        d[i][j] = s0 * (t0 * d0[i0][j0] + t1 * d0[i0][j1]) + s1 * (t0 * d0[i1][j0] + t1 * d0[i1][j1]);
      }
    }
    setBoundary(b, d);
  }, [gridResolution, setBoundary]);

  const project = useCallback((u: number[][], v: number[][], p: number[][], div: number[][]) => {
    const N = gridResolution;
    const h = 1.0 / N;
    
    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= N; j++) {
        div[i][j] = -0.5 * h * (u[i + 1][j] - u[i - 1][j] + v[i][j + 1] - v[i][j - 1]);
        p[i][j] = 0;
      }
    }
    setBoundary(0, div);
    setBoundary(0, p);
    
    for (let k = 0; k < 20; k++) {
      for (let i = 1; i <= N; i++) {
        for (let j = 1; j <= N; j++) {
          p[i][j] = (div[i][j] + p[i - 1][j] + p[i + 1][j] + p[i][j - 1] + p[i][j + 1]) / 4;
        }
      }
      setBoundary(0, p);
    }
    
    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= N; j++) {
        u[i][j] -= 0.5 * (p[i + 1][j] - p[i - 1][j]) / h;
        v[i][j] -= 0.5 * (p[i][j + 1] - p[i][j - 1]) / h;
      }
    }
    setBoundary(1, u);
    setBoundary(2, v);
  }, [gridResolution, setBoundary]);

  const velocityStep = useCallback((u: number[][], v: number[][], u0: number[][], v0: number[][], visc: number, dt: number) => {
    const N = gridResolution;
    const temp1 = Array(N + 2).fill(null).map(() => Array(N + 2).fill(0));
    const temp2 = Array(N + 2).fill(null).map(() => Array(N + 2).fill(0));
    
    // Add forces
    for (let i = 0; i < N + 2; i++) {
      for (let j = 0; j < N + 2; j++) {
        u[i][j] += dt * u0[i][j];
        v[i][j] += dt * v0[i][j];
      }
    }
    
    // Diffuse
    for (let i = 0; i < N + 2; i++) {
      for (let j = 0; j < N + 2; j++) {
        temp1[i][j] = u[i][j];
        temp2[i][j] = v[i][j];
      }
    }
    diffuse(1, u, temp1, visc, dt);
    diffuse(2, v, temp2, visc, dt);
    
    // Project
    project(u, v, temp1, temp2);
    
    // Advect
    for (let i = 0; i < N + 2; i++) {
      for (let j = 0; j < N + 2; j++) {
        temp1[i][j] = u[i][j];
        temp2[i][j] = v[i][j];
      }
    }
    advect(1, u, temp1, temp1, temp2, dt);
    advect(2, v, temp2, temp1, temp2, dt);
    
    // Project again
    project(u, v, temp1, temp2);
  }, [gridResolution, diffuse, advect, project]);

  const densityStep = useCallback((x: number[][], x0: number[][], u: number[][], v: number[][], diff: number, dt: number) => {
    const N = gridResolution;
    const temp = Array(N + 2).fill(null).map(() => Array(N + 2).fill(0));
    
    // Add sources
    for (let i = 0; i < N + 2; i++) {
      for (let j = 0; j < N + 2; j++) {
        x[i][j] += dt * x0[i][j];
      }
    }
    
    // Diffuse
    for (let i = 0; i < N + 2; i++) {
      for (let j = 0; j < N + 2; j++) {
        temp[i][j] = x[i][j];
      }
    }
    diffuse(0, x, temp, diff, dt);
    
    // Advect
    for (let i = 0; i < N + 2; i++) {
      for (let j = 0; j < N + 2; j++) {
        temp[i][j] = x[i][j];
      }
    }
    advect(0, x, temp, u, v, dt);
  }, [gridResolution, diffuse, advect]);

  const updateParticles = useCallback(() => {
    const grid = fluidGridRef.current;
    if (!grid || !showParticles) return;
    
    const N = gridResolution;
    const particles = particlesRef.current;
    
    particles.forEach(particle => {
      const i = Math.floor((particle.x / width) * N) + 1;
      const j = Math.floor((particle.y / height) * N) + 1;
      
      if (i >= 1 && i <= N && j >= 1 && j <= N) {
        particle.vx = grid.u[i][j];
        particle.vy = grid.v[i][j];
        particle.x += particle.vx * stepSize * 10;
        particle.y += particle.vy * stepSize * 10;
        
        // Wrap around boundaries
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
      }
    });
  }, [gridResolution, width, height, stepSize, showParticles]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const grid = fluidGridRef.current;
    if (!canvas || !grid) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const N = gridResolution;
    const cellWidth = width / N;
    const cellHeight = height / N;
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Render fluid based on visualization mode, but lock dye to a single color if present
    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= N; j++) {
        const x = (i - 1) * cellWidth;
        const y = (j - 1) * cellHeight;

        // If there's dye in the cell, draw a consistent dye color and skip mode-based coloring
        const dye = grid.dens[i][j];
        if (dye > 0.01) {
          // Fixed neon aqua/green with alpha clamped
          ctx.fillStyle = `rgba(0, 255, 128, ${Math.min(dye, 1)})`;
          ctx.fillRect(x, y, cellWidth, cellHeight);
          continue;
        }

        // Otherwise render by visualization mode
        let intensity = 0;
        let hue = 0;
        switch (visualizationMode) {
          case 'velocity':
            intensity = Math.sqrt(grid.u[i][j] * grid.u[i][j] + grid.v[i][j] * grid.v[i][j]) * 50;
            hue = 240; // Blue
            break;
          case 'pressure':
            intensity = 0; // no density -> no pressure shading
            hue = 300; // Magenta (unused if intensity is 0)
            break;
          case 'vorticity':
            const vorticity = (grid.v[i + 1][j] - grid.v[i - 1][j]) - (grid.u[i][j + 1] - grid.u[i][j - 1]);
            intensity = Math.abs(vorticity) * 200;
            hue = vorticity > 0 ? 0 : 120; // Red for positive, green for negative
            break;
        }

        intensity = Math.min(intensity, 1);
        if (intensity > 0.01) {
          ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${intensity})`;
          ctx.fillRect(x, y, cellWidth, cellHeight);
        }
      }
    }
    
    // Render particles
    if (showParticles) {
      ctx.fillStyle = '#FF0080';
      particlesRef.current.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [gridResolution, width, height, visualizationMode, showParticles]);

  const simulate = useCallback(() => {
    const grid = fluidGridRef.current;
    if (!grid || !isPlaying) return;
    
    // Update fluid simulation
    velocityStep(grid.u, grid.v, grid.u_prev, grid.v_prev, viscosity, stepSize);
    densityStep(grid.dens, grid.dens_prev, grid.u, grid.v, diffusion, stepSize);
    
    // Clear previous arrays
    for (let i = 0; i < gridResolution + 2; i++) {
      for (let j = 0; j < gridResolution + 2; j++) {
        grid.u_prev[i][j] *= 0.99;
        grid.v_prev[i][j] *= 0.99;
        grid.dens_prev[i][j] *= 0.99;
        grid.dens[i][j] *= 0.995;
      }
    }
    
    updateParticles();
    render();
    
    animationRef.current = requestAnimationFrame(simulate);
  }, [isPlaying, viscosity, diffusion, stepSize, gridResolution, velocityStep, densityStep, updateParticles, render]);

  useEffect(() => {
    initializeGrid();
    
    // Add some initial particles
    if (showParticles) {
      particlesRef.current = Array.from({ length: 50 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
      }));
    }
  }, [initializeGrid, width, height, showParticles]);

  useEffect(() => {
    if (isPlaying) {
      simulate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, simulate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
      addDensity(x, y, 100);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (isMouseDown) {
        const dx = x - mousePos.x;
        const dy = y - mousePos.y;
        addVelocity(x, y, dx * 0.1, dy * 0.1);
        addDensity(x, y, 50);
      }
      
      setMousePos({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleExport = () => {
    if (canvasRef.current) {
      onExport(canvasRef.current);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative border-4 border-black shadow-[8px_8px_0px_#000000] bg-white"
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      <button
        onClick={handleExport}
        className="absolute top-4 right-4 px-3 py-1 bg-[#FF0080] text-white font-bold border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
      >
        📸 EXPORT
      </button>
    </motion.div>
  );
}