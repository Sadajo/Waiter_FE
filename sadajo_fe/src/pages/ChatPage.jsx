import React, { useEffect, useState } from 'react';
import chatApi from '../api/chatApi'; // 실제 채팅 API 호출을 위한 서비스
//import '../styles/ChatPage.css';

// 예시: chatApi를 통해 "내 채팅방 목록"을 불러온다고 가정
// import chatApi from '../api/chatApi';

const ChatInterface = ({ chat, onBack }) => {
  // 채팅 인터페이스 관련 상태와 API 호출 구현 가능
  return (
    <div className="chat-interface">
      <button onClick={onBack}>목록으로 돌아가기</button>
      <h2>{chat.name} 대화</h2> 
//어떻게 하지
      <div className="chat-messages">[채팅 메시지 영역]</div>
      <input type="text" placeholder="메시지를 입력하세요." />
    </div>
  );
};

const ChatPage = () => {
  const [myChats, setMyChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchMyChats = async () => {
      try {
        // 예를 들어, 사용자 ID는 인증된 사용자의 정보에서 받아온다고 가정
        const userId = '실제_유저_ID';
        const data = await chatApi.getChatsByUser(userId);
        setMyChats(data);
      } catch (err) {
        console.error('채팅방 불러오기 실패:', err.message);
      }
    };

    fetchMyChats();
  }, []);

  if (selectedChat) {
    return (
      <ChatInterface
        chat={selectedChat}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <div className="chat-page">
      <h1>내 채팅방 목록</h1>
      <ul className="chat-list">
        {myChats.map(chat => (
          <li key={chat._id} onClick={() => setSelectedChat(chat)}>
            {chat.name || `채팅방 (${chat._id})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatPage;
