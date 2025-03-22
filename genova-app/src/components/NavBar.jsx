import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown menu visibility
  const toggleMenu = () => setMenuVisible((prevState) => !prevState);

  // Close dropdown if click happens outside of it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };

  // Attach or remove the event listener when menu visibility changes
  useEffect(() => {
    if (menuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup to avoid memory leaks
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuVisible]);

  // Close menu on clicking any link inside the dropdown
  const handleLinkClick = () => setMenuVisible(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-md p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img src="genova-logo.png" alt="logo" className="w-6 h-6 object-cover" />
          <h1 className="text-xl font-bold text-white">Genova</h1>
        </div>

        {/* Centered Navigation Links */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8">
          <Link to="/" className="text-gray-300 hover:text-purple-400 transition duration-300">Home</Link>
          <Link to="/Posts" className="text-gray-300 hover:text-purple-400 transition duration-300">Posts</Link>
        </div>

        {/* Profile Icon */}
        <div className="md:flex items-center relative">
          <img
            src="user.png"
            alt="profile"
            className="w-8 h-8 object-cover cursor-pointer"
            onClick={toggleMenu} // Toggles dropdown visibility
          />

          {/* Dropdown Menu */}
          {menuVisible && (
            <div
              ref={dropdownRef}
              className="absolute top-full right-0 mt-2 bg-gray-800 text-white rounded-lg shadow-lg w-44"
            >
              <ul className="py-2">
                <li>
                  <Link
                    to="/Settings"
                    className="block px-4 py-2 hover:bg-gray-700"
                    onClick={handleLinkClick} // Close menu after clicking the link
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Login"
                    className="block px-4 py-2 hover:bg-gray-700"
                    onClick={handleLinkClick} // Close menu after clicking the link
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
