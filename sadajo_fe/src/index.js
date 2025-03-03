// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// //import './index.css';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

//위에 코드 버전 문제로 오류

// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
//import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

