import supabase from "../../../lib/supabase";

export const useLogout = () => {

    const logout = async () => {
        if (!supabase) {
            console.error('Supabase är inte konfigurerat. Kontrollera dina VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY.');
            return false;
        }
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
                return false;
            }
            console.log("User logged out successfully");
            return true;
        } catch (error) {
            console.error('Oväntat fel vid utloggning:', error);
            return false;
        }
    };

    return { logout };
};