import React from 'react'

const fetshAPI = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect ( () => {
      const fetshUsers = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/users/')
          if (!response.ok) {
            throw new error(`Error encountered: ${response.statusText}`);
          }
          const data = await response.json();
          setUsers(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetshUsers();
  
    }, []);
  return (
    {users}
  )
}

export default fetshAPI