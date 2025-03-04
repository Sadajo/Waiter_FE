// src/pages/PostsPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import postApi from '../api/postApi';
import PostCard from '../components/PostCard';
import '../styles/PostsPage.css';

const PostsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // 선택한 게시글(상세보기)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postApi.getAllPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error("게시글 불러오기 오류:", err);
      }
    };

    fetchPosts();
  }, []);
  // 게시글 작성 버튼 클릭 시
  const handleCreatePost = () => {
    if (!isAuthenticated) {
      toast.error("게시글 작성을 위해 로그인이 필요합니다.");
      openLoginModal();
      return;
    }
    navigate('/posts/create');
  }

  useEffect(() => {
    let tempPosts = posts;
    if (selectedCategory) {
      tempPosts = tempPosts.filter(post => (post.category || '기타') === selectedCategory);
    }
    if (searchKeyword) {
      tempPosts = tempPosts.filter(post =>
        post.title.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    setFilteredPosts(tempPosts);
  }, [searchKeyword, selectedCategory, posts]);

  // 상세보기 상태면 상세 페이지 렌더링
  if (selectedPost) {
    return (
      <div className="posts-page detail-view">
        <button className="back-btn" onClick={() => setSelectedPost(null)}>
          &larr; 전체 게시글 보기
        </button>
        <div className="post-detail">
          <h1>{selectedPost.title}</h1>
          <p><strong>게시글 ID:</strong> {selectedPost._id}</p>
          <div className="post-detail-image">
            <img src={selectedPost.imageUrl || "https://via.placeholder.com/600"} alt={selectedPost.title} />
          </div>
          <div className="post-detail-content">
            <p>{selectedPost.content}</p>
          </div>
          <div className="post-detail-info">
            <p><strong>작성자:</strong> {selectedPost.userId}</p>
            <p><strong>카테고리:</strong> {selectedPost.category || '기타'}</p>
            <p>
              <strong>태그:</strong>{" "}
              {selectedPost.tags && selectedPost.tags.length > 0
                ? selectedPost.tags.join(', ')
                : '없음'}
            </p>
            <p>
              <strong>댓글 수:</strong>{" "}
              {selectedPost.comments ? selectedPost.comments.length : 0}
            </p>
            <p>
              <strong>작성일:</strong>{" "}
              {new Date(selectedPost.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>수정일:</strong>{" "}
              {new Date(selectedPost.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 목록 보기 상태
  return (
    <div className="posts-page list-view">
      <div className="posts-header">
      <h1>전체 게시글</h1>
      <button className="create-post-btn" onClick={handleCreatePost}>
        &larr; 게시글 작성
      </button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="검색어를 입력하세요."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">전체 카테고리</option>
          <option value="카테고리1">카테고리1</option>
          <option value="카테고리2">카테고리2</option>
          <option value="기타">기타</option>
          {/* 필요한 카테고리 추가 */}
        </select>
      </div>
      <div className="posts-grid">
        {filteredPosts.map(post => (
          <PostCard key={post._id} post={post} setSelectedPost={setSelectedPost} mode="posts" />
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
