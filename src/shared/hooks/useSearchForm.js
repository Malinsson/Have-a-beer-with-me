import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { buildProfileSlug } from "../../features/profile/utils/slug";

export const useSearchForm = ({ onSuccess } = {}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchError, setSearchError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        const term = searchQuery.trim();
        if (!term) return;

        setSearchError(null);
        setIsSearching(true);

        try {
            const { data: canMatch, error: canError } = await supabase
                .from("designs")
                .select("share_id")
                .eq("share_id", term)
                .maybeSingle();

            if (canError) throw canError;
            if (canMatch?.share_id) {
                navigate(`/can/${canMatch.share_id}`);
                setSearchQuery("");
                onSuccess?.();
                return;
            }

            const slugCandidate = term.toLowerCase().replace(/\s+/g, "-");
            const { data: slugMatch, error: slugError } = await supabase
                .from("profiles")
                .select("slug_value, first_name, last_name")
                .eq("slug_value", slugCandidate)
                .maybeSingle();

            if (slugError) throw slugError;
            if (slugMatch) {
                const slug = slugMatch.slug_value || buildProfileSlug(slugMatch.first_name, slugMatch.last_name);
                navigate(`/profile/${slug}`);
                setSearchQuery("");
                onSuccess?.();
                return;
            }

            const parts = term.split(/\s+/).filter(Boolean);
            let nameMatch = null;

            if (parts.length >= 2) {
                const firstName = parts[0];
                const lastName = parts.slice(1).join(" ");

                const { data, error: nameError } = await supabase
                    .from("profiles")
                    .select("slug_value, first_name, last_name")
                    .ilike("first_name", firstName)
                    .ilike("last_name", lastName)
                    .limit(1)
                    .maybeSingle();

                if (nameError) throw nameError;
                nameMatch = data;
            } else {
                const { data, error: firstNameError } = await supabase
                    .from("profiles")
                    .select("slug_value, first_name, last_name")
                    .ilike("first_name", term)
                    .limit(1)
                    .maybeSingle();

                if (firstNameError) throw firstNameError;
                nameMatch = data;
            }

            if (nameMatch) {
                const slug = nameMatch.slug_value || buildProfileSlug(nameMatch.first_name, nameMatch.last_name);
                navigate(`/profile/${slug}`);
                setSearchQuery("");
                onSuccess?.();
                return;
            }

            setSearchError("Ingen träff hittades.");
        } catch (error) {
            console.error("Search error:", error);
            setSearchError("Sökningen misslyckades. Försök igen.");
        } finally {
            setIsSearching(false);
        }
    };

    return { searchQuery, setSearchQuery, handleSearch, searchError, isSearching };
};
