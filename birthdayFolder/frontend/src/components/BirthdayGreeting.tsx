import React, { useEffect, useRef } from 'react';
import './BirthdayGreeting.css';

// Define the options interface
interface LetterOptions {
  charSize: number;
  fireworksSpawnTime: number;
}

// Main BirthdayGreeting component
const BirthdayGreeting: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const opts: LetterOptions = { charSize: 60, fireworksSpawnTime: 5000 }; // Increased charSize for better visibility

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to fill the window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const phrase = 'HAPPY BIRTHDAY!';
    const letters: Letter[] = [];

    // Set festive font
    ctx.font = `${opts.charSize}px Pacifico, cursive`; // Use a more festive font
    ctx.textBaseline = 'middle';

    // Measure total width to center the phrase
    const phraseMetrics = ctx.measureText(phrase);
    const totalWidth = phraseMetrics.width;
    let startX = (w - totalWidth) / 2;
    const startY = h / 2;

    // Create Letter instances
    for (let i = 0; i < phrase.length; i++) {
      const char = phrase[i];
      const charWidth = ctx.measureText(char).width;
      const letter = new Letter(
        char,
        startX,
        startY,
        opts,
        ctx
      );
      letters.push(letter);
      startX += charWidth;
    }

    // Fireworks setup
    const fireworks: Firework[] = [];
    const particles: Particle[] = [];
    let lastFireworkTime = Date.now();

    // Animation loop
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, w, h);

      // Update and draw letters
      letters.forEach((letter) => {
        letter.update(delta);
        letter.draw(ctx);
      });

      // Handle fireworks spawning
      if (Date.now() - lastFireworkTime > opts.fireworksSpawnTime) {
        fireworks.push(new Firework(w, h));
        lastFireworkTime = Date.now();
      }

      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update(delta, particles);
        fireworks[i].draw(ctx);
        if (fireworks[i].isDone()) {
          fireworks.splice(i, 1);
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(delta);
        particles[i].draw(ctx);
        if (particles[i].isDone()) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    // Cleanup function
    return () => {
      // Any necessary cleanup can be handled here
    };
  }, [opts.charSize, opts.fireworksSpawnTime]);

  return (
    <div className="greeting-container">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

// Letter Class to handle individual letters
class Letter {
  char: string;
  x: number;
  y: number;
  targetY: number;
  dy: number;
  color: { r: number; g: number; b: number };
  alpha: number;
  opts: LetterOptions;
  font: string;

  constructor(char: string, x: number, y: number, opts: LetterOptions, ctx: CanvasRenderingContext2D) {
    this.char = char;
    this.x = x;
    this.y = y + 100; // Start below the target position
    this.targetY = y;
    this.dy = - (opts.charSize / 2) / 1000; // Adjust speed based on delta time
    this.color = this.getRandomColor();
    this.alpha = 0;
    this.opts = opts;
    this.font = `${opts.charSize}px Pacifico, cursive`;
  }

  update(delta: number) {
    // Animate letter moving up to target position
    if (this.y > this.targetY) {
      this.y += this.dy * delta;
      if (this.y < this.targetY) {
        this.y = this.targetY;
      }
    }

    // Fade in effect
    if (this.alpha < 1) {
      this.alpha += delta / 1000; // Fade in over 1 second
      if (this.alpha > 1) this.alpha = 1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = this.font;
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
    ctx.fillText(this.char, this.x, this.y);
  }

  getRandomColor() {
    // Generate vibrant colors
    const colors = [
      { r: 255, g: 105, b: 180 }, // Hot Pink
      { r: 30, g: 144, b: 255 },  // Dodger Blue
      { r: 255, g: 215, b: 0 },    // Gold
      { r: 50, g: 205, b: 50 },    // Lime Green
      { r: 138, g: 43, b: 226 },   // Blue Violet
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

// Firework Class to handle individual fireworks
class Firework {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  exploded: boolean;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = canvasHeight;
    this.targetY = Math.random() * (canvasHeight / 2);
    this.speed = 5 + Math.random() * 3;
    this.exploded = false;
  }

  update(delta: number, particlesArray: Particle[]) {
    if (!this.exploded) {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.explode(particlesArray);
        this.exploded = true;
      }
    }
  }

  explode(particlesArray: Particle[]) {
    const numParticles = 100;
    for (let i = 0; i < numParticles; i++) {
      particlesArray.push(new Particle(this.x, this.y));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    }
  }

  isDone() {
    return this.exploded;
  }
}

// Particle Class to handle particles from fireworks
class Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  alpha: number;
  life: number;
  color: { r: number; g: number; b: number };

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 2;
    this.dx = Math.cos(angle) * speed;
    this.dy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.life = 1000; // in milliseconds
    this.color = this.getRandomColor();
  }

  update(delta: number) {
    this.x += this.dx;
    this.y += this.dy;
    this.alpha -= delta / this.life;
    if (this.alpha < 0) this.alpha = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
    ctx.fill();
  }

  isDone() {
    return this.alpha <= 0;
  }

  getRandomColor() {
    // Bright colors for particles
    const colors = [
      { r: 255, g: 69, b: 0 },    // Orange Red
      { r: 255, g: 140, b: 0 },  // Dark Orange
      { r: 255, g: 215, b: 0 },  // Gold
      { r: 0, g: 191, b: 255 },  // Deep Sky Blue
      { r: 138, g: 43, b: 226 }, // Blue Violet
      { r: 255, g: 20, b: 147 }, // Deep Pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export default BirthdayGreeting;
