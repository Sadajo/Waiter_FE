import React, { useState } from 'react';

const CategoryComponent = () => {
  const [isDealAvailable, setIsDealAvailable] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTip, setSelectedTip] = useState('');
  const [tipRange, setTipRange] = useState({ min: 0, max: 0 });

  const rawLocations = ['장전동', '금사동', '금성동', '남산동', '노포동'];
  const rawCategories = ['과자', '도넛', '빵', '초콜릿', '쿠키'];
  const tipOptions = ['무료', '1,000원 이하', '5,000원 이하', '10,000원 이하'];

  const reorderList = (list, selected) => {
    if (!selected) return [...list].sort();
    const sortedList = [...list].sort();
    return [selected, ...sortedList.filter((item) => item !== selected)];
  };

  const handleReset = () => {
    setIsDealAvailable(false);
    setSelectedLocation('');
    setSelectedCategory('');
    setSelectedTip('');
    setTipRange({ min: 0, max: 0 });
  };

  const handleApply = () => {
    console.log('적용된 필터:', {
      isDealAvailable,
      selectedLocation,
      selectedCategory,
      selectedTip,
      tipRange,
    });
  };

  const locations = reorderList(rawLocations, selectedLocation);
  const categories = reorderList(rawCategories, selectedCategory);

  return (
    <div className="flex flex-col w-64 p-6 text-sm">
      {/* 필터 타이틀 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-[20px]">필터</h2>
        <button
          className="text-[#E67061] text-[14px] underline cursor-pointer"
          onClick={handleReset}
        >
          초기화
        </button>
      </div>

      {/* 거래 가능 */}
      <div className="mb-4">
        <label className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            checked={isDealAvailable}
            onChange={(e) => setIsDealAvailable(e.target.checked)}
            className="w-4 h-4 accent-[#E67061]"
          />
          <span className="text-[#4F4F4F] text-[16px]">거래 가능</span>
        </label>
      </div>

      <hr className="border-t border-[#A6A6A6] mb-6" />

      {/* 위치 */}
      <div className="mb-6">
        <h3 className="font-bold text-[18px] mb-2">위치</h3>
        <p className="text-[16px] text-black mb-8 mt-6">부산시 금정구</p>

        {locations.map((loc) => (
          <label
            key={loc}
            className={`flex items-center space-x-2 mb-3 cursor-pointer text-[16px] ${
              selectedLocation === loc
                ? 'text-[#E67061] font-semibold'
                : 'text-[#4F4F4F]'
            }`}
          >
            <input
              type="radio"
              name="location"
              value={loc}
              checked={selectedLocation === loc}
              onChange={() => setSelectedLocation(loc)}
              className="w-4 h-4 accent-[#E67061]"
            />
            <span>{loc}</span>
          </label>
        ))}

        <button className="text-[#E67061] text-[14px] underline cursor-pointer mt-4">
          더보기
        </button>
      </div>

      <hr className="border-t border-[#A6A6A6] mb-8" />

      {/* 카테고리 */}
      <div className="mb-6">
        <h3 className="font-bold text-[18px] mb-6">카테고리</h3>

        {categories.map((cat) => (
          <label
            key={cat}
            className={`flex items-center space-x-2 mb-3 cursor-pointer text-[16px] ${
              selectedCategory === cat
                ? 'text-[#E67061] font-semibold'
                : 'text-[#4F4F4F]'
            }`}
          >
            <input
              type="radio"
              name="category"
              value={cat}
              checked={selectedCategory === cat}
              onChange={() => setSelectedCategory(cat)}
              className="w-4 h-4 accent-[#E67061] relative top-[2px]"
            />
            <span>{cat}</span>
          </label>
        ))}

        <button className="text-[#E67061] text-[14px] underline cursor-pointer mt-4">
          더보기
        </button>
      </div>

      <hr className="border-t border-[#A6A6A6] mb-8" />

      {/* 웨이터 팁 */}
      <div className="mb-4">
        <h3 className="font-bold text-[18px] mb-6">웨이터 팁</h3>

        <div className="flex flex-col gap-4 mb-6">
          {tipOptions.map((tip) => (
            <button
              key={tip}
              className={`py-2 px-4 border rounded-full text-[14px] text-[#4F4F4F] text-left w-fit ${
                selectedTip === tip
                  ? 'bg-[#E67061] text-white border-[#E67061]'
                  : 'border-gray-300'
              }`}
              onClick={() => setSelectedTip(tip)}
            >
              {tip}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            value={tipRange.min}
            onChange={(e) =>
              setTipRange({ ...tipRange, min: Number(e.target.value) })
            }
            className="w-20 p-2 border border-gray-300 rounded text-[14px] text-[#4F4F4F]"
          />
          <span className="text-[14px] text-black">~</span>
          <input
            type="number"
            value={tipRange.max}
            onChange={(e) =>
              setTipRange({ ...tipRange, max: Number(e.target.value) })
            }
            className="w-20 p-2 border border-gray-300 rounded text-[14px] text-[#4F4F4F]"
          />
        </div>
      </div>

      {/* 적용하기 */}
      <div className="mt-2">
        <button
          className="text-[#E67061] text-[14px] underline cursor-pointer"
          onClick={handleApply}
        >
          적용하기
        </button>
      </div>
    </div>
  );
};

export default CategoryComponent;
