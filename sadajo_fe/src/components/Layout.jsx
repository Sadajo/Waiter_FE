import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AuthModal from './AuthModal';
import '../styles/Layout.css';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState(null); // 'login' 또는 'signup'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const openLoginModal = () => {
    setAuthModalType('login');
    closeSidebar();
  };

  const openSignupModal = () => {
    setAuthModalType('signup');
    closeSidebar();
  };

  const closeAuthModal = () => setAuthModalType(null);

  // 임시 로그인/회원가입/로그아웃 함수 (실제 API 연동 시 userApi 등을 호출)
  const handleLogin = (data) => {
    console.log('로그인 데이터:', data);
    setIsAuthenticated(true);
    closeAuthModal();
  };

  const handleSignup = (data) => {
    console.log('회원가입 데이터:', data);
    setIsAuthenticated(true);
    closeAuthModal();
  };

  const handleLogout = () => {
    console.log('로그아웃');
    setIsAuthenticated(false);
    closeSidebar();
  };

  // const handleWithdraw = () => {
  //   console.log('회원탈퇴');
  //   setIsAuthenticated(false);
  //   closeSidebar();
  // };

  return (
    <div className="layout-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        isAuthenticated={isAuthenticated}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
        handleLogout={handleLogout}
        //handleWithdraw={handleWithdraw}
      />
      <main className="main-content">
        <Outlet context={{ isAuthenticated, openLoginModal}} />
      </main>
      <Footer />
      <AuthModal
        type={authModalType}
        isOpen={!!authModalType}
        onClose={closeAuthModal}
        onSubmit={authModalType === 'login' ? handleLogin : handleSignup}
      />
    </div>
  );
};

export default Layout;
