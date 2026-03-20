import './App.css'
import supabase from './lib/supabase.ts'

const { data, error } = await supabase
  .from('users')
  .select('id, username, qr_code_url, linked_in_url, instagram_url, github_url');

function App() {

  
  return (

  )
}
export default App
