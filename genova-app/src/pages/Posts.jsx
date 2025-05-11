import React, { useState, useEffect, useCallback } from 'react';
import { getAccessToken, getCurrentUser } from '../auth';
import axios from 'axios';
import { FaEllipsisV, FaComment, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostSkeleton = () => (
  <motion.div
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 0.8 }}
    transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
    className="relative bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 mb-4 animate-pulse"
  >
    <div className="absolute top-4 right-4">
      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <div className="h-6 w-3/4 mb-4 rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-4 w-full mb-4 rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-4 w-2/3 mb-4 rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
  </motion.div>
);

const Comment = ({ comment, authorAvatars }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
    <img
      src={authorAvatars[comment.author.id]|| '/ProfileDefaultAvatar.jpg'}
      alt="Commenter"
      className="w-6 h-6 rounded-full object-cover font-bold border border-gray-300 dark:border-gray-600 shadow-sm"
    />
    <div className="flex-1">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        <span className="font-medium">{comment.author?.username || 'Anonymous'}</span>
        <span className="ml-2">{comment.body}</span>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {new Date(comment.created_at).toLocaleDateString()}
      </p>
    </div>
  </div>
);


const Posts = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [posts, setPosts] = useState([]);
  const [authorAvatars, setAuthorAvatars] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [comments, setComments] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newComment, setNewComment] = useState('');
  
  const API_URL = "https://genova-gsaa.onrender.com";
  const access = getAccessToken();

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);


  const handlePostSubmit = async () => {
    if (!postTitle.trim() || !postBody.trim()) return;
    try {
      await axios.post(
        `${API_URL}/api/posts/`,
        { title: postTitle, body: postBody },
        { headers: { Authorization: `Bearer ${access}` } }
      );
      setPostTitle('');
      setPostBody('');
      setShowForm(false);
      toast.success('Post created successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const fetchAuthorProfile = useCallback(async (authorId) => {
    if (!authorId || authorAvatars[authorId]) return;
    try {
      const response = await axios.get(`${API_URL}/api/users/${authorId}/profile`);
      setAuthorAvatars(prev => ({ ...prev, [authorId]: response.data.profile_image }));
    } catch (error) {
      setAuthorAvatars(prev => ({ ...prev, [authorId]: '/ProfileDefaultAvatar.jpg' }));
    }
  }, [API_URL, authorAvatars]);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/posts/`);
      const sortedPosts = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPosts(sortedPosts);
      sortedPosts.forEach(post => fetchAuthorProfile(post.author_details?.id));
    } catch (error) {
      toast.error('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  }, [API_URL, fetchAuthorProfile]);

  const fetchComments = useCallback(async (postId) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/posts/${postId}/comments/`);
      setComments(prev => ({ ...prev, [postId]: data }));
      console.log('Comments:', data);
    } catch (error) {
      toast.error('Failed to load comments');
    }
  }, [API_URL]);

  const handleCommentSubmit = useCallback(async (postId) => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${API_URL}/api/posts/${postId}/comments/`,
        { body: newComment },
        { headers: { Authorization: `Bearer ${access}` } }
      );

      setNewComment('');
      await fetchComments(postId);
    } catch (error) {
      toast.error('Failed to post comment');
    }
  }, [API_URL, access, newComment, fetchComments]);

  const toggleDropdown = useCallback((postId) => {
    setShowDropdown(prev => prev === postId ? null : postId);
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        await getCurrentUser();
        fetchData();
      } catch (error) {
        toast.error('Failed to load user data');
      }
    };
    loadUserData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-16">
      <h1 className="text-3xl sm:text-4xl text-center font-bold mb-8">Posts</h1>

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
          <form onSubmit={e => e.preventDefault()} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>
            <input
              type="text"
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
              placeholder="Title"
              required
              className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              rows="4"
              value={postBody}
              onChange={e => setPostBody(e.target.value)}
              placeholder="What's on your mind?"
              required
              className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePostSubmit()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Post
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {loading
            ? [1, 2, 3].map((_, i) => <PostSkeleton key={i} />)
            : posts.map(post => (
                <div
                  key={post.id}
                  className="flex flex-col md:flex-row gap-6"
                >
                  {/* Main post card */}
                  <div className="flex-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-300 dark:border-gray-700 relative">
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
                      Posted on {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedPostId(prev => (prev === post.id ? null : post.id));
                        if (!comments[post.id]) fetchComments(post.id);
                      }}
                      className="mt-4 flex items-center space-x-2 text-purple-600 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200"
                    >
                      <FaComment />
                      <span>comments</span>
                    </button>
                  </div>

                  {/* Comments sidebar */}
                  {selectedPostId === post.id && (
                    <div className="w-full md:w-96 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg p-4">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Comments
                      </h3>
                      <div className="flex-1 overflow-y-auto max-h-96 pr-2 space-y-2">
                        {comments[post.id]?.map(c => (
                          <Comment key={c.id} comment={c} authorAvatars={authorAvatars} />
                        ))}
                      </div>
                      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="What do you think...?"
                            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            onClick={() => handleCommentSubmit(post.id)}
                            className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                          >
                            <FaPaperPlane />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;