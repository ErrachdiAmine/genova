import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Loading from './loading';

const NavBar = () => {

  const isLoading = localStorage.getItem('loading');
  if (isLoading === 'true') {
    return <Loading />;
    }


  

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img
            src="youtube.png"
            alt="logo"
            className="w-8 h-8 object-cover rounded-full"
          />
          <h1 className="text-xl font-bold text-gray-800">Scroller</h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-500 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/Posts"
            className="text-gray-700 hover:text-blue-500 transition duration-300"
          >
            Posts
          </Link>
        </div>

        {/* Login Button */}
        <div className="md:flex items-center">
          <Link
            to="/Login"
            className="text-gray-700 font-semibold hover:text-blue-500 transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Mobile Menu (for smaller screens) */}
      <div className="md:hidden mt-4 border-t pt-4 flex justify-center gap-6">
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-500 transition duration-300"
        >
          Home
        </Link>
        <Link
          to="/Posts"
          className="text-gray-700 hover:text-blue-500 transition duration-300"
        >
          Posts
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
