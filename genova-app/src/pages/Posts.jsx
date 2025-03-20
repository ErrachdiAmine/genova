import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../auth';
import axios from 'axios';
import LoadngScreen from '../components/loading';

const Posts = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [posts, setPosts] = useState([]); // State to hold the list of posts
  const [loading, setLoading] = useState(false); // State to manage loading
  const [showForm, setShowForm] = useState(false); // Control form visibility
  const API_URL = "https://genova-gsaa.onrender.com"

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAccessToken(); // Retrieve the token
    try {
      const response = await axios.post(
        `${API_URL}/api/posts/`,
        { title: postTitle, body: postBody },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Post published:', response.data);
      // Reset the form fields and hide the form
      setPostTitle('');
      setPostBody('');
      setShowForm(false);
      fetchData(); // Fetch the updated list of posts
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const postsResponse = await axios.get(`${API_URL}/api/posts/`);
      setLoading(false); // Set loading to false after fetching
      const postsData = postsResponse.data;

      // For each post, fetch the user details and add the username to the post object.
      const postsWithUsernames = await Promise.all(
        postsData.map(async (post) => {
          try {
            const userResponse = await axios.get(
              `${API_URL}/api/users/${post.author}/`
            );
            return { ...post, username: userResponse.data.username };
          } catch (error) {
            console.error(`Error fetching user for post ${post.id}:`, error);
            return { ...post, username: post.author };
          }
        })
      );

      // Sort posts so the newest posts (latest created_at) appear first
      const sortedPosts = postsWithUsernames.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-4xl text-center text-gray-800 font-bold mb-8">
        Posts
      </h1>

      <div className="w-full max-w-3xl space-y-8">
        {/* Toggle button for post creation */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Create Post
          </button>
        )}

        {/* Post creation form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Create a Post
            </h2>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Title"
            />
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="What's on your mind?"
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              rows="4"
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Post
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Display Published Posts */}
        <div className="space-y-6">
          {loading ? (
            <LoadngScreen />
          ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-700 mb-4">{post.body}</p>
              <p className="text-sm text-gray-500">
                Posted by <span className="font-medium">{post.username}</span> on{' '}
                {new Date(post.created_at).toLocaleDateString()} {new Date(post.created_at).toLocaleTimeString()}
              </p>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
