// src/components/PostCard.jsx
import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/PostCard.css';
import PropTypes from 'prop-types';

const PostCard = ({ post, setSelectedPost, mode }) => {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal, user } = useOutletContext();

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
  // 현재 로그인한 사용자 ID (예: localStorage에 저장된 값)
  const currentUserId = localStorage.getItem('userId');
  console.log('요청자 (현재 사용자):', user.id, '게시글 작성자:', post.userId);

  // 본인과의 채팅 요청이라면 요청하지 않도록 처리
  if (user.id === post.userId) {
    toast.error("본인과의 채팅은 불가능합니다.");
    return;
  }
    // post.userId가 게시글 작성자의 ID, 그리고 현재 사용자는 user.id
    navigate('/chats', { state: { postId: post._id, postAuthorId: post.userId } });
  };

  return (
    <div className="post-card">
      <div className="post-meta">
        <span>작성자: {post.userName}</span>
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
