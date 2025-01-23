import React from 'react'

const Posts = () => {
  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <h1 className="text-4xl text-center text-gray-800 font-semibold mb-8">Posts</h1>

      {/* Posts */}
      <div className="space-y-6">
        {/* Example Post 1 */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <img 
              src="https://via.placeholder.com/50" 
              alt="User" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">User Name</h2>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-700">
              Content
            </p>
            <img 
              src="https://via.placeholder.com/600x400" 
              alt="Post Content" 
              className="mt-4 w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div className="mt-4 flex justify-between items-center text-gray-600">
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l7 7 7-7"></path>
              </svg>
              <span>Comment</span>
            </button>
          </div>
        </div>

        {/* Repeat the post structure for more posts */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <img 
              src="https://via.placeholder.com/50" 
              alt="User" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">User Name</h2>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-700">
              Content
            </p>
            <img 
              src="https://via.placeholder.com/600x400" 
              alt="Post Content" 
              className="mt-4 w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div className="mt-4 flex justify-between items-center text-gray-600">
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l7 7 7-7"></path>
              </svg>
              <span>Comment</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Posts
