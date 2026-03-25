import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import beerCanSceneUrl from '../../../assets/3DModels/BeerCan3.glb?url'
import beerCanLabelUrl from '../../../assets/3DModels/BeerCanLabel.png'

function Model(props) {
  const { scene } = useGLTF(beerCanSceneUrl)
  const labelTexture = useTexture(beerCanLabelUrl)

  useEffect(() => {
    labelTexture.flipY = false
    labelTexture.colorSpace = THREE.SRGBColorSpace
    labelTexture.needsUpdate = true

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === 'Main_boody002_1') {
        if (child.material && !Array.isArray(child.material)) {
          child.material.map = labelTexture
          child.material.needsUpdate = true
        }
      }
    })
  }, [scene, labelTexture])

  return <primitive object={scene} {...props} />
}

export function CanPreview3D() {

  return (
    <>
      <Canvas dpr={[1, 2]} gl={{ precision: 'mediump' }} camera={{ position: [0, 0, 5], fov: 50 }} style={{ position: 'absolute', touchAction: 'none' }}>
        <color attach="background" args={['#2b2727']} />
        <Stage>
          <Model scale={0.5} />
        </Stage>
        <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </>
  )
}