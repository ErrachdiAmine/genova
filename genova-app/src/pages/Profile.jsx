import { Link } from 'react-router-dom';
import { FaEdit, FaUser, FaEnvelope, FaCalendar, FaNewspaper } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../auth';
import { motion } from 'framer-motion';

// Skeleton components
const BlockSkeleton = ({ children }) => (
  <motion.div
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 0.8 }}
    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
    className="animate-pulse"
  >
    {children}
  </motion.div>
);

const ProfileHeaderSkeleton = () => (
  <div className="flex flex-col items-center space-y-4">
    <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
    <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
  </div>
);

const UserInfoSkeleton = () => (
  <BlockSkeleton>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
      <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  </BlockSkeleton>
);

const PostsManagementSkeleton = () => (
  <BlockSkeleton>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
      <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  </BlockSkeleton>
);

const Profile = () => {
  const [loadingStates, setLoadingStates] = useState({
    header: true,
    info: true,
    posts: true
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        
        // Simulate different loading times
        setTimeout(() => setLoadingStates(s => ({...s, header: false})), 500);
        setTimeout(() => setLoadingStates(s => ({...s, info: false})), 800);
        setTimeout(() => setLoadingStates(s => ({...s, posts: false})), 1200);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  if (!user) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900"></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 pt-20">
      <div className="w-full max-w-4xl space-y-8">
        {/* Profile Header */}
        {loadingStates.header ? <ProfileHeaderSkeleton /> : (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-purple-500 dark:border-purple-600"
              />
              <button className="absolute bottom-0 right-0 bg-purple-500 dark:bg-purple-600 p-2 rounded-full hover:bg-purple-600 transition-colors">
                <FaEdit className="text-white" />
              </button>
            </div>
            <h1 className="text-3xl font-bold">{user.firstname}</h1>
            <p className="text-gray-600 dark:text-gray-300">@{user.username}</p>
          </div>
        )}

        {/* User Information Section */}
        {loadingStates.info ? <UserInfoSkeleton /> : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2 text-purple-500" />
              User Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-gray-500 dark:text-gray-300" />
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-gray-500 dark:text-gray-300" />
                <span className="font-medium">Joined:</span>
                <span>{new Date(user.date_joined).toLocaleDateString("en-US", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Posts Management Section */}
        {loadingStates.posts ? <PostsManagementSkeleton /> : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaNewspaper className="mr-2 text-purple-500" />
              Posts Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Your Activity</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Total Posts: {user.postsCount || 0}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Latest Post: 2 days ago
                </p>
              </div>
              <div className="space-y-4">
                <Link 
                  to="/profile/my-posts"
                  className="w-full bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <FaNewspaper className="mr-2" />
                  Manage Posts
                </Link>
                <button className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  View Statistics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account Settings Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-2">
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Change Password
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Privacy Settings
            </button>
            <button className="w-full text-left p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;