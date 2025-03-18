import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto text-center">
        {/* Copyright */}
        <p className="text-sm mb-4">&copy;  Genova. All Rights Reserved.</p>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:text-blue-400 transition duration-300">
            <i className="fab fa-facebook-f"></i> {/* Facebook Icon */}
          </a>
          <a href="#" className="hover:text-blue-400 transition duration-300">
            <i className="fab fa-twitter"></i> {/* Twitter Icon */}
          </a>
          <a href="#" className="hover:text-pink-500 transition duration-300">
            <i className="fab fa-instagram"></i> {/* Instagram Icon */}
          </a>
          <a href="#" className="hover:text-blue-700 transition duration-300">
            <i className="fab fa-linkedin-in"></i> {/* LinkedIn Icon */}
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
