import React, { useEffect, useState } from 'react';
import postApi from '../api/postApi.js';
import PostCard from '../components/PostCard.jsx';
import { useNavigate, useOutletContext } from 'react-router-dom';
import '../styles/HomePage.css';
import '../components/BoxComponent.jsx'
import BoxComponent from '../components/BoxComponent.jsx';

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

    
    //div1
    <div className="flex w-full flex-col bg-[#EEEEEE] items-center justify-center p-12">
      <h1 className="text-xl md:text-2xl font-bold bg-text-gray-900 text-center mb-6">
        어디로 갈까요? 제가 대신 사드릴게요! -TEST
      </h1> 

      <div className="w-full max-w-lg flex flex-col p-2">
        <div className="flex flex-row rounded-full border-2">
        <input
          type="text"
          placeholder="지금 줄 서는 웨이터를 검색해보세요."
          className="flex-1 p-2 text-gray-700 border-none outline-none"
        />
        <button className="px-4 py-4 bg-black text-white rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
        </button>
        </div>

        <div className="flex mt-4 items-center justify-between">
          <h3 className="text-md font-semibold text-gray-700">인기 검색어</h3>
          <div className="flex gap-4">
            <p>검색어1</p>
            <p>검색어2</p>
            <p>검색어3</p>
          </div>
        </div>
      </div>
      
      <div className="flex mt-10 item-center justify-between gap-12">
        <BoxComponent width="w-44" height="h-28">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>
          <h3>수도권</h3>
        </BoxComponent>
        <BoxComponent width="w-44" height="h-28" ></BoxComponent>
        <BoxComponent width="w-44" height="h-28"></BoxComponent>
      </div>

      <div className="flex flex-col w-full">
        <h1 className="self-start text-xl mt-10 md:text-2xl font-bold text-gray-900 text-center mb-6">
          요즘, 인기 많은 WAITER를 추천해드려요.
        </h1>
  
        <div className="flex flex-wrap item-center justify-between gap-8">
          <BoxComponent width="w-64" height="h-64" backgroundColor="bg-orange-100">
            <h3>#지금</h3>
          </BoxComponent>

          <div className="flex flex-col">
            <div className="home-page">
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
          </div>
        </div>
      </div>
  

    </div>
  );
};

export default HomePage;
