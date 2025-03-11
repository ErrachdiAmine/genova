import axios from 'axios';
import * as jwt_decode from 'jwt-decode'; // Change to named import for JWT decoding

const API_URL = 'http://127.0.0.1:8000'; // Your Django API URL

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

// Get the current access token
export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

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
  const decoded = jwt_decode(token);
  return decoded.exp * 1000 > Date.now();
};

// Send login credentials and get JWT tokens
export const getCurrentUser = async () => {
  const token = getAccessToken();
  if (!token) {
    console.log('No token found');
    return null; // No user is logged in
  }

  const response = await axios.get('http://127.0.0.1:8000/api/check_login_status/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data.username; // Return the username of the logged-in user
}
