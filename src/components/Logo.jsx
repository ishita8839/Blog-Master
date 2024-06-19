import React from 'react';
import image1 from '../assets/b.png';

function Logo({ width = '40px', height = '40px' }) {
  return (
    <div>
      <img src={image1} alt="this is an image" style={{ width, height }} />
    </div>
  );
}

export default Logo;