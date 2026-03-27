import React, { useState } from 'react'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'

const ImageCrop = () => {
  const { saveDesignImage } = useSaveDesignImage()
  const [latestDesignId, setLatestDesignId] = useState(null)

  const handleUploadComplete = async (url) => {
    try {
      const designId = await saveDesignImage(url)
      setLatestDesignId(designId)
      console.log('Bild uppladdad och sparat i designs.design_data.imageUrl:', url)
    } catch (error) {
      console.error('Kunde inte spara uppladdad bild URL i design_data.', error)
    }
  }

  return (
    <>
      <h1>Have a beer with me</h1>
      <SignupForm />
      <LoginForm />
      <ListUsers />
      <ImageUploader onUploadComplete={handleUploadComplete} />
      <ProfileQRCode designId={latestDesignId} size={256} />
    </>
  )
}