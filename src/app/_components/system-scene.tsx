"use client";

import { Grid, Html, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

type Station = {
  id: string;
  label: string;
  index: string;
  detail: string;
  position: [number, number, number];
  kind: "servers" | "timeline" | "robot" | "door" | "dish" | "workstation";
};

const stations: Station[] = [
  { id: "works", label: "WORKS", index: "01", detail: "03 SYSTEMS", position: [-5.4, 0, -2.8], kind: "servers" },
  { id: "experience", label: "EXPERIENCE", index: "02", detail: "TIMELINE", position: [5.4, 0, -2.7], kind: "timeline" },
  { id: "skills", label: "SKILLS", index: "03", detail: "TOOLCHAIN", position: [-4.8, 0, 3.3], kind: "robot" },
  { id: "about", label: "ABOUT", index: "04", detail: "IDENTITY", position: [4.8, 0, 3.2], kind: "door" },
  { id: "contact", label: "CONTACT", index: "05", detail: "SIGNAL", position: [0.4, 0, -5.3], kind: "dish" },
  { id: "cory-os", label: "CORY OS", index: "06", detail: "WORKSPACE", position: [0, 0, 5.1], kind: "workstation" },
];

const teal = "#64f4df";
const darkMetal = "#071012";

export function SystemScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas dpr={[1, 1.75]} shadows gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }} camera={{ position: [10, 11, 13], fov: 42, near: 0.1, far: 80 }}>
        <color attach="background" args={["#030506"]} />
        <fog attach="fog" args={["#030506", 14, 30]} />
        <ambientLight intensity={0.7} color="#8db8b2" />
        <directionalLight position={[4, 12, 5]} intensity={2.2} color="#d8fffa" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[0, 3, 0]} intensity={38} distance={11} color={teal} />
        <ResponsiveCamera />
        <World />
        <OrbitControls makeDefault enableDamping enableZoom enablePan={false} minDistance={14} maxDistance={23} minPolarAngle={Math.PI / 4.6} maxPolarAngle={Math.PI / 2.8} minAzimuthAngle={-Math.PI / 4} maxAzimuthAngle={Math.PI / 4} target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const isPortrait = size.width < 700;
    const isCompact = size.width < 1100;

    perspectiveCamera.position.set(
      isPortrait ? 15 : isCompact ? 12 : 10,
      isPortrait ? 17 : isCompact ? 14 : 11,
      isPortrait ? 19 : isCompact ? 16 : 13,
    );
  }, [camera, size.width]);

  return null;
}

function World() {
  return (
    <group position={[0, -0.7, 0]}>
      <Grid args={[34, 34]} cellSize={0.75} cellThickness={0.55} cellColor="#183035" sectionSize={3} sectionThickness={0.8} sectionColor="#28515a" fadeDistance={25} fadeStrength={1.8} infiniteGrid />
      <CircuitPaths />
      <Core />
      {stations.map((station) => <StationNode key={station.id} station={station} />)}
    </group>
  );
}

function CircuitPaths() {
  return (
    <group position={[0, 0.025, 0]}>
      {stations.map((station) => {
        const [x, , z] = station.position;
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(x * 0.58, 0, 0),
          new THREE.Vector3(x, 0, z),
        ]);
        const path = new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color: teal, transparent: true, opacity: 0.72 }),
        );
        return (
          <group key={station.id}>
            <primitive object={path} />
            <mesh position={[x * 0.58, 0.02, 0]}><cylinderGeometry args={[0.055, 0.055, 0.035, 16]} /><meshBasicMaterial color={teal} /></mesh>
          </group>
        );
      })}
    </group>
  );
}

function Core() {
  return (
    <group position={[0, 0.28, 0]}>
      <mesh castShadow receiveShadow><cylinderGeometry args={[1.05, 1.25, 0.42, 8]} /><meshStandardMaterial color="#091517" metalness={0.75} roughness={0.22} /></mesh>
      <mesh position={[0, 0.24, 0]}><boxGeometry args={[1.25, 0.22, 1.25]} /><meshStandardMaterial color="#bafff5" emissive={teal} emissiveIntensity={3.2} toneMapped={false} /></mesh>
      <mesh position={[0, 0.37, 0]}><boxGeometry args={[0.84, 0.12, 0.84]} /><meshStandardMaterial color="#effffc" emissive={teal} emissiveIntensity={1.5} toneMapped={false} /></mesh>
      <SceneLabel position={[0, 1.05, 0]} label="CORE" detail="CENTRAL" />
    </group>
  );
}

