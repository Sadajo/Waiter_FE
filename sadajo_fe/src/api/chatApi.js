import axiosInstance from './axiosInstance';

const chatApi = {
  createChat: async (chatData) => {
    const response = await axiosInstance.post('/chats', chatData);
    return response.data.data;
  },
  getUserChats: async (userId) => {
    const response = await axiosInstance.get(`/chats/user/${userId}`);
    return response.data.data;
  },
  deleteChat: async (chatId) => {
    const response = await axiosInstance.delete(`/chats/${chatId}`);
    return response.data.data;
  },
};

export default chatApi;
