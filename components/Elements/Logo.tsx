import Image from 'next/image';
import '../../styles/elements.css';
import LogoImg from '@/public/assets/common/logo.svg';

const Logo = () => {
  return (
    <div className="logo">
      <Image src={LogoImg} alt="" className="logo-img" />
    </div>
  );
};

export default Logo;
