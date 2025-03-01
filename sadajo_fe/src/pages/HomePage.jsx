// // HomePage.jsx
// import React, { useState } from 'react';
// import './Header.css';

// const Header = ({ toggleSidebar }) => {
//   return (
//     <header className="header">
//       <div className="logo">SADAJO</div>
//       <div className="menu-icon" onClick={toggleSidebar}>
//         &#9776;
//       </div>
//     </header>
//   );
// };

// const Sidebar = ({
//   isOpen,
//   onClose,
//   isAuthenticated,
//   openLoginModal,
//   openSignupModal,
//   handleLogout,
//   handleWithdraw,
// }) => {
//   return (
//     <div className={`sidebar ${isOpen ? 'open' : ''}`}>
//       <button onClick={onClose} className="close-button">
//         &times;
//       </button>
//       <ul>
//         {isAuthenticated ? (
//           <>
//             <li onClick={handleLogout}>로그아웃</li>
//             <li onClick={handleWithdraw}>회원탈퇴</li>
//           </>
//         ) : (
//           <>
//             <li onClick={openSignupModal}>회원가입</li>
//             <li onClick={openLoginModal}>로그인</li>
//           </>
//         )}
//       </ul>
//     </div>
//   );
// };

// const AuthModal = ({ type, isOpen, onClose, onSubmit }) => {
//   const [formData, setFormData] = useState({ email: '', password: '', name: '' });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   if (!isOpen) return null;
//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <button onClick={onClose} className="modal-close">
//           &times;
//         </button>
//         <h2>{type === 'login' ? '로그인' : '회원가입'}</h2>
//         <form onSubmit={handleSubmit}>
//           {type === 'signup' && (
//             <div>
//               <label>이름:</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           )}
//           <div>
//             <label>이메일:</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <label>비밀번호:</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button type="submit">{type === 'login' ? '로그인' : '회원가입'}</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// const HomePage = () => {
//   // 사이드바 및 모달 상태, 그리고 인증 상태 관리
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [authModalType, setAuthModalType] = useState(null); // 'login' 또는 'signup'
//   const [isAuthenticated, setAuthenticated] = useState(false);

//   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
//   const closeSidebar = () => setSidebarOpen(false);

//   const openLoginModal = () => {
//     setAuthModalType('login');
//     closeSidebar();
//   };

//   const openSignupModal = () => {
//     setAuthModalType('signup');
//     closeSidebar();
//   };

//   const closeAuthModal = () => setAuthModalType(null);

//   const handleLogin = (data) => {
//     // 여기서 userApi.login(data) 같은 API 호출을 진행할 수 있습니다.
//     console.log('로그인 데이터:', data);
//     setAuthenticated(true);
//     closeAuthModal();
//   };

//   const handleSignup = (data) => {
//     // 여기서 userApi.register(data) 같은 API 호출을 진행할 수 있습니다.
//     console.log('회원가입 데이터:', data);
//     setAuthenticated(true);
//     closeAuthModal();
//   };

//   const handleLogout = () => {
//     // 로그아웃 API 호출 후 상태 업데이트
//     console.log('로그아웃 요청');
//     setAuthenticated(false);
//   };

//   const handleWithdraw = () => {
//     // 회원탈퇴 API 호출 후 상태 업데이트
//     console.log('회원탈퇴 요청');
//     setAuthenticated(false);
//   };

//   return (
//     <div>
//       <Header toggleSidebar={toggleSidebar} />
//       <Sidebar
//         isOpen={isSidebarOpen}
//         onClose={closeSidebar}
//         isAuthenticated={isAuthenticated}
//         openLoginModal={openLoginModal}
//         openSignupModal={openSignupModal}
//         handleLogout={handleLogout}
//         handleWithdraw={handleWithdraw}
//       />
//       <div className="content">
//         <h1>홈 페이지</h1>
//         <p>메인 콘텐츠 영역</p>
//       </div>
//       <AuthModal
//         type={authModalType}
//         isOpen={!!authModalType}
//         onClose={closeAuthModal}
//         onSubmit={authModalType === 'login' ? handleLogin : handleSignup}
//       />
//     </div>
//   );
// };

// export default HomePage;
import React, { useEffect, useState } from 'react';
import postApi from '../api/postApi';
import PostCard from '../components/PostCard';
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
              <PostCard key={post._id} post={post} />
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
