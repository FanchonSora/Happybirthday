import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NameForm.css';
import amusementPark from '../images/amusement-park.png';
import balloons from '../images/balloons.png';
import gift from '../images/gift.png';

const NameForm: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (name: string) => {
    navigate(`/card`);
  };

  return (
    <div className="nameform-container">
      <div className="first--slide">
        <div className="slide--content">
          <h1>Chào mừng đến với</h1>
          <h2>Thiệp Sinh Nhật</h2>
          {/* Các phần tử trang trí */}
          <span className="top"></span>
          <span className="right"></span>
          <span className="bottom"></span>
          <span className="left"></span>
        </div>

        <div className="slide--content--one">
          <h1 className="first">Chọn tên bạn muốn chúc mừng</h1>
          <div className="circle--stuff">
            {/* SVG từ mẫu HTML hoặc các SVG động khác */}
            <svg
              viewBox="0 0 288 48"
              width="288"
              height="48"
              style={{ overflow: 'visible' }}
            >
              {/* (Chèn các phần tử SVG từ mẫu HTML vào đây nếu cần) */}
              {/* ... */}
            </svg>
          </div>
        </div>
      </div>

      <div className="name-options">
        <button className="name-button" onClick={() => handleSelect('Nhật')}>
          Nhật
        </button>
        <button className="name-button" onClick={() => handleSelect('Uyên')}>
          Uyên
        </button>
      </div>

      {/* Thêm các icon từ thư mục images */}
      <div className="additional-icons">
        <img src={amusementPark} alt="Amusement Park" className="additional-icon" />
        <img src={balloons} alt="Balloons" className="additional-icon" />
        <img src={gift} alt="Gift" className="additional-icon" />
      </div>
    </div>
  );
};

export default NameForm;
