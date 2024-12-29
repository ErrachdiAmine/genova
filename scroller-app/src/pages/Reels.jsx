import React from 'react'

const Reels = () => {
  return (
    <div className='min-h-screen bg-gray-900 p-4'>
      <h1 className="text-4xl text-center text-white font-semibold mb-8">Reels</h1>

      {/* Reels grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example of a reel item */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <img 
            src="https://via.placeholder.com/300x400" 
            alt="Reel" 
            className="w-full h-72 object-cover" 
          />
          <div className="p-4">
            <h2 className="text-white text-xl font-semibold">Reel Title</h2>
            <p className="text-gray-400 text-sm">Description of the reel.</p>
          </div>
        </div>

        {/* You can repeat the reel items with different content */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <img 
            src="https://via.placeholder.com/300x400" 
            alt="Reel" 
            className="w-full h-72 object-cover" 
          />
          <div className="p-4">
            <h2 className="text-white text-xl font-semibold">Reel Title</h2>
            <p className="text-gray-400 text-sm">Description of the reel.</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <img 
            src="https://via.placeholder.com/300x400" 
            alt="Reel" 
            className="w-full h-72 object-cover" 
          />
          <div className="p-4">
            <h2 className="text-white text-xl font-semibold">Reel Title</h2>
            <p className="text-gray-400 text-sm">Description of the reel.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reels
