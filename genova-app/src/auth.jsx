import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Change to named import for JWT decoding

const API_URL = 'https://genova-gsaa.onrender.com'; // Your Django API URL

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/api/token/`, {
    username,
    password
  });
  if (response.data) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  return response.data;
};


// Get a new access token using the refresh token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    return null;
  }

  const response = await axios.post(`${API_URL}/api/token/refresh/`, {
    refresh: refreshToken,
  });

  if (response.data) {
    localStorage.setItem('access_token', response.data.access);
  }

  return response.data;
};

export const checkAndRefreshToken = async () => {
  const token = getAccessToken();
  if (!token) return;

  const decoded = jwtDecode(token);
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const timeLeft = expirationTime - currentTime;

  localStorage.setItem('timeLeft', timeLeft);

  // Refresh the token if it will expire in the next 5 minutes
  if (timeLeft < 5 * 60 * 1000) {
    await refreshAccessToken();
  }
};

// Check and refresh the token every 30 seconds
setInterval(checkAndRefreshToken, 30 * 1000);
// Get the current access token


export const registerUser = async (firstname, lastname, email, username, password) => {
  const response = await axios.post(`${API_URL}/api/users/`, {
    first_name: firstname,
    last_name: lastname,
    email,
    username,
    password,
  });
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

};

// Check if the token is valid (JWT decoding)
export const isTokenValid = () => {
  const token = getAccessToken();
  if (!token) return false;
  const decoded = jwtDecode(token);
  return decoded.exp * 1000 > Date.now();
};

// Send login credentials and get JWT tokens
export const getCurrentUser = async () => {
  const token = getAccessToken();
  if (!token) {
    console.log('No token found');
    return null; // No user is logged in
  }

  const response = await axios.get(`${API_URL}/api/check-login-status/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Logged In User Id: ", response.data.email);
  
  return response.data; // Return the logged-in user
}
