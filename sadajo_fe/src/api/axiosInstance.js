//반복되는 기본 URL이나 타임아웃 등의 설정 
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, //http://localhost:8080/api
  timeout: 5000,
  withCredentials: true, // 쿠키 포함
});

export default axiosInstance;
