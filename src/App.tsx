import { useState } from 'react';
import './App.css'
import supabase from './lib/supabase.ts'

interface User {
  id: string;
  username: string;
  qr_code_url: string;
  linked_in_url: string;
  instagram_url: string;
  github_url: string;
}

function App() {

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<null | Error>(null);

  const fetchUsers = async () => {
    try {
      if (!supabase) {
        setError(new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file.'));
        return;
      }

      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        setError(error);
      } else {
        setUsers(data);
      }

    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return (
    <>
      <h1>Have a beer with me</h1>
      <button onClick={fetchUsers}>Fetch Users</button>
      {error && <p>Error: {error.message}</p>}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <h2>{user.username}</h2>
            <img src={user.qr_code_url} alt="QR Code" />
            <a href={user.linked_in_url} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={user.instagram_url} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={user.github_url} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
        ))}
      </ul>

    </>
  )
}
export default App
