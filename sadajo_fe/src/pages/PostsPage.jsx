import React, { useEffect, useState } from 'react';
import postApi from '../api/postApi';
import PostCard from '../components/PostCard';
//import '../styles/PostsPage.css';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postApi.getAllPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

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

  return (
    <div className="posts-page">
      <h1>전체 게시글</h1>
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
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
