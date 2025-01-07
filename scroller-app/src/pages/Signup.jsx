import React from 'react'
import { Link, useAsyncError } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'



const Signup = () => {

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirm_password) {
      setError('Passwords do not match');
      alert('Passwords do not match');
      return;  // Stop the form submission if passwords don't match
    }

    const api_endpoint = 'http://127.0.0.1:8000/api/users/'

    setLoading(true)
    setError(null)
    setSuccess(false)

    const user = {
      email: email,
      username: username,
      password: password
      }
    
    try {
      const response = await axios.post(api_endpoint, user) 
      alert('Success!')
      setSuccess(true)
      navigate('/Login')

      } catch (error) {
        console.error(error)

      } finally {
        setLoading(false)
      }
    }
  
        
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register</h2>

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>

          <div className='mb-4'>
            <label htmlFor="email">Email Address</label>
            <input type="email" 
                id='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:
                outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
                required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input 
              type='text' 
              id="username"
              name="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your username" 
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input type="password"
            id='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:
            outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Create a strong password"
            required
            />
          </div>
          <div className="mb-4"> 
            <label htmlFor="confirm_password">Confirm Password</label>
            <input type="password"
            id='confirm_password'
            name='confirm_password'
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:
            outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
            required
            />
          </div>

          <button  
            type="submit" 
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Have an account?</p>
          <Link to="/Login" className="text-blue-500 hover:text-blue-700">Login</Link>
        </div>
      </div>
    </div>  )
}

export default Signup