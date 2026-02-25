import '../../Styles/elements.css';

interface Props {
  label?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  type?: string;
  // icon?: string;
}

const Input = ({ label, placeholder, style, type }: Props) => {
  return (
    <div className="inputs">
      <label className="label">{label}</label>
      <input
        className="input-field"
        type={type}
        placeholder={placeholder}
        style={style}
      />
    </div>
  );
};

export default Input;
