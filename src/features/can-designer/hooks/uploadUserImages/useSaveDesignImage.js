import supabase from '../../../../lib/supabase'
import { defaultDesign } from '../../types/CanDesign'

const generateShareId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const useSaveDesignImage = () => {
  const saveDesignImage = async (imageUrl) => {
    if (!supabase) {
      throw new Error('Supabase är inte konfigurerat. Kontrollera dina VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY.')
    }

    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      throw new Error('Kunde inte hitta nuvarande användare för att spara design.')
    }

    const userId = authData.user.id

    const { data: existingDesign, error: fetchError } = await supabase
      .from('designs')
      .select('id, design_data')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError) {
      throw new Error('Kunde inte hämta existerande design.')
    }

    const mergedDesignData = {
      ...defaultDesign,
      ...(existingDesign?.design_data || {}),
      imageUrl,
    }

    if (existingDesign?.id) {
      const { error: updateError } = await supabase
        .from('designs')
        .update({
          design_data: mergedDesignData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingDesign.id)

      if (updateError) {
        throw new Error('Kunde inte uppdatera existerande design.')
      }

      return existingDesign.id
    }

    const { data: insertData, error: insertError } = await supabase
      .from('designs')
      .insert({
        user_id: userId,
        design_data: mergedDesignData,
        name: mergedDesignData.name || 'Anonym design',
        share_id: generateShareId(),
      })
      .select('id')
      .single()

    if (insertError) {
      throw new Error('Kunde inte spara ny design.')
    }

    return insertData.id
  }

  return { saveDesignImage }
}
