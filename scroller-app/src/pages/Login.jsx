import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedExpiresIn = localStorage.getItem('expiresIn');

    if (storedToken && storedRefreshToken && storedExpiresIn) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setExpiresIn(parseInt(storedExpiresIn, 10));
    }
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    const api_endpoint = 'http://127.0.0.1:8000/api/token/';

    try {
      const response = await axios.post(api_endpoint, { username, password });
      setLoading(false);
      const { access, refresh, expires_in } = response.data;

      setToken(access);
      setRefreshToken(refresh);
      setExpiresIn(expires_in);

      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('expiresIn', expires_in);

      navigate('/');
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setExpiresIn(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    navigate('/Login');
  };

  const refreshTokenHandler = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
      const { access, expires_in } = response.data;
      setToken(access);
      setExpiresIn(expires_in);
      localStorage.setItem('token', access);
      localStorage.setItem('expiresIn', expires_in);
    } catch (error) {
      console.error(error);
      logout();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        {/* Check if the user is logged in */}
        {token ? (
          <button
            onClick={logout}
            className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        ) : (
          <form onSubmit={login}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </form>
        )}

        {error && (
          <div className="text-red-500 mt-4 text-center">
            <p>{error}</p>
          </div>
        )}

        {!token && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <Link to="/Register" className="text-blue-500 hover:text-blue-700">Sign up</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
