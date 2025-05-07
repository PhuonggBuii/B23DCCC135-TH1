import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginForm = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    setLoading(true);

    const savedUser = JSON.parse(localStorage.getItem('registeredUser'));

    setTimeout(() => {
      if (savedUser && savedUser.username === username && savedUser.password === password) {
        const user = { username };
        onLoginSuccess(user);
        message.success('Đăng nhập thành công!');
        navigate('/home');
      } else {
        message.error('Tên người dùng hoặc mật khẩu không đúng!');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input type="text" name="username" placeholder="Tên người dùng" required />
        </div>
        <div className="input-container">
          <input type="password" name="password" placeholder="Mật khẩu" required />
        </div>
        <button type="submit" className="submit" disabled={loading}>
          Đăng nhập
        </button>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form {
    background-color: #fff;
    padding: 1rem;
    max-width: 350px;
    width: 100%;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .input-container {
    margin-bottom: 1rem;
  }

  .input-container input {
    width: 100%;
    padding: 1rem;
    border: 1px solid #ff4d4f;
    border-radius: 0.5rem;
  }

  .submit {
    padding: 0.75rem 1.25rem;
    background-color: #ff4d4f;
    color: #ffffff;
    width: 100%;
    border-radius: 0.5rem;
    cursor: pointer;
    border: none;
    opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  }
`;

export default LoginForm;