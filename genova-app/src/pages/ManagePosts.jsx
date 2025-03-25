import { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../auth";
import { getAccessToken } from "../auth";
import LoadingScreen from "../components/postManagementLoading";

const ManagePosts = () => {
    const [posts, setPosts] = useState([]);
    const token = getAccessToken();
    const currentUser = getCurrentUser();

    const isDarkMode = localStorage.getItem('theme') === 'dark';
    {isDarkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark') }
  

    useEffect(() => {
        const fetchData = async () => {
            if (!token || !currentUser) {
                console.warn("Token or Current User is missing, skipping API call.");
                return;
            }

            try {
                const response = await axios.get('https://genova-gsaa.onrender.com/api/posts/', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Token:", token);
                console.log("Current User:", currentUser);
                console.log("API Response:", response.data);

                // Ensure response.data is an array before filtering
                setPosts(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchData();
    }, [token, currentUser]);
    
    // Add state for editing
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
        try {
            const response = await axios.put(
                `https://genova-gsaa.onrender.com/api/posts/${editPost.id}/`,
                { title: editTitle, body: editBody },
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
                
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <LoadingScreen />
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
                                            Posted by: {post.author?.username || 'Unknown'}
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
)};

export default ManagePosts;