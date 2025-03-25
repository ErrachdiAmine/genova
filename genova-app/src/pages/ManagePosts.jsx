import { useState,useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../auth";
import { getAccessToken } from "../auth";


const ManagePosts = () => {
    const token = getAccessToken();
    const [posts, setPosts] = useState([]);
    const currentUser = getCurrentUser();
    console.log(currentUser.username);

    
    const fetchData = async () => {
        try {
            const response = await axios.get('https://genova-gsaa.onrender.com/api/posts/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Token:", token);
            console.log("Current User:", currentUser);
            console.log("API Response:", response.data);    
            // Ensure response.data is an array before filtering
            const posts = Array.isArray(response.data)
                ? response.data.filter(post => post.username === currentUser.username)
                : [];
    
            setPosts(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
    

    useEffect(() => {
        fetchData
    }
    , []);

    


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 pt-16">
        <h1>{posts}</h1>
        </div>
    );
}


export default ManagePosts;