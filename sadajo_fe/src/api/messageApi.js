import axiosInstance from './axiosInstance';

const messageApi = {
  createMessage: async (messageData) => {
    const response = await axiosInstance.post('/messages', messageData);
    return response.data;
  },
  getChatMessages: async (chatId) => {
    const response = await axiosInstance.get(`/messages/chat/${chatId}`);
    return response.data;
  },
  markMessageAsRead: async (messageId) => {
    const response = await axiosInstance.put(`/messages/${messageId}/read`);
    return response.data;
  },
};

export default messageApi;
