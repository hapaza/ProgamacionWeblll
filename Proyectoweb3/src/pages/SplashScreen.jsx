import React from 'react';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="splash-logo">
        <span>⚡</span>
      </div>
      <h1 className="splash-title">IGNISTER</h1>
      <button 
        className="btn btn-primary" 
        style={{ marginTop: '40px' }}
        onClick={() => window.location.reload()}
      >
        Iniciar Experiencia
      </button>
    </div>
  );
};

export default SplashScreen;