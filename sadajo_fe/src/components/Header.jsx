import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal'; 

const Header = () => {
  const [modalType, setModalType] = useState(null); 
  const [isModalOpen, setModalOpen] = useState(false); // 모달 열림 상태

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };


  const handleAuthSubmit = async (formData) => {
    console.log(`${modalType} 요청:`, formData);
    closeModal();
  };

  return (
    <header className="flex items-center justify-between bg-inherit-600 p-4">
      <div className="text-2xl font-bold ml-4">
        <Link to="/">WAITER</Link>
      </div>

      <nav className="hidden md:flex gap-6 text-lg">
        <Link to="/" className="text-gray-600 font-bold">HOME</Link>
        <Link to="/posts" className="text-gray-600 font-bold hover:text-black">BOARD</Link>
        <Link to="/chats" className="text-gray-600 font-bold hover:text-black">CHAT</Link>
        <Link to="/mypage" className="text-gray-600 font-bold hover:text-black">MY PAGE</Link>
      </nav>

      <div className="hidden md:flex gap-4">
        <button
          className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200"
          onClick={() => openModal('login')}
        >
          로그인
        </button>
        <button
          className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200"
          onClick={() => openModal('signup')}
        >
          회원가입
        </button>
        <button className="bg-black text-white px-4 py-2 rounded-lg">앱 다운로드</button>
      </div>

      <AuthModal
        type={modalType}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAuthSubmit}
      />
    </header>
  );
};

export default Header;
