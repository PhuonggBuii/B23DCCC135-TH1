import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import TaskManager from './pages/TaskManager';
import 'antd/dist/reset.css'; 

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={
            currentUser ? <Navigate to="/home" /> : <AuthPage onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/home"
          element={
            currentUser ? (
              <TaskManager user={currentUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

        <Route path="*" element={<Navigate to={currentUser ? "/home" : "/auth"} />} />
      </Routes>
    </Router>
  );
}

export default App;
