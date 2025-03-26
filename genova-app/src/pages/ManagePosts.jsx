import { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../auth";
import { getAccessToken } from "../auth";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

// Skeleton Component
const PostCardSkeleton = () => {
  const isDarkMode = typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark';
  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
  const elementColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-300';

  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      className={`${bgColor} rounded-lg shadow-lg p-6 animate-pulse`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`h-6 w-3/4 rounded ${elementColor}`}></div>
        <div className="flex space-x-2">
          <div className={`w-6 h-6 rounded-full ${elementColor}`}></div>
          <div className={`w-6 h-6 rounded-full ${elementColor}`}></div>
        </div>
      </div>
      <div className={`h-4 w-full rounded ${elementColor} mb-4`}></div>
      <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
        <div className="flex justify-between">
          <div className={`h-3 w-24 rounded ${elementColor}`}></div>
          <div className={`h-3 w-32 rounded ${elementColor}`}></div>
        </div>
      </div>
    </motion.div>
  );
};

const ManagePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loadingStates, setLoadingStates] = useState({
        user: true,
        posts: true
    });
    const [user, setUser] = useState(null);
    const token = getAccessToken();

    // Dark mode setup
    useEffect(() => {
        const isDarkMode = localStorage.getItem('theme') === 'dark';
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, []);

    // User data loading
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
                setLoadingStates(prev => ({...prev, user: false}));
            } catch (error) {
                toast.error('Failed to load user data');
                setLoadingStates(prev => ({...prev, user: false}));
            }
        };
        loadUserData();
    }, []);

    // Posts data loading
    const fetchPosts = async () => {
        try {
            const response = await axios.get('https://genova-gsaa.onrender.com/api/posts/my-posts/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userPosts = Array.isArray(response.data) 
                ? response.data.filter(post => 
                    post.author_details?.id === user?.id
                  ).sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  ) : [];

            setPosts(userPosts);
        } catch (error) {
            toast.error('Failed to load posts');
        } finally {
            setLoadingStates(prev => ({...prev, posts: false}));
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchPosts();
        }
    }, [user, token]);

    // Edit/Delete states and handlers
    const [editPost, setEditPost] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editBody, setEditBody] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePostId, setDeletePostId] = useState(null);
    
    const handleEdit = (post) => {
        setEditPost(post);
        setEditTitle(post.title);
        setEditBody(post.body);
    };
    
    const handleUpdate = async () => {
        if (!editPost || editPost?.author_details?.id !== user?.id) {
            toast.error('Unauthorized action');
            return;
        }

        try {
            const updatingDate = new Date();
            const response = await axios.put(
                `https://genova-gsaa.onrender.com/api/posts/${editPost.id}/`,
                { title: editTitle, body: editBody, updated_at: updatingDate},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPosts(posts.map(post => post.id === editPost.id ? response.data : post));
            setEditPost(null);
            toast.success('Post updated successfully!');
        } catch (error) {
            toast.error('Failed to update post');
            console.error('Error updating post:', error);
        }
    };
    
    const handleDelete = async (postId) => {
        try {
            await axios.delete(
                `https://genova-gsaa.onrender.com/api/posts/${postId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPosts(posts.filter(post => post.id !== postId));
            setShowDeleteModal(false);
            toast.success('Post deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete post');
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pt-16">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Manage Posts</h1>

                {/* Posts Grid */}
                {loadingStates.posts ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((_, index) => (
                            <PostCardSkeleton key={index} />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            No posts found. 
                            <Link 
                                to="/posts"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"  
                            >
                                Create your first post.
                            </Link>
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        {post.title}
                                    </h3>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleEdit(post)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setDeletePostId(post.id);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 dark:text-gray-300 mb-4">{post.body}</p>
                                
                                <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Posted by: {post.author_details?.username || 'Unknown'}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {post.updated_at !== post.created_at && (
                                        <div className="mt-2 text-xs text-gray-400">
                                            Last updated: {new Date(post.updated_at).toLocaleTimeString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                {editPost && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
                            <h2 className="text-2xl font-bold mb-4 dark:text-white">Edit Post</h2>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full p-3 mb-4 border rounded-lg dark:bg-gray-700 dark:text-white"
                            />
                            <textarea
                                value={editBody}
                                onChange={(e) => setEditBody(e.target.value)}
                                className="w-full p-3 mb-4 border rounded-lg h-32 dark:bg-gray-700 dark:text-white"
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setEditPost(null)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4 dark:text-white">Delete Post</h2>
                            <p className="mb-6 text-gray-600 dark:text-gray-300">
                                Are you sure you want to delete this post? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deletePostId)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagePosts;