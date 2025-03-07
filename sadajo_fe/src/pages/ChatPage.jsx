// src/pages/ChatPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import io from 'socket.io-client';
import chatApi from '../api/chatApi';
import messageApi from '../api/messageApi';
import '../styles/ChatPage.css';

const ChatInterface = ({ chat, onBack, onNewMessage, currentUserId, socket }) => {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  // 채팅방 입장: 한 번만 join 이벤트를 보내도록 함.
  useEffect(() => {
    if (!joined && socket && chat._id && currentUserId) {
      console.log("Joining room:", chat._id, "for user:", currentUserId);
      socket.emit('joinRoom', { chatId: chat._id, userId: currentUserId });
      setJoined(true);
    }
  }, [joined, socket, chat._id, currentUserId]);

  // 이전 메시지 불러오기 (히스토리)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await messageApi.getChatMessages(chat._id);
        console.log("Fetched message history:", history);
        setMessages(history);
      } catch (err) {
        console.error("메시지 히스토리 불러오기 실패:", err);
      }
    };
    fetchHistory();
  }, [chat._id]);

  // 새 메시지와 실시간 메시지 수신 처리
  useEffect(() => {
    console.log("ChatInterface mounted for chat:", chat);
    socket.on('message', (msgData) => {
      console.log("Received message event:", msgData);
      if (msgData.chatId === chat._id) {
        setMessages(prev => [...prev, msgData]);
        if (onNewMessage) {
          onNewMessage(chat, msgData);
        }
      }
    });
    socket.on('error', (err) => {
      console.error("Socket error:", err);
    });
    return () => {
      socket.off('message');
      socket.off('error');
    };
  }, [socket, chat, onNewMessage]);

  // 메시지 읽음 처리: messages 상태가 업데이트되면, 현재 사용자에게서 온 것이 아니라면 읽음 처리 호출
  useEffect(() => {
    const markMessagesAsRead = async () => {
      const unreadMessages = messages.filter(msg => !msg.read && msg.senderId !== currentUserId);
      for (let msg of unreadMessages) {
        try {
          console.log("Marking message as read, id:", msg._id);
          await messageApi.markMessageAsRead(msg._id);
          // 업데이트: 로컬 메시지 상태에서도 해당 메시지를 read:true로 갱신
          setMessages(prev =>
            prev.map(m => m._id === msg._id ? { ...m, read: true } : m)
          );
        } catch (err) {
          console.error("메시지 읽음 처리 실패:", err);
        }
      }
    };
    if (messages.length > 0) {
      markMessagesAsRead();
    }
  }, [messages, currentUserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) {
      console.log("빈 메시지는 전송하지 않음.");
      return;
    }
    console.log("Socket connected:", socket.connected);
    console.log("Socket id:", socket.id);
    console.log("Sending message:", messageInput.trim(), "for chatId:", chat._id, "senderId:", currentUserId);
    socket.emit('sendMessage', {
      chatId: chat._id,
      senderId: currentUserId,
      content: messageInput.trim(),
    });
    console.log("handleSendMessage 호출됨. messageInput:", messageInput.trim());
    setMessageInput('');
  };

  return (
    <div className="chat-interface">
      <button onClick={onBack} className="back-btn">채팅창 닫기</button>
      <h2>{chat.name || `채팅방 (${chat._id})`} 대화</h2>
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p>[채팅 메시지가 없습니다.]</p>
        ) : (
          messages.map((msg, index) => (
            <div key={msg._id || index} className="chat-message">
              <span className="sender">{msg.senderId}:</span>
              <span className="content">{msg.message || msg.content}</span>
              {!msg.read && <small style={{color: 'red'}}> (읽지 않음)</small>}
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          placeholder="메시지를 입력하세요."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

const ChatPage = () => {
  const location = useLocation();
  const { isAuthenticated, openLoginModal, user } = useOutletContext();
  const [myChats, setMyChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // localStorage에서 저장된 user 파싱하여 currentUserId 추출
  const savedUser = localStorage.getItem('user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;
  const currentUserId = currentUser ? currentUser.id : null;
  
  console.log("Current user from localStorage:", currentUser);
  console.log("Current userId:", currentUserId);
  console.log("Location state:", location.state);

  // Socket 연결: REACT_APP_SOCKET_URL 환경변수를 사용, 기본값은 http://localhost:8080
  useEffect(() => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080';
    const newSocket = io(socketUrl, { withCredentials: true });
    newSocket.on('connect', () => {
      console.log("Socket 연결됨:", newSocket.id);
    });
    newSocket.on('connect_error', (err) => {
      console.error("Socket 연결 에러:", err);
    });
    setSocket(newSocket);
    return () => {
      console.log("Socket 연결 해제");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!currentUserId) {
          console.error("현재 로그인한 사용자 정보가 없습니다.");
          return;
        }
        console.log("Fetching chats for user:", currentUserId);
        if (location.state && location.state.postId && location.state.postAuthorId) {
          const chats = await chatApi.getUserChats(currentUserId);
          console.log("불러온 채팅방 목록:", chats);
          let chatRoom = chats.find(chat =>
            chat.requesterId.toString() === location.state.postAuthorId.toString() ||
            chat.accepterId.toString() === location.state.postAuthorId.toString()
          );
          console.log("찾은 채팅방:", chatRoom);
          if (!chatRoom) {
            console.log("채팅방이 없으므로 새로 생성합니다.");
            const newChat = await chatApi.createChat({
              requesterId: currentUserId.toString(),
              accepterId: location.state.postAuthorId.toString(),
            });
            console.log("생성된 채팅방:", newChat);
            chatRoom = newChat;
          }
          chatRoom.currentUserId = currentUserId;
          setSelectedChat(chatRoom);
        } else {
          const chats = await chatApi.getUserChats(currentUserId);
          console.log("일반 채팅 목록 불러옴:", chats);
          setMyChats(chats);
          if (!selectedChat && chats.length > 0) {
            setSelectedChat(chats[0]);
          }
        }
      } catch (err) {
        console.error('채팅방 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId && socket) {
      fetchChats();
    }
  }, [location, currentUserId, socket]);

  // 채팅방 목록에서 선택 시, 해당 채팅방을 선택
  const handleSelectChat = (chat) => {
    console.log("handleSelectChat 호출됨");
    if (socket) {
      console.log("채팅방 join 요청:", chat._id, "for user:", currentUserId);
      socket.emit('joinRoom', { chatId: chat._id, userId: currentUserId });
    }
    chat.currentUserId = currentUserId;
    setSelectedChat(chat);
  };

  // 새로운 메시지가 도착하면, 채팅방 목록 업데이트 및 자동 선택 (선택된 채팅방이 없으면)
  const handleNewMessage = (chat, newMessage) => {
    console.log("새 메시지 도착:", newMessage, "for chat:", chat._id);
    setMyChats(prevChats =>
      prevChats.map(c => {
        if (c._id === chat._id) {
          return { ...c, updatedAt: newMessage.createdAt, lastMessage: newMessage.message || newMessage.content };
        }
        return c;
      })
    );
    if (!selectedChat) {
      console.log("자동으로 채팅방 선택:", chat._id);
      setSelectedChat(chat);
    } else if (selectedChat && selectedChat._id === chat._id) {
      setSelectedChat({ ...selectedChat, updatedAt: newMessage.createdAt, lastMessage: newMessage.message || newMessage.content });
    }
  };

  if (loading) return <div className="chat-page">Loading...</div>;

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-list-section">
          <h2>내 채팅방 목록</h2>
          <ul className="chat-list">
            {myChats.map(chat => (
              <li
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={selectedChat && chat._id === selectedChat._id ? "active" : ""}
              >
                {chat.name || `채팅방 (${chat._id})`}
                {chat.lastMessage && <br />}
                {chat.lastMessage && <small>마지막 메시지: {chat.lastMessage}</small>}
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-interface-section">
          {selectedChat ? (
            <ChatInterface
              chat={selectedChat}
              onBack={() => setSelectedChat(null)}
              onNewMessage={handleNewMessage}
              currentUserId={currentUserId}
              socket={socket}
            />
          ) : (
            <div className="no-chat-selected">
              <p>채팅방을 선택하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
