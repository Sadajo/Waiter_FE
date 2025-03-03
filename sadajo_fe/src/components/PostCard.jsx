// src/components/PostCard.jsx
import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/PostCard.css';
import PropTypes from 'prop-types';

const PostCard = ({ post, setSelectedPost, mode }) => {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useOutletContext();

  // 게시글 상세 페이지로 이동 또는 상세보기 상태 전환
  const goToDetail = () => {
    if (!isAuthenticated) {
      console.log('로그인이 필요합니다.');
      toast.error("로그인이 필요합니다. 먼저 로그인해 주세요.");
      openLoginModal();
      return;
    }
    if (mode === 'home') {
      // 홈페이지에서 클릭 시 posts 페이지로 이동
      navigate('/posts');
    } else if (mode === 'posts') {
      // 게시글 페이지에서 클릭 시 상세 보기 화면을 위해 선택한 게시글 상태 업데이트
      setSelectedPost(post);
    }
  };

  // 바로 채팅하기 버튼 처리
  const handleChat = () => {
    if (!isAuthenticated) {
      console.log('로그인이 필요합니다.');
      toast.error("로그인이 필요합니다. 먼저 로그인해 주세요.");
      openLoginModal();
      return;
    }
    navigate('/chats', { state: { postId: post._id } });
  };

  return (
    <div className="post-card">
      <div className="post-meta">
        <span>작성자: {post.userId}</span>
        <span>카테고리: {post.category || '기타'}</span>
      </div>
      <div className="post-overlay">
        <h3>{post.title}</h3>
      </div>
      <div className="post-actions">
        <button className="detail-btn" onClick={goToDetail}>
          게시글 자세히 보기
        </button>
        <button className="chat-btn" onClick={handleChat}>
          바로 채팅하기
        </button>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  setSelectedPost: PropTypes.func, // 'posts' 모드에서는 필요
  mode: PropTypes.oneOf(['home', 'posts']).isRequired,
};

export default PostCard;
