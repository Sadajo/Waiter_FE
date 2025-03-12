import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import PostsPage from '../pages/PostsPage';
import PostCreatePage from '../pages/PostCreatePage';
import PostEditPage from '../pages/PostEditPage';
import ChatPage from '../pages/ChatPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="posts" element={<PostsPage/>} />
          <Route path="posts/create" element={<PostCreatePage />} />
          <Route path="posts/edit" element={<PostEditPage />} />
          <Route path="chats" element={<ChatPage />} />
          {/* 추가 페이지 : 거래 내역 등) */}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
