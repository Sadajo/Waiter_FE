// src/components/AuthModal.jsx
import React, { useState } from 'react';
import '../styles/AuthModal.css';

const AuthModal = ({ type, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(formData);
      setFormData({ email: '', password: '', name: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{type === 'login' ? '로그인' : '회원가입'}</h2>
        <form onSubmit={handleSubmit}>
          {type === 'signup' && (
            <div>
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div>
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">{type === 'login' ? '로그인' : '회원가입'}</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
