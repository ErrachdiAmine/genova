import React from 'react'
import { useState, useEffect } from 'react';
import Loading from '../components/loading';

const ApiDataTest = () => {

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
  <>
  <div className="min-h-screen bg-gray-100 p-4 rounded-lg shadow-lg">
    <div className='flex flex-col justify-center align-center border-2 border-gray-400 rounded-lg p-4 w-fit'>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
          </tr>
        </thead>
        <br />
        <tbody>
        { loading ? (
            <Loading />
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.password}</td>
            </tr>
        
          )) 
        )}
        </tbody>
      </table>
    </div>
  </div> 
  </>
  )}

export default ApiDataTest