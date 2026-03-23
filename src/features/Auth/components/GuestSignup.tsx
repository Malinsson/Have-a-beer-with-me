import supabase from "../../../lib/supabase";
import { useEffect } from "react";

export function GuestSignup() {

useEffect(() => {


  const initAuth = async () => {
    
      if (!supabase) {
        console.error('Supabase is not configured. Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
        return;
      }
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      // No session — create a guest
      await supabase.auth.signInAnonymously()
    }
  }

  initAuth()
}, [])

}