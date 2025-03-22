import React, { useEffect, useState } from 'react';

export function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  const isDarkMode = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); // Save user preference
}

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const handleToggle = () => {
    toggleDarkMode();
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
        <div className="flex items-center">
          <label htmlFor="darkModeToggle" className="mr-4 text-gray-800 dark:text-gray-300">Dark Mode:</label>
          <input
            id="darkModeToggle"
            type="checkbox"
            checked={isDarkMode}
            onChange={handleToggle}
            className="toggle-checkbox hidden"
          />
          <div
            className={`w-14 h-7 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 cursor-pointer`}
            onClick={handleToggle}
          >
            <div
              className={`bg-white dark:bg-gray-700 w-6 h-6 rounded-full shadow-md transform ${
                isDarkMode ? 'translate-x-7' : 'translate-x-0'
              }`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
