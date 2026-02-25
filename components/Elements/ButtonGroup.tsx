import '@/components/Elements/Button';
import Image from 'next/image';
// import "../../styles/elements.css";

interface Props {
  text: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  icon: string;
}

const Button = ({ text, style, type, icon }: Props) => {
  return (
    <div className="btn-dropdown">
      <button className="btn-group" style={style} type={type}>
        {text}
      </button>
      <Image src={icon} alt="" className="dropdown" />
    </div>
  );
};

export default Button;
