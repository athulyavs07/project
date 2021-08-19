import axios from "axios";

const axiosInterceptor = axios.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      console.log("You are not authorized");
      //redirect
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
  }
);

export default axiosInterceptor;
