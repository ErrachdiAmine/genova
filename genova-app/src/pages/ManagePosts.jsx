import { useState,useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../auth";
import { getAccessToken } from "../auth";


const ManagePosts = () => {
    const token = getAccessToken();
    const [posts, setPosts] = useState([]);
    const currentUser = getCurrentUser();
    console.log(currentUser.username);

    const fetshData = async () => {
        try {
            const response = await axios.get('https://genova-gsaa.onrender.com/api/posts/', 
            { headers: { Authorization: `Bearer ${token}`}}
            );

            const posts = response.data.map((post) => {
                return (post.username === currentUser.username ? post : null)
            });

            setPosts(posts);

        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetshData()
    }
    , []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 pt-16">
        <h1>{posts}</h1>
        </div>
    );
}


export default ManagePosts;