import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import './BirthdayCard.css';
import { FaGift, FaHeart, FaStar } from 'react-icons/fa'; // Font Awesome Icons

const BirthdayCard: React.FC = () => {
  const navigate = useNavigate();
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    // Trigger confetti
    setIsConfettiActive(true);

    // Flip the card after a short delay
    setTimeout(() => {
      setIsFlipped(true);
      setIsConfettiActive(false);
    }, 2000);

    // Navigate to '/greeting' after animation
    setTimeout(() => {
      navigate('/greeting');
    }, 3000);
  };

  return (
    <div
      className="card-container"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Birthday Card"
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {isConfettiActive && <Confetti numberOfPieces={500} />}
      <div className={`birthday-card ${isFlipped ? 'flip' : ''}`}>
        <div className="front">
          <div className="decorations">
            <FaGift />
            <FaHeart />
            <FaStar />
          </div>
          <h1>Chúc Mừng Sinh Nhật!</h1>
          <p>Nhấn vào thiệp để nhận lời chúc đặc biệt</p>
        </div>
        <div className="back">
          <h2>Mong Bạn Một Ngày Tuyệt Vời!</h2>
          <p>Chúc bạn luôn vui vẻ và thành công trong năm mới.</p>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
