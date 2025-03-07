import React, { useEffect, useState } from 'react';
import postApi from '../api/postApi.js';
import PostCard from '../components/PostCard.jsx';
import { useNavigate, useOutletContext } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [groupedPosts, setGroupedPosts] = useState({});
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useOutletContext();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postApi.getAllPosts();
        setPosts(data);
        groupPostsByCategory(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  const groupPostsByCategory = (postsData) => {
    // 가정: 각 포스트에 category 필드가 존재하거나, 없으면 '기타'
    const groups = {};
    postsData.forEach(post => {
      const category = post.category || '기타';
      if (!groups[category]) groups[category] = [];
      groups[category].push(post);
    });
    setGroupedPosts(groups);
  };

  const handleSeeMore = (category) => {
    navigate('/posts', { state: { category } });
  };

  return (
    <div className="home-page">
      <h1>게시글 미리보기</h1>
      {Object.keys(groupedPosts).map(category => (
        <div key={category} className="category-group">
          <h2>{category}</h2>
          <div className="posts-grid">
            {groupedPosts[category].slice(0, 9).map(post => (
              <PostCard key={post._id} post={post} mode="home" />
            ))}
          </div>
          {groupedPosts[category].length > 9 && (
            <button className="see-more-btn" onClick={() => handleSeeMore(category)}>
              더보기
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default HomePage;
