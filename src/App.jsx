import './App.css'
import { SignupForm } from './features/auth/components/SignupForm';
import { LoginForm } from './features/auth/components/LoginForm';
import { ListUsers } from './tests/ListUsers';
import { ImageUploader } from './features/can-designer/components/ImageUploader';
import supabase from './lib/supabase';
import { defaultDesign } from './features/can-designer/types/CanDesign';



function App() {
  const handleUploadComplete = async (url) => {
    if (!supabase) {
      console.error('Supabase is not configured.')
      return
    }

    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      console.error('Could not resolve current user for design save.', authError)
      return
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
      console.error('Failed to fetch existing design.', fetchError)
      return
    }

    const mergedDesignData = {
      ...defaultDesign,
      ...(existingDesign?.design_data || {}),
      imageUrl: url,
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
        console.error('Failed to update design image URL.', updateError)
        return
      }
    } else {
      const shareId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

      const { error: insertError } = await supabase
        .from('designs')
        .insert({
          user_id: userId,
          design_data: mergedDesignData,
          name: mergedDesignData.name || 'Untitled design',
          share_id: shareId,
        })

      if (insertError) {
        console.error('Failed to create design with image URL.', insertError)
        return
      }
    }

    console.log('Image uploaded and saved to designs.design_data.imageUrl:', url)
  }

  return (
    <>
      <h1>Have a beer with me</h1>
      <SignupForm />
      <LoginForm />
      <ListUsers />
      <ImageUploader onUploadComplete={handleUploadComplete} />
    </>
  )
}

export default App
