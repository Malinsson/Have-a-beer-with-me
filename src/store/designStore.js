import { create } from "zustand";
import supabase from "../lib/supabase";
import { removeCachedValue } from "../lib/cache";

const initialName = { firstName: '', lastName: '', drinkType: '' };
const initialFront = {
    imageUrl: null,
    imageTransform: {
        x: 0,
        y: 0,
        scale: 1,
    },
    texturePreset: 'default',
    textColor: '#000000',
    textFont: 'Inter, sans-serif',
    textAlignment: 'center',
    drinkType: '',
};
const initialBack = {
    tags: [],
    description: '',
    department: '',
    socials: {
        instagram: '',
        linkedin: '',
        github: '',
    }
};

export const useDesignStore = create((set, get) => ({
    name: initialName,
    front: initialFront,
    back: initialBack,
    currentShareId: null,
    setName: (firstName, lastName, drinkType) => set({ name: { firstName, lastName, drinkType } }),
    setFront: (frontData) => set((state) => ({ front: { ...state.front, ...frontData } })),
    setBack: (backData) => set((state) => ({ back: { ...state.back, ...backData } })),



    loadDesign: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('designs')
                .select('design_data, share_id')
                .eq('user_id', userId)
                .maybeSingle();

            if (error) throw error;
            if (!data) throw new Error('Design not found');

            const { name: nameData, front: frontData, back: backData } = data.design_data;
            set({
                name: { ...initialName, ...(nameData || {}) },
                front: { ...initialFront, ...(frontData || {}) },
                back: {
                    ...initialBack,
                    ...(backData || {}),
                    socials: {
                        ...initialBack.socials,
                        ...(backData?.socials || {}),
                    },
                },
                currentShareId: data.share_id || null,
            });

            return { success: true };
        } catch (err) {
            console.error('Failed to load design:', err);
            return { success: false, error: err.message };
        }
    },

    getLatestDesignDataByUserId: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('designs')
                .select('id, design_data, share_id')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            return { 
                success: true, 
                designData: { 
                    id: data.id, 
                    share_id: data.share_id,
                    ...data.design_data 
                },
                
            };
        } catch (err) {
            console.error('Failed to fetch latest design:', err);
            return { success: false, error: err.message, designData: null, shareId: null };
        }
    },

    loadLatestDesignForCurrentUser: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) throw new Error('User not authenticated');

            const latest = await get().getLatestDesignDataByUserId(session.user.id);
            if (!latest.success) return { success: false, error: latest.error };
            if (!latest.designData) return { success: false, error: 'No design found' };

            const { name: nameData, front: frontData, back: backData } = latest.designData;

            set({
                name: { ...initialName, ...(nameData || {}) },
                front: { ...initialFront, ...(frontData || {}) },
                back: {
                    ...initialBack,
                    ...(backData || {}),
                    socials: {
                        ...initialBack.socials,
                        ...(backData?.socials || {}),
                    },
                },
                currentShareId: latest.shareId || null,
            });

            return { success: true };
        } catch (err) {
            console.error('Failed to load latest design:', err);
            return { success: false, error: err.message };
        }
    },

    getSavedDesignsByUserId: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('saved_designs')
                .select(`
                    id,
                    share_id,
                    created_at,
                    designs:design_id (
                        id,
                        user_id,
                        design_data
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            const formatted = await Promise.all(
                (data || []).map(async (item) => {
                  const design = item.designs;
                  const designData = design?.design_data || {};
                
                  const { data: profile, error: profileFetchError } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, slug_value')
                    .eq('id', design?.user_id)
                    .single();

                return {
                    savedId: item.id,
                    designId: design?.id,
                    ownerSlug: profile?.slug_value,
                    ownerFirstName: profile?.first_name || '',
                    ownerLastName: profile?.last_name || '',
                    department: designData.back?.department || '',
                    name: designData.name,
                    front: designData.front,
                    back: designData.back,
                    design_data: designData
                };
            })
        );

        return { success: true, designs: formatted };
        } catch (error) {
            console.error("Error fetching shelf:", error);
            return { success: false, error: error.message };
        }
    },


    saveDesign: async (designName, shareId) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) throw new Error('User not authenticated');


            const state = get();
            const effectiveShareId = shareId || state.currentShareId || crypto.randomUUID().slice(0, 8);
            const designData = {
                name: state.name,
                front: state.front,
                back: state.back,
            };

            const { data, error } = await supabase
                .from('designs')
                .upsert({
                    user_id: session.user.id,
                    design_data: designData,
                    name: designName,
                    share_id: effectiveShareId,
                }, { onConflict: 'share_id' })
                .select('id, share_id')
                .maybeSingle();

            if (error) throw error;
            removeCachedValue(`profile-design:${session.user.id}`);
            set({ currentShareId: data?.share_id || effectiveShareId });
            return { success: true, designId: data.id };
        } catch (err) {
            console.error('Failed to save design:', err);
            return { success: false, error: err.message };
        }
    },


    loadUserDesigns: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('designs')
                .select('id, name, created_at, share_id')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, designs: data || [] };
        } catch (err) {
            console.error('Failed to load user designs:', err);
            return { success: false, error: err.message, designs: [] };
        }
    },


    resetDesign: () => set({
        name: initialName,
        front: initialFront,
        back: initialBack,
        currentShareId: null,
    }),
}));
