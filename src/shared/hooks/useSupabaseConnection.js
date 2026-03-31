import supabase from "../../lib/supabase";

export const useSupabaseConnection = () => {

    const isConnected = !!supabase;
    if (!isConnected) {
        console.error('Supabase är inte konfigurerat. Kontrollera dina VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY.');
    }
    return isConnected;
};