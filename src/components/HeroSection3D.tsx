
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

const ResponsiveParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Create particle system
  const particleCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const originalPositions = useMemo(() => positions.slice(), [positions]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Calculate distance from mouse
        const mouseX = mousePosition.x * viewport.width / 2;
        const mouseY = mousePosition.y * viewport.height / 2;
        const particleX = originalPositions[i3];
        const particleY = originalPositions[i3 + 1];
        
        const distance = Math.sqrt(
          Math.pow(particleX - mouseX, 2) + 
          Math.pow(particleY - mouseY, 2)
        );
        
        // Spread effect based on mouse proximity
        const spreadRadius = 3;
        const maxDistance = 5;
        
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
          
          positions[i3] = originalPositions[i3] + Math.cos(angle) * force * spreadRadius;
          positions[i3 + 1] = originalPositions[i3 + 1] + Math.sin(angle) * force * spreadRadius;
        } else {
          // Return to original position gradually
          positions[i3] += (originalPositions[i3] - positions[i3]) * 0.02;
          positions[i3 + 1] += (originalPositions[i3 + 1] - positions[i3 + 1]) * 0.02;
        }
        
        // Gentle floating animation
        positions[i3 + 2] = originalPositions[i3 + 2] + Math.sin(state.clock.elapsedTime + i * 0.1) * 0.5;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#666666"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

const FloatingSphere = ({ position, color, speed }: { 
  position: [number, number, number], 
  color: string,
  speed: number 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.3;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 2) * 0.5;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshPhongMaterial 
        color={color} 
        transparent 
        opacity={0.7}
        shininess={100}
      />
    </mesh>
  );
};

const GeometricShapes = () => {
  const shapes = [
    { position: [-6, 2, -3] as [number, number, number], color: "#1a1a1a", speed: 0.8 },
    { position: [6, -1, -2] as [number, number, number], color: "#2a2a2a", speed: 1.2 },
    { position: [-3, -3, 1] as [number, number, number], color: "#3a3a3a", speed: 0.6 },
    { position: [4, 3, 2] as [number, number, number], color: "#1a1a1a", speed: 1.0 },
    { position: [0, 4, -1] as [number, number, number], color: "#2a2a2a", speed: 0.9 },
  ];

  return (
    <>
      {shapes.map((shape, index) => (
        <FloatingSphere
          key={index}
          position={shape.position}
          color={shape.color}
          speed={shape.speed}
        />
      ))}
    </>
  );
};

const WaveRings = () => {
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z = state.clock.elapsedTime * 0.2;
      ringsRef.current.children.forEach((ring, index) => {
        const mesh = ring as THREE.Mesh;
        mesh.rotation.x = state.clock.elapsedTime * (0.3 + index * 0.1);
        mesh.scale.setScalar(1 + Math.sin(state.clock.elapsedTime + index) * 0.1);
      });
    }
  });

  return (
    <group ref={ringsRef}>
      {[1, 2, 3].map((ring, index) => (
        <mesh key={index} position={[0, 0, index - 1]}>
          <torusGeometry args={[3 + index, 0.1, 8, 24]} />
          <meshBasicMaterial 
            color="#404040" 
            transparent 
            opacity={0.3 - index * 0.1}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
};

export const HeroSection3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 75 }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.setClearColor('#ffffff', 0);
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#444444" />
        <spotLight position={[0, 10, 5]} intensity={0.5} penumbra={1} />
        
        <ResponsiveParticles />
        <GeometricShapes />
        <WaveRings />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true} 
          autoRotate 
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};
