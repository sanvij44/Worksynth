import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Environment, Float, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'

function OrbCore() {
  const meshRef = useRef()
  const innerRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = t * 0.15
    meshRef.current.rotation.y = t * 0.2
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.3
      innerRef.current.rotation.z = t * 0.25
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      {/* Outer distorted sphere */}
      <Sphere ref={meshRef} args={[1.5, 128, 128]}>
        <MeshDistortMaterial
          color="#6366F1"
          distort={0.38}
          speed={2.5}
          roughness={0.08}
          metalness={0.85}
          envMapIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Inner glowing sphere */}
      <Sphere ref={innerRef} args={[0.9, 64, 64]}>
        <MeshDistortMaterial
          color="#8B5CF6"
          distort={0.55}
          speed={3}
          roughness={0}
          metalness={1}
          envMapIntensity={2}
          transparent
          opacity={0.7}
        />
      </Sphere>

      {/* Core bright sphere */}
      <Sphere args={[0.45, 32, 32]}>
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={1.5}
          roughness={0}
          metalness={0.5}
        />
      </Sphere>
    </Float>
  )
}

function OrbScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#8B5CF6" intensity={3} />
      <pointLight position={[-5, -5, -3]} color="#06B6D4" intensity={2} />
      <pointLight position={[0, 8, 0]} color="#6366F1" intensity={1.5} />
      <Stars radius={80} depth={40} count={800} factor={3} saturation={0.5} fade speed={0.5} />
      <OrbCore />
      <Environment preset="night" />
    </>
  )
}

function OrbFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* CSS fallback orb */}
      <div className="relative w-52 h-52 animate-float">
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(99,102,241,0.85) 0%, rgba(139,92,246,0.65) 45%, rgba(6,182,212,0.35) 80%, transparent 100%)',
          filter: 'blur(6px)'
        }} />
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.03) 60%, transparent 100%)',
          border: '1px solid rgba(255,255,255,0.15)'
        }} />
        <div className="absolute inset-8 rounded-full flex items-center justify-center" style={{
          background: 'radial-gradient(circle at 40% 35%, #6366F1, #8B5CF6, #06B6D4)'
        }}>
          <span className="text-white text-5xl" style={{ textShadow: '0 0 30px rgba(255,255,255,0.8)' }}>✦</span>
        </div>
        <div className="absolute top-6 left-8 w-12 h-8 rounded-full opacity-30" style={{ background: 'white', filter: 'blur(8px)' }} />
      </div>
    </div>
  )
}

export default function AIOrb() {
  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
    >
      <Suspense fallback={<OrbFallback />}>
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <OrbScene />
        </Canvas>
      </Suspense>
    </motion.div>
  )
}
