import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../auth';
import axios from 'axios';
import { FaEllipsisV } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PostSkeleton = () => {
  const isDarkMode = typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark';
  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const elementColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-200';

  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      className={`${bgColor} shadow-lg rounded-lg p-6 border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-300'
      } mb-4 animate-pulse`}
    >
      <div className="absolute top-4 right-4">
        <div className={`w-6 h-6 rounded-full ${elementColor}`}></div>
      </div>
      <div className={`h-6 w-3/4 mb-4 rounded ${elementColor}`}></div>
      <div className={`h-4 w-full mb-4 rounded ${elementColor}`}></div>
      <div className={`h-4 w-2/3 mb-4 rounded ${elementColor}`}></div>
      <div className={`h-3 w-1/2 rounded ${elementColor}`}></div>
    </motion.div>
  );
};

const Posts = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const API_URL = "https://genova-gsaa.onrender.com";

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const fetchData = async () => {
    try {
      const postsResponse = await axios.get(`${API_URL}/api/posts/`);
      const postsData = postsResponse.data;
      const sortedPosts = postsData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setPosts(sortedPosts);
    } catch (error) {
      alert('Failed to load posts.');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDropdown = (postId) => {
    setShowDropdown(showDropdown === postId ? null : postId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) {
      alert('You must be logged in to perform this action.');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/posts/`,
        { title: postTitle, body: postBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Post created successfully!');
      setPostTitle('');
      setPostBody('');
      setShowForm(false);
      await fetchData();
    } catch (error) {
      console.error('Error posting:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 pt-16">
      <h1 className="text-4xl text-center font-bold mb-8">Posts</h1>

      <div className="w-full max-w-3xl space-y-8">
        {!showForm && getAccessToken() && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Create Post
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Title"
              required
            />
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="What's on your mind?"
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              rows="4"
              required
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Create Post
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Cancel 
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {loading ? (
            [1, 2, 3].map((_, index) => <PostSkeleton key={index} />)
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 relative"
              >
                {getAccessToken() && (
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => toggleDropdown(post.id)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                      <FaEllipsisV className="text-gray-600 dark:text-gray-400" />
                    </button>
                    {showDropdown === post.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                        <button className='block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'>
                          View
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">{post.body}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Posted on{' '}
                  {new Date(post.created_at).toLocaleDateString()} {new Date(post.created_at).toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Updated on{' '}
                  {new Date(post.updated_at).toLocaleDateString()} {new Date(post.updated_at).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;