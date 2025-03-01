import axiosInstance from './axiosInstance';

const orderApi = {
  getAllOrders: async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  },
  createOrder: async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  },
  deleteOrder: async (orderId) => {
    const response = await axiosInstance.delete(`/orders/${orderId}`);
    return response.data;
  },
  updateOrderStatus: async (orderId, statusData) => {
    const response = await axiosInstance.patch(`/orders/${orderId}/status`, statusData);
    return response.data;
  },
  updateOrder: async (orderId, updateData) => {
    const response = await axiosInstance.put(`/orders/${orderId}`, updateData);
    return response.data;
  },
};

export default orderApi;
