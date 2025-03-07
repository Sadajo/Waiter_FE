// src/pages/PostCreatePage.jsx
import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import postApi from '../api/postApi';
import '../styles/PostCreatePage.css';
import { toast } from 'react-toastify';

const PostCreatePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user = {}, openLoginModal } = useOutletContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

    // 로그인 상태 확인: 로그인되지 않았다면 에러 토스트를 띄우고 로그인 모달을 연 후 페이지 전환
    if (!isAuthenticated) {
        toast.error("게시글 작성을 위해 로그인이 필요합니다.");
        openLoginModal();
        navigate('/posts');
        return null;
      }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // 태그를 쉼표로 구분된 문자열에서 배열로 변환
    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      const postData = {
        userId: user.id, 
        title,
        content,
        tags: tagsArray,
      };
      console.log(user.id);
      // 실제 백엔드로 게시글 생성 요청
      const result = await postApi.createPost(postData);
      toast.success("게시글이 성공적으로 작성되었습니다!");
      navigate('/posts'); // 게시글 전체보기 페이지로 이동
    } catch (err) {
      console.error("게시글 작성 오류:", err);
      setError(err.message || "게시글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="post-create-page">
      <h1>게시글 작성</h1>
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
            placeholder="예: 의약품, 식료품품"
          />
        </div>
        <button type="submit" className="submit-btn">작성 완료</button>
      </form>
    </div>
  );
};

export default PostCreatePage;
