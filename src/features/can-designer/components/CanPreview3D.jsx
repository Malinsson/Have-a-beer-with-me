import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, useTexture, PresentationControls, Stage } from '@react-three/drei'
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

export default function CanPreview3D() {

  return (
    <>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }} style={{ position: 'absolute', touchAction: 'none' }}>
        <color attach="background" args={['#2b2727']} />
        <PresentationControls global rotation={[0, Math.PI / 4, 0]} polar={[-0.3, 0.3]} speed={1.5} zoom={0.6}  >
          <Stage environment="studio" intensity={0.1} shadows={false}>
            <Model scale={0.005} />
          </Stage>
        </PresentationControls>
      </Canvas>
    </>
  )
}