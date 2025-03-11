import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../auth'; // Import the function to get the current user
import { getAccessToken } from '../auth';
import axios from 'axios';

const Posts = () => {
  const [author, setAuthor] = useState(null); // State to hold the author
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState(''); 
  const [posts, setPosts] = useState([]); // State to hold the list of posts

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser(); // Get the current user
        if (user) {
          setAuthor(user); // Set the author in the state
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAccessToken(); // Retrieve the token
    const response = await axios.post('http://127.0.0.1:8000/api/posts/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: postBody, 
      author: author,
      title: postTitle
    }); 
    console.log('Post published:', response.data);
    // Reset the form fields
    setPostTitle('');
    setPostBody(''); 
    fetchPosts();
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/posts/');
      setPosts(response.data); // Set the posts in the state
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <h1 className="text-4xl text-center text-gray-800 font-semibold mb-8">Posts</h1>

      {/* Create a Post Block */}
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Create a Post</h2>
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="w-60 p-2 border border-gray-300 rounded-lg"
            placeholder="Title"
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="What's on your mind?"
            value={postBody} 
            onChange={(e) => setPostBody(e.target.value)}
          />
          <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded-lg">
            Post
          </button>
        </form>
        {/* Display Published Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-gray-700">{post.content}</p>
              <p className="text-gray-500 text-sm">Posted by {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
