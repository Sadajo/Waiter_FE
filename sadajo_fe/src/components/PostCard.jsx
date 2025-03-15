// src/components/PostCard.jsx
import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import BoxComponent from './BoxComponent';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useOutletContext();

  // 게시글 상세 페이지로 이동
  const goToDetail = () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다. 먼저 로그인해 주세요.");
      openLoginModal();
      return;
    }
    // 선택한 게시글을 state로 전달하면서 /posts로 이동
    navigate('/posts', { state: { selectedPost: post } });
  };

  return (
    <div className="post-card">
      <BoxComponent></BoxComponent>
      <BoxComponent backgroundColor="bg-white">
        <p>{post.title}</p>
        <p>거래 희망 지역</p>
        <p>웨이터 팁</p>
      </BoxComponent>

      <div className="post-actions">
        <button className="detail-btn" onClick={goToDetail}>
          게시글 자세히 보기
        </button>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostCard;
