import supabase from './lib/supabase.ts'
import { useState } from 'react';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  qr_code: string;
  linkedin_url: string;
  instagram_url: string;
  github_url: string;
}

export const ListUsers: React.FC = () => {

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
            <p>{profile.id}</p>
            <h2>{profile.first_name} {profile.last_name}</h2>
          </li>
        ))}
      </ul>

    </>
  )
}