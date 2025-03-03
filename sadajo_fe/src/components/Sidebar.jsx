import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({
  isOpen,
  onClose,
  isAuthenticated,
  openLoginModal,
  openSignupModal,
  handleLogout, //여기 원래 handlewithdraw 탈퇴 잇는 코드드
}) => {
  const navigate = useNavigate();

  const goToChatPage = () => {
    onClose();
    navigate('/chats');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>&times;</button>
      <ul>
        {isAuthenticated ? (
          <>
            <li onClick={goToChatPage}>내 채팅방</li>
            <li onClick={handleLogout}>로그아웃</li>
          </>
        ) : (
          <>
            <li onClick={openSignupModal}>회원가입</li>
            <li onClick={openLoginModal}>로그인</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
