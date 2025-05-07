import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { Card, Typography } from 'antd';

const { Title } = Typography;

function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const handleRegisterSuccess = () => setIsLogin(true);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5',
      }}
    >
      <Card
        style={{
          width: 400,
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '2px solid #ff4d4f',
        }}
      >
        <Title level={3} style={{ textAlign: 'center', color: '#333' }}>
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </Title>

        {isLogin ? (
          <LoginForm onLoginSuccess={onLoginSuccess} />
        ) : (
          <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#1890ff',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </Card>
    </div>
  );
}

export default AuthPage;
