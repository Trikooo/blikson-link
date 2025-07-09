import axios from "axios";
import axiosRetry from "axios-retry";

// Create axios instance
const client = axios.create({
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Configure retries
axiosRetry(client, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Progressive delay
  },
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) // Default retry conditions
      || error.response?.status === 429 // Rate limit
      || Boolean(error.response?.status && error.response.status >= 500); // Server errors
  },
});

// // Request interceptor
// client.interceptors.request.use(
//   (config) => {
//     // Add auth headers, etc.
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // Response interceptor
// client.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Log retry attempts
//     if (error.config?.__retryCount) {
//       console.log(`Retry attempt ${error.config.__retryCount} for ${error.config.url}`);
//     }

//     // Handle specific error cases
//     if (error.response?.status === 429) {
//       console.log("Rate limited, waiting before retry...");
//     }

//     return Promise.reject(error);
//   },
// );

export default client;
