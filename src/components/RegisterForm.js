import React from 'react';
import { message } from 'antd';
import styled from 'styled-components';

const RegisterForm = ({ onRegisterSuccess }) => {
  const onFinish = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const newUser = { username, password };
    localStorage.setItem('registeredUser', JSON.stringify(newUser));
    message.success('Đăng ký thành công!');
    onRegisterSuccess();
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={onFinish}>
        <div className="input-container">
          <input type="text" name="username" placeholder="Tên người dùng" required />
        </div>
        <div className="input-container">
          <input type="password" name="password" placeholder="Mật khẩu" required />
        </div>
        <button type="submit" className="submit">
          Đăng ký
        </button>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form {
    background-color: #fff;
    display: block;
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
    font-size: 0.875rem;
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
  }
`;

export default RegisterForm;
