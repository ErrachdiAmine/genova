import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { loginUser } from '../auth';


const Login = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        
        {/* Login Form */}
        <form action="#" method="POST">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
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
