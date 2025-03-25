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
    <div>
        {posts?.length > 0 ? posts.map((post, index) => (
            <p key={post.id || index}>{post.title}</p>
        )) : <p>No posts found.</p>}
    </div>
);
