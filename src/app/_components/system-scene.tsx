"use client";

import { Grid, Html, OrbitControls, useCursor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

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
const darkMetal = "#0c1719";

export function SystemScene() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 1.75]}
        shadows
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.35 }}
        camera={{ position: [10, 11, 13], fov: 42, near: 0.1, far: 80 }}
        onPointerMissed={() => setSelected(null)}
      >
        <color attach="background" args={["#030708"]} />
        <fog attach="fog" args={["#030708", 17, 34]} />
        <ambientLight intensity={1.45} color="#b8d8d3" />
        <hemisphereLight intensity={1.1} color="#dffcf7" groundColor="#071114" />
        <directionalLight position={[3, 11, 6]} intensity={3.4} color="#edfffc" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[0, 3, 0]} intensity={55} distance={13} color={teal} />
        <SceneControls selected={selected} />
        <World hovered={hovered} selected={selected} onHover={setHovered} onSelect={setSelected} />
      </Canvas>
    </div>
  );
}

function SceneControls({ selected }: { selected: string | null }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();
  const defaultPosition = useMemo(() => {
    if (size.width < 700) return new THREE.Vector3(15, 17, 19);
    if (size.width < 1100) return new THREE.Vector3(12, 14, 16);
    return new THREE.Vector3(10, 11, 13);
  }, [size.width]);

  useEffect(() => {
    if (!selected) camera.position.copy(defaultPosition);
  }, [camera, defaultPosition, selected]);

  useFrame(() => {
    const station = stations.find((item) => item.id === selected);
    const target = station ? new THREE.Vector3(...station.position) : new THREE.Vector3();
    const desiredPosition = station
      ? target.clone().add(new THREE.Vector3(5.5, 5.2, 6.5))
      : defaultPosition;

    if (station) camera.position.lerp(desiredPosition, 0.045);
    if (controls.current) {
      controls.current.target.lerp(target, 0.06);
      controls.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      enableZoom
      enablePan={false}
      minDistance={10}
      maxDistance={24}
      minPolarAngle={Math.PI / 4.8}
      maxPolarAngle={Math.PI / 2.75}
      minAzimuthAngle={-Math.PI / 3}
      maxAzimuthAngle={Math.PI / 3}
    />
  );
}

function World({ hovered, selected, onHover, onSelect }: { hovered: string | null; selected: string | null; onHover: (id: string | null) => void; onSelect: (id: string) => void }) {
  const activeId = hovered ?? selected;
  return (
    <group position={[0, -0.7, 0]}>
      <Grid args={[38, 38]} cellSize={0.75} cellThickness={0.65} cellColor="#224047" sectionSize={3} sectionThickness={1} sectionColor="#39717a" fadeDistance={29} fadeStrength={1.5} infiniteGrid />
      <CircuitPaths activeId={activeId} />
      <Core />
      {stations.map((station) => (
        <StationNode key={station.id} station={station} active={activeId === station.id} hovered={hovered === station.id} dimmed={Boolean(activeId && activeId !== station.id)} onHover={onHover} onSelect={onSelect} />
      ))}
    </group>
  );
}

function CircuitPaths({ activeId }: { activeId: string | null }) {
  return (
    <group position={[0, 0.035, 0]}>
      {stations.map((station, index) => <CircuitPath key={station.id} station={station} index={index} active={activeId === station.id} dimmed={Boolean(activeId && activeId !== station.id)} />)}
    </group>
  );
}

function CircuitPath({ station, index, active, dimmed }: { station: Station; index: number; active: boolean; dimmed: boolean }) {
  const pulse = useRef<THREE.Mesh>(null);
  const [x, , z] = station.position;
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(x * 0.58, 0, 0),
    new THREE.Vector3(x, 0, z),
  ], false, "catmullrom", 0), [x, z]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)), [curve]);

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    pulse.current.position.copy(curve.getPoint((clock.elapsedTime * 0.12 + index * 0.16) % 1));
  });

  return (
    <group>
      <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: active ? "#c9fff8" : teal, transparent: true, opacity: dimmed ? 0.12 : active ? 1 : 0.48 }))} />
      <mesh ref={pulse}><sphereGeometry args={[active ? 0.09 : 0.055, 12, 12]} /><meshBasicMaterial color={active ? "#ffffff" : teal} transparent opacity={dimmed ? 0.08 : 0.9} toneMapped={false} /></mesh>
      <mesh position={[x * 0.58, 0.02, 0]}><cylinderGeometry args={[0.06, 0.06, 0.035, 16]} /><meshBasicMaterial color={teal} transparent opacity={dimmed ? 0.15 : 0.9} /></mesh>
    </group>
  );
}

