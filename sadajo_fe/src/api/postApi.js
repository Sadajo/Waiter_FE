import axiosInstance from './axiosInstance';

const postApi = {
  getPost: async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data.data;
  },
  getAllPosts: async () => {
    const response = await axiosInstance.get('/posts');
    // if(response.data.status !== 'success') {
    //   throw new Error(response.data.message);
    // }
    return response.data.data; // 이거 다시좀 봐야할듯?
  },
  createPost: async (postData) => {
    const response = await axiosInstance.post('/posts', postData);
    return response.data.data;
  },
  updatePost: async (postId, postData) => {
    const response = await axiosInstance.put(`/posts/${postId}`, postData);
    return response.data.data;
  },
  // userId를 URL 파라미터로 추가하여 호출
  deletePost: async (postId, userId) => {
    const response = await axiosInstance.delete(`/posts/${postId}/${userId}`);
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || '게시글 삭제에 실패했습니다.');
    }
    return response.data.data;
  },
};

export default postApi;
