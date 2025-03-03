import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import '../styles/PostCard.css';

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const { isAuthenticated, openLoginModal } = useOutletContext();

  const handleChat = () => {
    if (!isAuthenticated) {
      console.log('로그인이 필요합니다.');
      openLoginModal();
      return;
    }
    // 게시글의 채팅 버튼을 누르면 채팅방 페이지로 이동 (필요에 따라 API 호출 추가)
    navigate('/chats', { state: { postId: post._id } });
  };

  return (
    <div className="post-card">
      <p>{post.content}</p>
      <div className="post-image">
        {/* 만약 post.imageUrl이 없다면 플레이스홀더 이미지 사용 */}
        <img src={post.imageUrl || "https://via.placeholder.com/300"} alt={post.title} />
      </div>
      <div className="post-meta">
        <span>작성자: {post.userId}</span>
        <span>카테고리: {post.category || '기타'}</span>
      </div>
      <div className="post-overlay">
        <h3>{post.title}</h3>
        <button onClick={handleChat}>채팅</button>
      </div>
    </div>
  );
};

export default PostCard;
