import React from 'react';
import '../styles/Header.css';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <div className="logo">SADAJO</div>
      <div className="menu-icon" onClick={toggleSidebar}>
        &#9776;
      </div>
    </header>
  );
};

export default Header;
