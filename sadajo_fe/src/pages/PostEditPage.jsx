// src/pages/PostEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import postApi from '../api/postApi';
import { toast } from 'react-toastify';
import '../styles/PostCreatePage.css';

const PostEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPost } = location.state || {};

  useEffect(() => {
    if (!selectedPost) {
      toast.error("수정할 게시글 정보가 없습니다.");
      navigate('/posts');
    }
  }, [selectedPost, navigate]);

  const [title, setTitle] = useState(selectedPost ? selectedPost.title : '');
  const [content, setContent] = useState(selectedPost ? selectedPost.content : '');
  const [tags, setTags] = useState(selectedPost ? (selectedPost.tags || []).join(', ') : '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    try {
      console.log("handleSubmit: 시작 - 수정할 게시글 ID:", selectedPost._id);
      // updateData에 userId를 추가합니다.
      const updateData = { 
        userId: selectedPost.userId, 
        title, 
        content, 
        tags: tagsArray 
      };
      console.log("handleSubmit: 전송할 업데이트 데이터:", updateData);
      
      // 게시글 수정 API 호출
      await postApi.updatePost(selectedPost._id, updateData);
      console.log("handleSubmit: updatePost 호출 완료");
  
      // 백엔드가 수정된 데이터를 반영할 시간을 주기 위해 딜레이 (예: 1초)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 캐시 우회를 위해 타임스탬프 쿼리 파라미터를 추가하여 최신 데이터 요청
      const updatedPost = await postApi.getPost(`${selectedPost._id}?t=${Date.now()}`);
      console.log("handleSubmit: getPost 응답 (업데이트된 게시글):", updatedPost);
      
      if (!updatedPost) {
        throw new Error("업데이트된 게시글을 불러오지 못했습니다.");
      }
      toast.success("게시글이 성공적으로 수정되었습니다!");
      navigate('/posts', { state: { updatedPost } });
    } catch (err) {
      console.error("게시글 수정 오류:", err);
      setError(err.message || "게시글 수정에 실패했습니다.");
    }
  };
  
  
  
  
  

  return (
    <div className="post-create-page">
      <h1>게시글 수정</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="post-create-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="게시글 제목을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="게시글 내용을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">태그 (쉼표로 구분)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="예: 의약품, 식료품"
          />
        </div>
        <button type="submit" className="submit-btn">수정 완료</button>
      </form>
    </div>
  );
};

export default PostEditPage;
