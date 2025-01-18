import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import './BirthdayCard.css';
import amusementPark from '../images/amusement-park.png';
import balloons from '../images/balloons.png';
import gift from '../images/gift.png';

const BirthdayCard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="card-container" onClick={handleFlip}>
      <div className={`birthday-card ${isFlipped ? 'flip' : ''}`}>
        {/* Mặt trước */}
        <div className="front">
          <h1>HAPPY BIRTHDAY</h1>
          <p>Click to see the back</p>
          
        </div>

        {/* Mặt sau */}
        <div className="back">
          <h2>Wishing you a great day!</h2>
          <p>May you always be happy and successful in the new year.</p>
          <div className="additional-icon">
            <img src={balloons} alt="Balloons" className="additional-icon" />
            <img src={gift} alt="Gift" className="additional-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
