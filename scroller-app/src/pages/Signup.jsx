import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const Signup = () => {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Registration successful!');
        navigate('/Login'); // Redirect to Login
      } else {
        alert('Error occurred during registration.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    }
  };


  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register</h2>


        {/* Signup Form */}
        <form onSubmit={handleSubmit} method='POST'>
          <div className="mb-4">
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input 
              type='text' 
              id="firstname"
              name="firstname" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your first name"
              required 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input 
              type="text" 
              id="lastname" 
              name="lastname" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your last name" 
              required 
            />
          </div>
          <div className='mb-4'>
            <label htmlFor="email">Email Address</label>
            <input type="email" 
                id='email'
                name='email'
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:
                outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
                required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input type="password"
            id='password'
            name='password'
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:
            outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Create a strong password"
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