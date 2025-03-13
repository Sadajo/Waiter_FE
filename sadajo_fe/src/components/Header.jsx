import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
        <Link to="/login" className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200">로그인</Link>
        <Link to="/signup" className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200">회원가입</Link>
        <button className="bg-black text-white px-4 py-2 rounded-lg">앱 다운로드</button>
      </div>
    
    </header>
  );
};

export default Header;