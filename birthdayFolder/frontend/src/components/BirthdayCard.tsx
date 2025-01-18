// src/components/BirthdayCard.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import './BirthdayCard.css';
import amusementPark from '../images/amusement-park.png';
import balloons from '../images/balloons.png';
import gift from '../images/gift.png';

// Interface cho tùy chọn chữ và pháo hoa
interface LetterOptions {
  charSize: number;
  fireworksSpawnTime: number;
}

// Lớp Letter để hiển thị các chữ cái trên canvas
class Letter {
  char: string;
  x: number;
  y: number;
  opacity: number;
  options: LetterOptions;
  ctx: CanvasRenderingContext2D;

  constructor(char: string, x: number, y: number, options: LetterOptions, ctx: CanvasRenderingContext2D) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.opacity = 0;
    this.options = options;
    this.ctx = ctx;
  }

  update(delta: number) {
    if (this.opacity < 1) {
      this.opacity += delta / 1000; // Tăng opacity theo thời gian
      if (this.opacity > 1) this.opacity = 1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#1e90ff'; // Màu xanh biển
    ctx.fillText(this.char, this.x, this.y);
    ctx.restore();
  }
}

// Lớp Firework để tạo hiệu ứng pháo hoa
class Firework {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  exploded: boolean;
  particles: Particle[];

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = h;
    this.targetY = Math.random() * h / 2;
    this.speed = 2 + Math.random() * 3;
    this.exploded = false;
    this.particles = [];
  }

  update(delta: number, particlesArray: Particle[]) {
    if (!this.exploded) {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.exploded = true;
        const count = 50 + Math.random() * 50;
        for (let i = 0; i < count; i++) {
          particlesArray.push(new Particle(this.x, this.y));
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.exploded) {
      ctx.save();
      ctx.fillStyle = '#ff69b4'; // Màu hồng
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  isDone() {
    return this.exploded;
  }
}

// Lớp Particle để tạo hiệu ứng phân tán của pháo hoa
class Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  alpha: number;
  decay: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    this.velocityX = Math.cos(angle) * speed;
    this.velocityY = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = 0.015 + Math.random() * 0.015;
  }

  update(delta: number) {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.alpha -= this.decay * delta;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#ff69b4'; // Màu hồng
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isDone() {
    return this.alpha <= 0;
  }
}

const BirthdayCard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const opts: LetterOptions = { charSize: 60, fireworksSpawnTime: 5000 };

  // Lấy name1 và name2 từ query params
  const searchParams = new URLSearchParams(location.search);
  const name1 = searchParams.get('name1') || 'Nhật';
  const name2 = searchParams.get('name2') || 'Uyên';

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
    const phrase = `Chúc Mừng Sinh Nhật ${name1} & ${name2}!`;
    const letters: Letter[] = [];

    // Set festive font
    ctx.font = `${opts.charSize}px Pacifico, cursive`;
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
      const letter = new Letter(char, startX, startY, opts, ctx);
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
  }, [opts.charSize, opts.fireworksSpawnTime, name1, name2]);

  const handleClick = () => {
    // Bắn Confetti
    setConfettiPieces(500); // Số lượng confetti tùy chọn

    // Sau 3 giây thì chuyển sang trang chính hoặc trang khác
    setTimeout(() => {
      navigate(`/`); // Chuyển về trang chọn tên hoặc nơi khác tùy ý
    }, 3000);
  };

  return (
    <div className="card-container" onClick={handleClick}>
      {confettiPieces > 0 && <Confetti numberOfPieces={confettiPieces} />}
      <div className={`birthday-card`}>
        {/* Mặt trước */}
        <div className="front">
          <div className="decorations">
            {/* Thêm các icon từ thư mục images */}
            <img src={amusementPark} alt="Amusement Park" className="decoration-icon" />
            <img src={balloons} alt="Balloons" className="decoration-icon" />
            <img src={gift} alt="Gift" className="decoration-icon" />
            {/* Bạn có thể thêm nhiều icon hơn tùy ý */}
          </div>
          <h1>Chúc Mừng Sinh Nhật {name1} & {name2}!</h1>
          <p>Nhấn vào thiệp để nhận lời chúc đặc biệt</p>
        </div>

        {/* Mặt sau */}
        <div className="back">
          <h2>Mong {name1} và {name2} có một ngày tuyệt vời!</h2>
          <p>Chúc hai bạn luôn vui vẻ và thành công trong năm mới.</p>
          {/* Thêm các icon hoặc hình ảnh nếu cần */}
          <div className="back-decorations">
            <img src={balloons} alt="Balloons" className="back-icon" />
            <img src={gift} alt="Gift" className="back-icon" />
          </div>
        </div>
      </div>

      {/* Canvas cho hiệu ứng đồ họa */}
      <canvas ref={canvasRef} className="background-canvas"></canvas>
    </div>
  );
};

export default BirthdayCard;
