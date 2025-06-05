
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, OrbitControls, Line } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const FlowNode = ({ position, color, label, active }: { 
  position: [number, number, number], 
  color: string, 
  label: string, 
  active: boolean 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current && active) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.1);
    }
  });

  return (
    <group position={position}>
      <Box ref={meshRef} args={[1.5, 1.5, 1.5]}>
        <meshStandardMaterial color={active ? color : '#333333'} />
      </Box>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

const ConnectionLine = ({ start, end, active }: { 
  start: [number, number, number], 
  end: [number, number, number], 
  active: boolean 
}) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  
  return (
    <Line
      points={points}
      color={active ? '#00ff00' : '#666666'}
      lineWidth={3}
    />
  );
};

export const RecruitmentFlow3D = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { position: [-6, 2, 0] as [number, number, number], label: "Company Profile", color: "#ff6b6b" },
    { position: [-2, 2, 0] as [number, number, number], label: "Job Creation", color: "#4ecdc4" },
    { position: [2, 2, 0] as [number, number, number], label: "Applications", color: "#45b7d1" },
    { position: [6, 2, 0] as [number, number, number], label: "AI Analysis", color: "#96ceb4" },
    { position: [-4, -2, 0] as [number, number, number], label: "Shortlisting", color: "#ffeaa7" },
    { position: [0, -2, 0] as [number, number, number], label: "Interviews", color: "#dda0dd" },
    { position: [4, -2, 0] as [number, number, number], label: "Final Decision", color: "#98d8c8" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full h-96 bg-black rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {steps.map((step, index) => (
          <FlowNode
            key={index}
            position={step.position}
            color={step.color}
            label={step.label}
            active={index === activeStep}
          />
        ))}
        
        {/* Connection lines */}
        <ConnectionLine start={[-6, 2, 0]} end={[-2, 2, 0]} active={activeStep >= 1} />
        <ConnectionLine start={[-2, 2, 0]} end={[2, 2, 0]} active={activeStep >= 2} />
        <ConnectionLine start={[2, 2, 0]} end={[6, 2, 0]} active={activeStep >= 3} />
        <ConnectionLine start={[6, 2, 0]} end={[4, -2, 0]} active={activeStep >= 6} />
        <ConnectionLine start={[4, -2, 0]} end={[0, -2, 0]} active={activeStep >= 5} />
        <ConnectionLine start={[0, -2, 0]} end={[-4, -2, 0]} active={activeStep >= 4} />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
};
