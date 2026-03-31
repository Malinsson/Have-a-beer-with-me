import { create } from "zustand";
import supabase from "../lib/supabase";

export const useDesignStore = create((set, get) => ({
    front: {
        name: { firstName: '', lastName: '' },
        imageUrl: null,
        texturePreset: 'default',
        textColor: '#000000',
        textFont: 'Arial, sans-serif',
        textAlignment: 'center',
    },
    back: {
        tags: [],
        description: '',
        department: '',
        socials: {
            instagram: '',
            linkedin: '',
            github: '',
        }
    },
    setName: (firstName, lastName) => set({ name: { firstName, lastName } }),
    setFront: (frontData) => set({ front: { ...frontData } }),
    setBack: (backData) => set({ back: { ...backData } }),



    loadDesign: async (designId) => {
        try {
            const { data, error } = await supabase
                .from('designs')
                .select('design_data')
                .eq('id', designId)
                .maybeSingle();

            if (error) throw error;
            if (!data) throw new Error('Design not found');

            const { name: nameData, front: frontData, back: backData } = data.design_data;
            set({
                name: nameData || { firstName: '', lastName: '' },
                front: frontData || {},
                back: backData || {},
            });

            return { success: true };
        } catch (err) {
            console.error('Failed to load design:', err);
            return { success: false, error: err.message };
        }
    },


    saveDesign: async (designName, shareId) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) throw new Error('User not authenticated');


            const state = get();
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
                    share_id: shareId || `design-${Date.now()}`,
                }, { onConflict: 'share_id' })
                .select('id')
                .maybeSingle();

            if (error) throw error;
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
        name: { firstName: '', lastName: '' },
        front: { 
            imageUrl: null, 
            texturePreset: 'default', 
            textColor: '#000000', 
            textFont: 'Arial, sans-serif', 
            textAlignment: 'center' 
        },
        back: { 
            tags: [], 
            description: '', 
            department: '', 
            socials: { instagram: '', linkedin: '', github: '' } 
        },
    }),
}));
