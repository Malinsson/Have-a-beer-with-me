import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Stage, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

function Model(props: any) {
  const { scene } = useGLTF("/3DModels/BeerCan.glb")
  const labelImageUrl = "/3DModels/BeerCanLabel.webp"

useEffect(() => {
  const loader = new THREE.TextureLoader()

  let foundMesh = false

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      console.log('Found mesh:', child.name) // confirm Circle is being found
      
      if (child.name === 'Circle') {
        foundMesh = true
        console.log('Material type:', child.material.type)

        loader.load(
          labelImageUrl,
          (texture) => {
            console.log('Texture loaded successfully:', texture)
            const mesh = child as THREE.Mesh
            const material = mesh.material as THREE.MeshStandardMaterial
            
            texture.flipY = false                          // ← GLB models usually need this
            texture.colorSpace = THREE.SRGBColorSpace      // ← correct color space
            texture.needsUpdate = true                     // ← update the texture itself too
            
            material.map = texture
            material.needsUpdate = true
          
          },
          undefined,
          (error) => {
            console.error('Texture failed to load:', error) // or this?
          }
        )
      }
    }
  })

  if (!foundMesh) console.warn('Circle mesh was never found!')

}, [labelImageUrl, scene])

  return <primitive object={scene} {...props} />
}

function App() {

  return (
    <>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }} style={{ position: 'absolute', touchAction: 'none' }}>
        <color attach="background" args={['#2b2727']} />
        <PresentationControls
          global
          rotation={[0, Math.PI / 4, 0]}
          polar={[-Math.PI / 2, Math.PI / 2]}
          azimuth={[-Math.PI, Math.PI]}
          speed={1.5}
          zoom={0.6}
        >
          <Stage environment="dawn" intensity={0.4}>
            <Model scale={0.005} />
          </Stage>
        </PresentationControls>
      </Canvas>
    </>
  )
}

export default App