function StationNode({ station }: { station: Station }) {
  return (
    <group position={station.position}>
      <mesh position={[0, 0.07, 0]} receiveShadow><cylinderGeometry args={[1.12, 1.25, 0.14, 8]} /><meshStandardMaterial color={darkMetal} metalness={0.75} roughness={0.38} /></mesh>
      <StationModel kind={station.kind} />
      <Html center position={[0, 1.85, 0]} distanceFactor={12} className="pointer-events-none select-none">
        <div className="min-w-28 whitespace-nowrap border-l border-teal-200/40 bg-[#030708]/80 px-3 py-2 font-mono uppercase backdrop-blur-sm">
          <div className="flex items-center justify-between gap-5"><span className="text-[10px] font-semibold tracking-[0.18em] text-teal-50">{station.label}</span><span className="text-[8px] tracking-[0.16em] text-teal-200/60">{station.index}</span></div>
          <p className="mt-1 text-[7px] tracking-[0.16em] text-zinc-500">{station.detail}</p>
        </div>
      </Html>
    </group>
  );
}

function SceneLabel({ position, label, detail }: { position: [number, number, number]; label: string; detail: string }) {
  return <Html center position={position} distanceFactor={11} className="pointer-events-none select-none"><div className="whitespace-nowrap text-center font-mono uppercase"><p className="text-[8px] tracking-[0.28em] text-teal-200/60">{detail}</p><p className="mt-1 text-sm font-semibold tracking-[0.2em] text-teal-50">{label}</p></div></Html>;
}

function StationModel({ kind }: { kind: Station["kind"] }) {
  if (kind === "servers") return <group>{[-0.48, 0, 0.48].map((x, index) => <Server key={x} position={[x, 0.8 + index * 0.08, 0]} height={1.4 + index * 0.16} />)}</group>;
  if (kind === "timeline") return <group position={[0, 0.8, 0]}><mesh castShadow><boxGeometry args={[1.35, 1.15, 0.15]} /><Metal /></mesh>{[-0.35, 0, 0.35].map((y) => <mesh key={y} position={[0, y, 0.1]}><boxGeometry args={[0.9, 0.025, 0.025]} /><meshBasicMaterial color={teal} /></mesh>)}</group>;
  if (kind === "robot") return <group position={[0, 0.25, 0]}><mesh castShadow><cylinderGeometry args={[0.48, 0.62, 0.28, 16]} /><Metal /></mesh><mesh position={[0, 0.52, 0]} rotation={[0, 0, -0.45]} castShadow><boxGeometry args={[0.22, 0.9, 0.25]} /><Metal light /></mesh><mesh position={[0.32, 0.92, 0]} rotation={[0, 0, 0.8]} castShadow><boxGeometry args={[0.2, 0.72, 0.22]} /><Metal light /></mesh><mesh position={[0.58, 1.17, 0]}><boxGeometry args={[0.28, 0.28, 0.28]} /><meshStandardMaterial color={teal} emissive={teal} emissiveIntensity={2} /></mesh></group>;
  if (kind === "door") return <group position={[0, 0.85, 0]}><mesh castShadow><boxGeometry args={[1.3, 1.65, 0.28]} /><Metal /></mesh><mesh position={[0, 0, 0.17]}><boxGeometry args={[0.72, 1.15, 0.05]} /><meshStandardMaterial color="#102124" emissive="#123b3c" emissiveIntensity={0.7} /></mesh><mesh position={[0.27, 0, 0.22]}><sphereGeometry args={[0.055, 12, 12]} /><meshBasicMaterial color={teal} /></mesh></group>;
  if (kind === "dish") return <group position={[0, 0.45, 0]}><mesh castShadow><cylinderGeometry args={[0.48, 0.68, 0.6, 16]} /><Metal /></mesh><mesh position={[0, 0.72, 0]} rotation={[0.2, 0, 0.35]} castShadow><sphereGeometry args={[0.68, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#16292c" side={THREE.DoubleSide} metalness={0.7} /></mesh><mesh position={[0.24, 0.98, 0]}><sphereGeometry args={[0.11, 12, 12]} /><meshBasicMaterial color={teal} /></mesh></group>;
  return <group position={[0, 0.72, 0]}><mesh castShadow><boxGeometry args={[1.45, 1, 0.15]} /><Metal /></mesh><mesh position={[0, 0, 0.09]}><planeGeometry args={[1.12, 0.68]} /><meshStandardMaterial color="#0b282b" emissive="#0d6260" emissiveIntensity={0.75} /></mesh><mesh position={[0, -0.68, 0]} castShadow><boxGeometry args={[0.14, 0.38, 0.14]} /><Metal light /></mesh><mesh position={[0, -0.9, 0]}><boxGeometry args={[0.75, 0.08, 0.32]} /><Metal light /></mesh></group>;
}

function Metal({ light = false }: { light?: boolean }) {
  return <meshStandardMaterial color={light ? "#22373a" : darkMetal} metalness={0.78} roughness={0.3} />;
}

function Server({ position, height }: { position: [number, number, number]; height: number }) {
  return <group position={position}><mesh castShadow><boxGeometry args={[0.38, height, 0.58]} /><Metal /></mesh>{[0.2, 0, -0.2].map((y) => <mesh key={y} position={[0, y, 0.3]}><boxGeometry args={[0.24, 0.035, 0.02]} /><meshBasicMaterial color={y === 0.2 ? teal : "#294548"} /></mesh>)}</group>;
}
