import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import { loginUser } from '../auth';


const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = {
    username: username,
    password: password
  }

  const navigate = useNavigate();

  
  const loginUser = async (e) => {

    e.preventDefault();

    const api_endpoint = 'http://127.0.0.1:8000/api/token/'
    try {
      
      const response = await axios.post(api_endpoint, user)
      console.log(response.data)
      const token = response.data.access;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
  
  }}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        
        {/* Login Form */}
        <form onSubmit={loginUser}>
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
              autoComplete='on'
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
              autoComplete='off'
              required 
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
            </div>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-700">Forgot Password?</a>
          </div>
          <button 
            type="submit" 
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <Link to="/Register" className="text-blue-500 hover:text-blue-700">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
