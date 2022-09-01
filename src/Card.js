import React, { useState } from 'react';
import './Card.css';

const Card = ({ name, image }) => {
  return (
    <div className="box">
      <div className="imgwrap">
        <img className="Card" alt={name} src={image} />
      </div>
    </div>
  );
};

export default Card;
