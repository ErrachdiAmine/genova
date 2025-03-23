import { useState,useEffect } from "react";



const ManagePosts = () => {

    const [posts, setPosts] = useState([]);

    
    const getCurrentUser = () => {
      const token = getAccessToken();
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    };

    const fetshData = async () => {
        try {
            const response = await axios.get('https://genova-gsaa.onrender.com/api/posts/');
            const userPosts = posts.filter(post => post.id === getCurrentUser());
            setPosts(userPosts);
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