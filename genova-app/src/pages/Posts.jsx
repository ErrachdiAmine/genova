import React, { useState, useEffect, useCallback } from 'react';
import { getAccessToken, getCurrentUser } from '../auth';
import axios from 'axios';
import { FaEllipsisV } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  const [authorAvatars, setAuthorAvatars] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const API_URL = "https://genova-gsaa.onrender.com";
  const access = getAccessToken();

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const fetchAuthorProfile = useCallback(async (authorId) => {
    if (!authorId) return;
    if (authorAvatars[authorId]) return; // Already fetched

    try {
      const response = await axios.get(`${API_URL}/api/users/${authorId}/profile`, {
        headers: { 'Authorization': `Bearer ${access}` }
      });
      setAuthorAvatars(prev => ({ ...prev, [authorId]: response.data.profile_image }));
    } catch (error) {
      console.error(`Error fetching profile for author ${authorId}:`, error);
      setAuthorAvatars(prev => ({ ...prev, [authorId]: '/ProfileDefaultAvatar.jpg' }));
    }
  }, [API_URL, access, authorAvatars]);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/posts/`);
      const sortedPosts = data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setPosts(sortedPosts);

      // Fetch author profiles for all posts
      const uniqueAuthorIds = [...new Set(sortedPosts.map(post => post.author_details?.id).filter(Boolean))];
      uniqueAuthorIds.forEach(authorId => {
        fetchAuthorProfile(authorId);
      });
    } catch (error) {
      toast.error('Failed to load posts.');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, fetchAuthorProfile]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        toast.error('Failed to load user data');
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleDropdown = useCallback((postId) => {
    setShowDropdown(prev => prev === postId ? null : postId);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!access) {
      toast.error('You must be logged in to perform this action.');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/posts/`,
        { title: postTitle, body: postBody },
        { headers: { Authorization: `Bearer ${access}` } }
      );
      toast.success('Post created successfully!');
      setPostTitle('');
      setPostBody('');
      setShowForm(false);
      await fetchData();
    } catch (error) {
      toast.error('Failed to create post');
      console.error('Error posting:', error);
    }
  }, [access, postTitle, postBody, API_URL, fetchData]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 pt-16">
      <h1 className="text-4xl text-center font-bold mb-8">Posts</h1>

      <div className="w-full max-w-3xl space-y-8">
        {!showForm && access && (
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
                {access && (
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => toggleDropdown(post.id)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                      <FaEllipsisV className="text-gray-600 dark:text-gray-400" />
                    </button>
                    {showDropdown === post.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                        <Link to="/profile/my-posts">
                          <button className='block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'>
                              Edit
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-2 mb-4">
                  <img
                    src={authorAvatars[post.author_details?.id] || '/ProfileDefaultAvatar.jpg'}
                    alt="Author Profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {post.author_details?.username || 'Unknown'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">{post.body}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Posted on{' '}
                  {new Date(post.created_at).toLocaleDateString()} {new Date(post.created_at).toLocaleTimeString()}
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
