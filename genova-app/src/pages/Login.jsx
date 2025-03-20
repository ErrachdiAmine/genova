import { Link, useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, getCurrentUser, isTokenValid } from '../auth'; // Import all necessary functions
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoginSignupLoading';

const Login = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginUser(username, password); // Use the loginUser function
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const logout = () => {
    logoutUser(); // Use the logoutUser function
    setCurrentUser(null);
  }

  const validToken = isTokenValid(); // Use the isTokenValid function

  console.log(validToken);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading && <LoadingScreen />}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {currentUser ? (
          <>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">{currentUser}</h2>
            <button
              onClick={logout}
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>

            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
            <form onSubmit={login}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
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
          </>

        )} 

        {error && (
          <div className="text-red-500 mt-4 text-center">
            <p>{error}</p>
          </div>
        )}

        {!currentUser && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <Link to="/Register" className="text-blue-500 hover:text-blue-700">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