function Core() {
  const glow = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (glow.current) glow.current.emissiveIntensity = 2.8 + Math.sin(clock.elapsedTime * 1.8) * 0.65;
  });
  return (
    <group position={[0, 0.28, 0]}>
      <mesh castShadow receiveShadow><cylinderGeometry args={[1.05, 1.25, 0.42, 8]} /><meshStandardMaterial color="#102124" metalness={0.68} roughness={0.24} /></mesh>
      <mesh position={[0, 0.24, 0]}><boxGeometry args={[1.25, 0.22, 1.25]} /><meshStandardMaterial ref={glow} color="#bafff5" emissive={teal} emissiveIntensity={3.2} toneMapped={false} /></mesh>
      <mesh position={[0, 0.37, 0]}><boxGeometry args={[0.84, 0.12, 0.84]} /><meshStandardMaterial color="#effffc" emissive={teal} emissiveIntensity={1.8} toneMapped={false} /></mesh>
      <SceneLabel position={[0, 1.05, 0]} label="CORE" detail="CENTRAL" />
    </group>
  );
}

function StationNode({ station, active, hovered, dimmed, onHover, onSelect }: { station: Station; active: boolean; hovered: boolean; dimmed: boolean; onHover: (id: string | null) => void; onSelect: (id: string) => void }) {
  const group = useRef<THREE.Group>(null);
  useCursor(hovered);
  useFrame(() => {
    if (!group.current) return;
    const targetScale = active ? 1.1 : 1;
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
  });
  const stop = (event: { stopPropagation: () => void }) => event.stopPropagation();
  return (
    <group
      ref={group}
      position={station.position}
      onPointerEnter={(event) => { stop(event); onHover(station.id); }}
      onPointerLeave={(event) => { stop(event); onHover(null); }}
      onClick={(event) => { stop(event); onSelect(station.id); }}
    >
      <mesh position={[0, 0.07, 0]} receiveShadow><cylinderGeometry args={[1.12, 1.25, 0.14, 8]} /><meshStandardMaterial color={active ? "#173033" : darkMetal} emissive={teal} emissiveIntensity={active ? 0.5 : 0.04} metalness={0.72} roughness={0.34} transparent opacity={dimmed ? 0.42 : 1} /></mesh>
      <StationModel kind={station.kind} active={active} dimmed={dimmed} />
      <Html center position={[0, 1.85, 0]} distanceFactor={12} className="pointer-events-none select-none">
        <div className={`min-w-28 whitespace-nowrap border-l px-3 py-2 font-mono uppercase backdrop-blur-sm transition-all duration-300 ${active ? "border-teal-100 bg-[#092022]/95 shadow-[0_0_24px_rgba(94,234,212,0.22)]" : dimmed ? "border-teal-200/10 bg-[#030708]/55 opacity-35" : "border-teal-200/45 bg-[#030708]/85"}`}>
          <div className="flex items-center justify-between gap-5"><span className="text-[10px] font-semibold tracking-[0.18em] text-teal-50">{station.label}</span><span className="text-[8px] tracking-[0.16em] text-teal-200/70">{station.index}</span></div>
          <p className="mt-1 text-[7px] tracking-[0.16em] text-zinc-400">{station.detail}</p>
        </div>
      </Html>
    </group>
  );
}

function SceneLabel({ position, label, detail }: { position: [number, number, number]; label: string; detail: string }) {
  return <Html center position={position} distanceFactor={11} className="pointer-events-none select-none"><div className="whitespace-nowrap text-center font-mono uppercase"><p className="text-[8px] tracking-[0.28em] text-teal-200/75">{detail}</p><p className="mt-1 text-sm font-semibold tracking-[0.2em] text-teal-50">{label}</p></div></Html>;
}

