import axiosInstance from './axiosInstance';

const postApi = {
  getPost: async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  },
  getAllPosts: async () => {
    const response = await axiosInstance.get('/posts');
    if(response.data.status !== 'success') {
      throw new Error(response.data.message);
    }
    return response.data; // 이거 다시좀 봐야할듯?
  },
  createPost: async (postData) => {
    const response = await axiosInstance.post('/posts', postData);
    return response.data;
  },
  updatePost: async (postId, postData) => {
    const response = await axiosInstance.put(`/posts/${postId}`, postData);
    return response.data;
  },
  deletePost: async (postId) => {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
  },
};

export default postApi;
