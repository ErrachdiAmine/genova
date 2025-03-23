import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../auth';
import axios from 'axios';
import LoadingScreen from '../components/PostsLoading';
import { FaEllipsisV } from 'react-icons/fa'; // Import the three-dots icon

const Posts = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null); // Track which post's dropdown is open
  const API_URL = "https://genova-gsaa.onrender.com";

  // Fetch posts on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const postsResponse = await axios.get(`${API_URL}/api/posts/`);
      const postsData = postsResponse.data;
      const sortedPosts = postsData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setPosts(sortedPosts);
      setLoading(false);
    } catch (error) {
      alert('Failed to load posts.');
      console.error('Error fetching posts:', error);
    }
  };

  const toggleDropdown = (postId) => {
    setShowDropdown(showDropdown === postId ? null : postId);
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
          <form onSubmit={(e) => e.preventDefault()} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Title"
            />
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="What's on your mind?"
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              rows="4"
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Post
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
          {loading ? <LoadingScreen /> :
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 relative"
              >
                {/* Three-dots menu */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => toggleDropdown(post.id)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                  >
                    <FaEllipsisV className="text-gray-600 dark:text-gray-400" />
                  </button>
                  {showDropdown === post.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                      <button
                        onClick={() => {
                          // Handle Edit
                          console.log('Edit post:', post.id);
                          setShowDropdown(null);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          // Handle Delete
                          console.log('Delete post:', post.id);
                          setShowDropdown(null);
                        }}
                        className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">{post.body}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Posted by <span className="font-medium text-gray-900 dark:text-white">{post.author_details.username}</span> on{' '}
                  {new Date(post.created_at).toLocaleDateString()} {new Date(post.created_at).toLocaleTimeString()}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;