function StationModel({ kind, active, dimmed }: { kind: Station["kind"]; active: boolean; dimmed: boolean }) {
  const animated = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!animated.current) return;
    animated.current.position.y = Math.sin(clock.elapsedTime * 0.8 + kind.length) * 0.035;
    if (kind === "dish") animated.current.rotation.y += 0.0025;
  });
  const opacity = dimmed ? 0.42 : 1;
  const glow = active ? 1.7 : 0.55;
  return (
    <group ref={animated}>
      {kind === "servers" && <group>{[-0.48, 0, 0.48].map((x, index) => <Server key={x} position={[x, 0.8 + index * 0.08, 0]} height={1.4 + index * 0.16} active={active} opacity={opacity} />)}</group>}
      {kind === "timeline" && <group position={[0, 0.8, 0]}><mesh castShadow><boxGeometry args={[1.35, 1.15, 0.15]} /><Metal opacity={opacity} /></mesh>{[-0.35, 0, 0.35].map((y) => <mesh key={y} position={[0, y, 0.1]}><boxGeometry args={[0.9, 0.035, 0.025]} /><meshStandardMaterial color={teal} emissive={teal} emissiveIntensity={glow} transparent opacity={opacity} /></mesh>)}</group>}
      {kind === "robot" && <group position={[0, 0.25, 0]}><mesh castShadow><cylinderGeometry args={[0.48, 0.62, 0.28, 16]} /><Metal opacity={opacity} /></mesh><mesh position={[0, 0.52, 0]} rotation={[0, 0, -0.45]} castShadow><boxGeometry args={[0.22, 0.9, 0.25]} /><Metal light opacity={opacity} /></mesh><mesh position={[0.32, 0.92, 0]} rotation={[0, 0, 0.8]} castShadow><boxGeometry args={[0.2, 0.72, 0.22]} /><Metal light opacity={opacity} /></mesh><mesh position={[0.58, 1.17, 0]}><boxGeometry args={[0.28, 0.28, 0.28]} /><meshStandardMaterial color={teal} emissive={teal} emissiveIntensity={glow} transparent opacity={opacity} /></mesh></group>}
      {kind === "door" && <group position={[0, 0.85, 0]}><mesh castShadow><boxGeometry args={[1.3, 1.65, 0.28]} /><Metal opacity={opacity} /></mesh><mesh position={[0, 0, 0.17]}><boxGeometry args={[0.72, 1.15, 0.05]} /><meshStandardMaterial color="#174044" emissive={teal} emissiveIntensity={active ? 0.65 : 0.18} transparent opacity={opacity} /></mesh><mesh position={[0.27, 0, 0.22]}><sphereGeometry args={[0.065, 12, 12]} /><meshBasicMaterial color={teal} /></mesh></group>}
      {kind === "dish" && <group position={[0, 0.45, 0]}><mesh castShadow><cylinderGeometry args={[0.48, 0.68, 0.6, 16]} /><Metal opacity={opacity} /></mesh><mesh position={[0, 0.72, 0]} rotation={[0.2, 0, 0.35]} castShadow><sphereGeometry args={[0.68, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#28484c" side={THREE.DoubleSide} metalness={0.65} emissive={teal} emissiveIntensity={active ? 0.35 : 0.05} transparent opacity={opacity} /></mesh><mesh position={[0.24, 0.98, 0]}><sphereGeometry args={[0.11, 12, 12]} /><meshBasicMaterial color={teal} /></mesh></group>}
      {kind === "workstation" && <group position={[0, 0.72, 0]}><mesh castShadow><boxGeometry args={[1.45, 1, 0.15]} /><Metal opacity={opacity} /></mesh><mesh position={[0, 0, 0.09]}><planeGeometry args={[1.12, 0.68]} /><meshStandardMaterial color="#15545a" emissive={teal} emissiveIntensity={glow} transparent opacity={opacity} /></mesh><mesh position={[0, -0.68, 0]} castShadow><boxGeometry args={[0.14, 0.38, 0.14]} /><Metal light opacity={opacity} /></mesh><mesh position={[0, -0.9, 0]}><boxGeometry args={[0.75, 0.08, 0.32]} /><Metal light opacity={opacity} /></mesh></group>}
    </group>
  );
}

function Metal({ light = false, opacity = 1 }: { light?: boolean; opacity?: number }) {
  return <meshStandardMaterial color={light ? "#365256" : darkMetal} emissive={light ? "#173c3e" : "#071718"} emissiveIntensity={0.2} metalness={0.68} roughness={0.3} transparent opacity={opacity} />;
}

function Server({ position, height, active, opacity }: { position: [number, number, number]; height: number; active: boolean; opacity: number }) {
  return <group position={position}><mesh castShadow><boxGeometry args={[0.38, height, 0.58]} /><Metal opacity={opacity} /></mesh>{[0.2, 0, -0.2].map((y) => <mesh key={y} position={[0, y, 0.3]}><boxGeometry args={[0.24, 0.04, 0.02]} /><meshStandardMaterial color={y === 0.2 ? teal : "#4b6f73"} emissive={teal} emissiveIntensity={active && y === 0.2 ? 1.7 : 0.3} transparent opacity={opacity} /></mesh>)}</group>;
}
