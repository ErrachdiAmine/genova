import { Link, useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, isTokenValid } from '../auth'; // Import all necessary functions
import { getCurrentUser } from '../auth';
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreens/LoginSignupLoading';

const Login = () => {
  const [User, setUser] = useState('');
  const [username, setUsername] = useState('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const isDarkMode = localStorage.getItem('theme') === 'dark';
  {isDarkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark') }

  const login = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginUser(username, password); // Use the loginUser function
      navigate('/Posts');
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true);
      try {
        const user = await getCurrentUser();
        if (user) {
          setUser(user.username);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const logout = () => {
    logoutUser(); // Use the logoutUser function
    setUser(null);
    setIsLoadingUser(false); // Reset loading state on logout
  };

  const validToken = isTokenValid(); // Use the isTokenValid function

  console.log(validToken);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 pt-16 p-6">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-md">
        {isLoadingUser ? (
          <div><LoadingScreen /></div>
        ) : User ? (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">{User}</h2>
            <button
              onClick={logout}
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 dark:hover:bg-red-500 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">Login</h2>
            <form onSubmit={login}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-300"
              >
                Login
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Don't have an account?</p>
                <Link to="/register" className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  Sign up
                </Link>
              </div>
              
            </form>
          </>
        )}

        {loading && <LoadingScreen />}

        {error && (
          <div className="text-red-500 mt-4 text-center">
            <p>{error}</p>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default Login;
