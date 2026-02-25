import React from 'react';
import '../../styles/verification.css';
import Input from '../Elements/Input';
import Header from '../Header/Header';
import Button from '../Elements/Button';

const index = () => {
  return (
    <div className="container-verification">
      <div className="header">
        <Header />
      </div>
      <div className="verification">
        <div className="heading">Email Verification!</div>
        <div>
          <Input placeholder="Enter your email" type="email" />
        </div>
        <p className="send-again">
          <a href="#">send again!</a>
        </p>
        <div className="verification-btn">
          <Button text="Click Here To Verify" />
        </div>
      </div>
    </div>
  );
};

export default index;
