// src/pages/PostCreatePage.jsx
import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import postApi from '../api/postApi';
import { toast } from 'react-toastify';

const PostCreatePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user = {}, openLoginModal } = useOutletContext();

  // 기존 필드
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 해시태그 (엔터로 추가)
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  // 새로 추가할 필드들
  const [tip, setTip] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState('');
  const [category, setCategory] = useState('');

  const [error, setError] = useState('');

  // 로그인 상태 확인
  if (!isAuthenticated) {
    toast.error("게시글 작성을 위해 로그인이 필요합니다.");
    openLoginModal();
    navigate('/posts');
    return null;
  }

  // 엔터를 눌렀을 때 태그 추가
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 폼 submit 방지
      if (!tagInput.trim()) return; // 공백 태그 방지

      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // 태그 개별 삭제
  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await postApi.createPost({
        userId: user.id,
        title,
        content,
        tags,    // 엔터로 추가된 해시태그 배열
        tip,
        place,
        date,
        people,
        category,
      });

      toast.success("게시글이 성공적으로 작성되었습니다!");
      navigate('/posts');
    } catch (err) {
      console.error("게시글 작성 오류:", err);
      setError(err.message || "게시글 작성에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-screen-md mx-auto py-8 px-4">
      {/* 상단 안내 문구 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          오늘도 <span className="text-[#E67061]">WAITER</span> 출근 완료!
        </h1>
        <p className="text-2xl font-bold mb-2">
          정확하고 친절하게 글을 작성해 주세요.
        </p>
        <hr className="my-4 border-t-2 border-black" />
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* 2열 레이아웃 */}
        <div className="grid grid-cols-2 gap-8">
          {/* --- 왼쪽 컬럼: 제목, 내용, 해시태그 --- */}
          <div>
            {/* 제목 */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 rounded-full border-2 border-black px-4 py-2 text-center text-black font-bold mr-4">
                제목
              </div>
              <div className="flex-1 bg-[#FBFBFB] rounded px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-transparent outline-none border-b border-[#AAAAAA] py-2"
                  placeholder="제목을 입력해 주세요."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 내용 */}
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 rounded-full border-2 border-black px-4 py-2 text-center text-black font-bold mr-4">
                내용
              </div>
              <div className="flex-1 bg-[#FBFBFB] rounded px-4 py-2">
                <textarea
                  className="w-full bg-transparent outline-none resize-none h-32 border-b border-[#AAAAAA] py-2"
                  placeholder="내용을 입력해 주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 해시태그 */}
            <div className="mb-6">
              <label className="block mb-2 text-[#E67061] font-semibold" htmlFor="tags">
                # HASHTAG
              </label>
              <div className="relative mb-2">
                <input
                  type="text"
                  id="tags"
                  className="w-full bg-[#FEF7F1] text-[#E67061] placeholder-[#E67061] px-3 pb-2 pt-2 outline-none"
                  placeholder="해시태그를 입력 후 엔터를 누르세요."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E67061]"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center px-3 py-1 rounded-full bg-white text-[#E67061] border border-[#E67061]"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="ml-2 text-[#4F4F4F] hover:text-[#000000]"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- 오른쪽 컬럼: TIP, 장소, 날짜, 인원, 분류 --- */}
          <div>
            {/* TIP */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 rounded-full border-2 border-black px-4 py-2 text-center text-black font-bold mr-4">
                TIP
              </div>
              <div className="flex-1 bg-[#FBFBFB] rounded px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-transparent outline-none border-b border-[#AAAAAA] py-2"
                  placeholder="팁을 설정해 주세요."
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                />
              </div>
            </div>

            {/* 장소 */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 rounded-full border-2 border-black px-4 py-2 text-center text-black font-bold mr-4">
                장소
              </div>
              <div className="flex-1 bg-[#FBFBFB] rounded px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-transparent outline-none border-b border-[#AAAAAA] py-2"
                  placeholder="희망 거래 장소를 입력해 주세요."
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>
            </div>

            {/* 날짜 */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 rounded-full border-2 border-black px-4 py-2 text-center text-black font-bold mr-4">
                날짜
              </div>
              <div className="flex-1 bg-[#FBFBFB] rounded px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-transparent outline-none border-b border-[#AAAAAA] py-2"
                  placeholder="희망 거래 날짜를 입력해 주세요."
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* 인원 */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 rounded-full border-2 border-black px-4 py-2 text-center text-black font-bold mr-4">
                인원
              </div>
              <div className="flex-1 bg-[#FBFBFB] rounded px-4 py-2">
                <input
                  type="number"
                  className="w-full bg-transparent outline-none border-b border-[#AAAAAA] py-2"
                  placeholder="희망 거래 인원을 설정해 주세요."
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                />
              </div>
            </div>

            {/* 분류 */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 rounded-full border-2 border-black px-4 py-2 text-center text-black font-bold mr-4">
                분류
              </div>
              <div className="flex-1 bg-[#FBFBFB] rounded px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-transparent outline-none border-b border-[#AAAAAA] py-2"
                  placeholder="카테고리를 설정해 주세요."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4 border-t-2 border-black" />

        {/* 작성 완료 버튼 */}
        <div className="text-right">
          <button
            type="submit"
            className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            작성 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreatePage;
