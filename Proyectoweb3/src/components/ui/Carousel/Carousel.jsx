import React, { useState, useEffect } from 'react';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div style={{ position: 'relative', height: '400px', overflow: 'hidden', borderRadius: '12px', marginBottom: '40px' }}>
      {images.map((img, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transition: 'opacity 0.5s ease',
            opacity: index === currentIndex ? 1 : 0,
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      ))}
      <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: idx === currentIndex ? '#00CED1' : '#D3D3D3',
              border: 'none',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;