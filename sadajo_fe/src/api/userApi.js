import axiosInstance from './axiosInstance';

const userApi = {
  register: async (userData) => {
    const response = await axiosInstance.post('/users/register', userData);
    return response.data.data;
  },
  login: async (credentials) => {
    const response = await axiosInstance.post('/users/login', credentials);
    return response.data.data;
  },
  logout: async () => {
    const response = await axiosInstance.post('/users/logout');
    return response.data.data;
  },
  deleteAccount: async (userId) => {
    const response = await axiosInstance.delete(`/users/delete/${userId}`);
    return response.data.data;
  },
};

export default userApi;
