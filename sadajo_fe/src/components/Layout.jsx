// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AuthModal from './AuthModal';
import userApi from '../api/userApi.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Layout.css';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState(null); // 'login' 또는 'signup'
  const [user, setUser] = useState(null); // 로그인한 사용자 정보

  const isAuthenticated = !!user;

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
    
  // 회원가입: DB에 등록만 하고 자동 로그인은 하지 않음
  const handleSignup = async (data) => {
    try {
      const result = await userApi.register({
        userName: data.name,
        userEmail: data.email,
        password: data.password,
      });
      if (result && result.message === 'User registered successfully') {
        alert("✅ 회원가입 성공! 이제 로그인을 해주세요.");
        closeAuthModal();
      } else {
        throw new Error(result.message || "회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 실패: " + error.message);
    }
  };

  // 로그인: 백엔드에서 반환한 사용자 객체를 state에 저장
// 예시: 백엔드에서 사용자 정보(user 객체)에 id 또는 _id를 포함해 응답한다고 가정
// Layout.jsx 내의 로그인 처리 함수(handleLogin) 수정 예시
const handleLogin = async (data) => {
  try {
    const result = await userApi.login({
      userEmail: data.email,
      password: data.password,
    });
    console.log("Login API result:", result);
    let userData;
    if (result && result.user) {
      // 백엔드에서 user 객체에 id 혹은 _id가 있는지 확인
      userData = { 
        ...result.user, 
        id: result.user.id || result.user._id || data.email 
      };
    } else if (result && result.message === '로그인이 성공했습니다') {
      // 임시 처리: 백엔드가 id를 보내지 않는 경우, email을 id로 사용
      userData = { ...data, id: data.email };
    } else {
      throw new Error(result.message || "로그인 실패");
    }
    console.log("로그인 사용자 데이터:", userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    alert("✅ 로그인 성공");
    closeAuthModal();
  } catch (error) {
    console.error("로그인 오류:", error);
    alert("로그인 실패: " + error.message);
  }
};




  // 로그아웃: 백엔드 호출 후 사용자 상태 제거
  const handleLogout = async () => {
    try {
      const result = await userApi.logout();
      if (result && result.message === 'User logged out successfully') {
        setUser(null);
        console.log(user);
        localStorage.removeItem('user'); // localStorage에서 삭제
        closeSidebar();
        alert("✅ 로그아웃 성공");
      } else {
        throw new Error(result.message || "로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
      alert("로그아웃 중 오류 발생: " + error.message);
    }
  };
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("localStorage 사용자 정보 파싱 실패:", error);
      }
    }
  }, []);
  
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
      />
      <main className="main-content">
        {/* Outlet에 인증 상태와 모달 열기 함수 전달 */}
        <Outlet context={{ isAuthenticated, user, openLoginModal }} />
      </main>
      <Footer />
      <AuthModal
        type={authModalType}
        isOpen={!!authModalType}
        onClose={closeAuthModal}
        onSubmit={authModalType === 'login' ? handleLogin : handleSignup}
      />
      <ToastContainer position="top-center" autoClose={3000} />

    </div>
  );
};

export default Layout;
