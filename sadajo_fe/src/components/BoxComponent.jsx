// BoxComponent.js
import React from 'react';

//box를 customizing 가능하도록 props 전달
const BoxComponent = ({ children, backgroundColor = 'bg-gray-200', borderColor = '', shadow = '', rounded = 'rounded-2xl', width = '', height = ''}) => {
  return (
    <div className={`${backgroundColor} ${borderColor} ${shadow} ${rounded} ${width} ${height} p-6 flex flex-col justify-center items-center`}>
      {children}
    </div>
  );
};

export default BoxComponent;
