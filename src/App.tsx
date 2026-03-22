import { useState } from 'react';
import './App.css'
import supabase from './lib/supabase.ts'

interface Profile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  qr_code: string;
  linkedin_url: string;
  instagram_url: string;
  github_url: string;
}

function App() {

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<null | Error>(null);

  const fetchProfiles = async () => {
    try {
      if (!supabase) {
        setError(new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file.'));
        return;
      }

      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        setError(error);
      } else {
        setProfiles(data);
      }

    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return (
    <>
      <h1>Have a beer with me</h1>
      <button onClick={fetchProfiles}>Fetch Profiles</button>
      {error && <p>Error: {error.message}</p>}
      <ul>
        {profiles.map(profile => (
          <li key={profile.id}>
            <h2>{profile.first_name} {profile.last_name}</h2>
            <img src={profile.qr_code} alt="QR Code" />
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
        ))}
      </ul>

    </>
  )
}
export default App
