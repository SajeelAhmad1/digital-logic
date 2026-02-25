'use client';

import React, { useEffect, useState } from 'react';
import '../../styles/login.css';
import Button from '../Elements/Button';
import Header from '../Header/Header';
import Input from '../Elements/Input';
import Menu from '../Elements/Menu';
import { signIn, signOut } from 'next-auth/react';
import SocialLogin from './Social';

const Login = () => {
  const [loginMenuIndex, setLoginMenuIndex] = useState(0);

  const isEmail = React.useMemo(() => {
    return loginMenuIndex == 0;
  }, [loginMenuIndex]);

  return (
    <>
      <form action="">
        <div className="login">
          <div className="header">
            <Header />
          </div>
          <div className="login-content">
            <div className="hello">
              <Menu
                menuItems={['Email', 'Phone']}
                selected={loginMenuIndex}
                setSelected={setLoginMenuIndex}
              />
            </div>
            <Input
              placeholder={`Enter your ${
                ['Email', 'Phone Number'][loginMenuIndex]
              }`}
              type="text"
            />
            {isEmail && (
              <Input placeholder="Enter your password" type="password" />
            )}
            <div className="tou-check">
              <input type="checkbox" className="checkbox" />
              <p className="checkbox-text">Keep me signed in</p>
            </div>
            <Button text="Login" type="submit" />
            <p className="forgot-password">Forgot Password?</p>
            <p className="account-info">
              Don&apos;t have an account?{' '}
              <span className="login-btn">Sign Up</span>
            </p>
          </div>
        </div>
        <div className="help">
          <a href="#">Help!</a>
        </div>
      </form>
      <SocialLogin />
    </>
  );
};

export default Login;
