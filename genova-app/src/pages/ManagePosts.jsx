import { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../auth";
import { getAccessToken } from "../auth";
import LoadingScreen from "../components/postManagementLoading";

const ManagePosts = () => {
    const [posts, setPosts] = useState([]);
    const token = getAccessToken();
    const currentUser = getCurrentUser();

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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 pt-16">
            {posts?.length > 0 ? posts.map((post, index) => (
                <p key={post.id || index}>{post.title}</p>
            )) : <LoadingScreen />}
        </div>
    );
};

export default ManagePosts;