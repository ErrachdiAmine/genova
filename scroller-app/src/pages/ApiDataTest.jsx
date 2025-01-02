import React from 'react'
import { useState, useEffect } from 'react';

const ApiDataTest = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect (() => {ers = async () => {
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
  <div className="min-h-screen text-center bg-gray-100 p-4 rounded-lg shadow-lg">
    { loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p>Error: {error}</p>
    ) : (
      users.map((user) => (
        <>
          <div className='flex flex-col mt-20 justify-center align-center bg-blue-600 border-2 border-gray-400 rounded-lg p-4'>
            <h1>User: {user.firstname}, Email: {user.email}</h1>
          </div>
          
        </>
      ))
    )}
  </div> 


  )}

export default ApiDataTest
