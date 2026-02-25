import { useState } from 'react';
import '../../styles/elements.css';

interface Props {
  text: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

const Button = ({ text, style, type, loading }: Props) => {
  return (
    <button className="btn" style={style} type={type}>
      {loading ? '...' : text}
    </button>
  );
};

export default Button;
