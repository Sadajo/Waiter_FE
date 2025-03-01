import axiosInstance from './axiosInstance';

const chatApi = {
  createChat: async (chatData) => {
    const response = await axiosInstance.post('/chats', chatData);
    return response.data;
  },
  getUserChats: async (userId) => {
    const response = await axiosInstance.get(`/chats/user/${userId}`);
    return response.data;
  },
  deleteChat: async (chatId) => {
    const response = await axiosInstance.delete(`/chats/${chatId}`);
    return response.data;
  },
};

export default chatApi;
