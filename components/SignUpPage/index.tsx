import '../../styles/signUp.css';
// import InputGroup from "../Elements/InputGroup";
import Button from '../Elements/Button';
import Header from '../Header/Header';
import Input from '../Elements/Input';

const SignUp = () => {
  return (
    <form action="">
      <div className="signup">
        <div className="header">
          <Header />
        </div>
        <div className="signup-content">
          <Input label="Name" placeholder="enter your full name" />
          <Input label="Email" placeholder="enter your email id" />
          <Input label="Mobile" placeholder="+382 enter your mobile number" />
          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
          />
          <Button text="Sign Up" type="submit" />
          <p className="account-info">
            Already have an account? <span className="login-btn">Login</span>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
