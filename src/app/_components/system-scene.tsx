"use client";

import { Grid, Html, OrbitControls, useCursor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { selectedProjects } from "../_data/projects";

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
const darkMetal = "#193236";

export function SystemScene() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [aboutExpanded, setAboutExpanded] = useState(false);

  const selectStation = (id: string | null) => {
    if (id === "about" && selected === "about") {
      setAboutExpanded((expanded) => !expanded);
      return;
    }
    setSelected(id);
    setAboutExpanded(false);
  };

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.7 }}
        camera={{ position: [8.4, 9.4, 10.8], fov: 42, near: 0.1, far: 80 }}
        onPointerMissed={() => selectStation(null)}
      >
        <color attach="background" args={["#030708"]} />
        <fog attach="fog" args={["#030708", 17, 34]} />
        <ambientLight intensity={2} color="#d2e7e3" />
        <hemisphereLight intensity={1.5} color="#f3fffd" groundColor="#10282b" />
        <directionalLight position={[3, 11, 6]} intensity={4.5} color="#f5fffe" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[0, 3, 0]} intensity={68} distance={14} color={teal} />
        <SceneControls selected={selected} />
        <World hovered={hovered} selected={selected} aboutExpanded={aboutExpanded} onHover={setHovered} onSelect={selectStation} onToggleAbout={() => setAboutExpanded((expanded) => !expanded)} />
      </Canvas>
    </div>
  );
}

function SceneControls({ selected }: { selected: string | null }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();
  const defaultPosition = useMemo(() => {
    if (size.width < 700) return new THREE.Vector3(15, 17, 19);
    if (size.width < 1100) return new THREE.Vector3(11.5, 13.5, 15.5);
    return new THREE.Vector3(8.4, 9.4, 10.8);
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

function World({ hovered, selected, aboutExpanded, onHover, onSelect, onToggleAbout }: { hovered: string | null; selected: string | null; aboutExpanded: boolean; onHover: (id: string | null) => void; onSelect: (id: string | null) => void; onToggleAbout: () => void }) {
  const activeId = hovered ?? selected;
  return (
    <group position={[0, -0.7, 0]}>
      <Grid args={[38, 38]} cellSize={0.75} cellThickness={0.7} cellColor="#294c52" sectionSize={3} sectionThickness={1.05} sectionColor="#47848c" fadeDistance={29} fadeStrength={1.45} infiniteGrid />
      <CircuitPaths activeId={activeId} />
      <Core showLabel={!selected} />
      {stations.map((station) => (
        <StationNode key={station.id} station={station} active={activeId === station.id} selected={selected === station.id} aboutExpanded={aboutExpanded} hovered={hovered === station.id} dimmed={Boolean(activeId && activeId !== station.id)} onHover={onHover} onSelect={onSelect} onToggleAbout={onToggleAbout} />
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

function Core({ showLabel }: { showLabel: boolean }) {
  const glow = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (glow.current) glow.current.emissiveIntensity = 2.8 + Math.sin(clock.elapsedTime * 1.8) * 0.65;
  });
  return (
    <group position={[0, 0.28, 0]}>
      <mesh castShadow receiveShadow><cylinderGeometry args={[1.05, 1.25, 0.42, 8]} /><meshStandardMaterial color="#183033" metalness={0.64} roughness={0.26} /></mesh>
      <mesh position={[0, 0.24, 0]}><boxGeometry args={[1.25, 0.22, 1.25]} /><meshStandardMaterial ref={glow} color="#bafff5" emissive={teal} emissiveIntensity={3.2} toneMapped={false} /></mesh>
      <mesh position={[0, 0.37, 0]}><boxGeometry args={[0.84, 0.12, 0.84]} /><meshStandardMaterial color="#effffc" emissive={teal} emissiveIntensity={1.8} toneMapped={false} /></mesh>
      {showLabel && <SceneLabel position={[0, 1.05, 0]} label="CORE" detail="CENTRAL" />}
    </group>
  );
}

function StationNode({ station, active, selected, aboutExpanded, hovered, dimmed, onHover, onSelect, onToggleAbout }: { station: Station; active: boolean; selected: boolean; aboutExpanded: boolean; hovered: boolean; dimmed: boolean; onHover: (id: string | null) => void; onSelect: (id: string | null) => void; onToggleAbout: () => void }) {
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
      {!selected && (
        <Html center position={[0, 1.85, 0]} distanceFactor={15} className="pointer-events-none select-none">
          <div className={`min-w-32 whitespace-nowrap border-l px-3.5 py-2.5 font-mono uppercase backdrop-blur-sm transition-all duration-300 ${active ? "border-teal-100 bg-[#092022]/95 shadow-[0_0_24px_rgba(94,234,212,0.22)]" : dimmed ? "border-teal-200/10 bg-[#030708]/55 opacity-35" : "border-teal-200/45 bg-[#030708]/85"}`}>
            <div className="flex items-center justify-between gap-5"><span className="text-xs font-semibold tracking-[0.16em] text-teal-50">{station.label}</span><span className="text-[9px] tracking-[0.14em] text-teal-200/70">{station.index}</span></div>
            <p className="mt-1.5 text-[9px] tracking-[0.14em] text-zinc-400">{station.detail}</p>
          </div>
        </Html>
      )}
      {station.id === "works" && selected && <WorksProjectPanel />}
      {station.id === "about" && selected && <AboutPanel expanded={aboutExpanded} onToggle={onToggleAbout} onClose={() => onSelect(null)} />}
    </group>
  );
}

function AboutPanel({ expanded, onToggle, onClose }: { expanded: boolean; onToggle: () => void; onClose: () => void }) {
  return (
    <Html position={[-1.8, 1.35, 0]} center zIndexRange={[30, 20]}>
      <section
        className={`pointer-events-auto max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto border border-teal-100/30 bg-[#061012]/97 font-mono text-white shadow-[0_20px_80px_rgba(0,0,0,0.72),0_0_40px_rgba(94,234,212,0.12)] backdrop-blur-md transition-[width,padding] duration-300 ${expanded ? "w-[52rem] p-8" : "w-[40rem] p-6"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[8px] uppercase tracking-[0.22em] text-teal-200/60">Identity record // 04</p>
            <h3 className="mt-1.5 text-base font-semibold uppercase tracking-[0.16em] text-teal-50">Cory Kim</h3>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onToggle}
              aria-label={expanded ? "Reduce About panel" : "Expand About panel"}
              title={expanded ? "Reduce panel" : "Expand panel"}
              className="grid h-8 w-8 place-items-center border border-white/10 text-[11px] text-zinc-400 transition-colors hover:border-teal-100/40 hover:bg-teal-100/5 hover:text-teal-50"
            >
              {expanded ? "↙" : "↗"}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close About panel"
              title="Close panel"
              className="grid h-8 w-8 place-items-center border border-white/10 text-sm text-zinc-400 transition-colors hover:border-teal-100/40 hover:bg-teal-100/5 hover:text-teal-50"
            >
              ×
            </button>
          </div>
        </header>

        <div className={`mt-6 grid gap-6 ${expanded ? "sm:grid-cols-[16rem_1fr]" : "sm:grid-cols-[12rem_1fr]"}`}>
          <div>
            <div className="relative aspect-square overflow-hidden border border-teal-100/25 bg-teal-950/30">
              <Image
                src="/images/cory-profile.png"
                alt="Portrait of Cory Kim"
                fill
                sizes={expanded ? "224px" : "168px"}
                className="identity-portrait object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(10,255,224,0.28),transparent_46%,rgba(4,78,82,0.42))] mix-blend-color" />
              <div className="identity-scan pointer-events-none absolute inset-0 opacity-40" />
              <div className="identity-scan-beam pointer-events-none absolute inset-x-0 h-12" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-teal-200/70 shadow-[0_0_12px_rgba(94,234,212,0.9)]" />
              <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-teal-100/70" />
              <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-teal-100/70" />
            </div>
            <div className="mt-2 flex items-center justify-between text-[8px] uppercase tracking-[0.16em] text-zinc-500">
              <span>CK-001</span>
              <span className="text-emerald-300/70">Verified</span>
            </div>
          </div>

          <div className="min-w-0">
            <p className={`${expanded ? "text-base leading-7" : "text-sm leading-6"} text-zinc-200`}>
              Hi, I&apos;m Cory. I&apos;m a software developer in Vancouver who likes turning half-formed ideas into things people can actually use.
            </p>
            <p className={`${expanded ? "text-[13px] leading-6" : "text-[11px] leading-5"} mt-3 text-zinc-400`}>
              I&apos;m happiest somewhere between engineering and design: figuring out how a product should work, building the system behind it, and obsessing over the small interactions that make it feel right.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-px bg-white/10">
              <IdentityField label="Base" value="Vancouver, BC" />
              <IdentityField label="Role" value="Software Developer" />
              <IdentityField label="Focus" value="Product Systems" />
              <IdentityField label="Status" value="Available" accent />
            </div>
          </div>
        </div>

        {expanded && <PersonalLog />}

        <footer className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[8px] uppercase tracking-[0.14em] text-zinc-500">
          <span>Engineering × AI × Interaction</span>
          <a href="mailto:cdokyung@gmail.com" className="text-teal-200/70 transition-colors hover:text-teal-50">Start a conversation →</a>
        </footer>
      </section>
    </Html>
  );
}

function PersonalLog() {
  const entries = [
    {
      code: "01 / ORIGIN",
      text: "I got hooked on programming through the simple thrill of making an idea respond. That feedback loop still drives me.",
    },
    {
      code: "02 / PROCESS",
      text: "I learn by building. I would rather make a rough version, test it, and keep shaping it than wait for a perfect plan.",
    },
    {
      code: "03 / OFFLINE",
      text: "Away from the editor, I collect ideas from music, games, and the small interface details most people barely notice.",
    },
  ];

  return (
    <div className="mt-6 border border-teal-100/15 bg-black/20">
      <div className="flex items-center justify-between border-b border-teal-100/10 px-4 py-2.5">
        <p className="text-[8px] uppercase tracking-[0.2em] text-teal-200/65">Personal log // decrypted</p>
        <span className="flex items-center gap-2 text-[7px] uppercase tracking-[0.14em] text-zinc-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /> Live record
        </span>
      </div>
      <div className="grid sm:grid-cols-3">
        {entries.map((entry) => (
          <article key={entry.code} className="border-b border-teal-100/10 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
            <p className="text-[8px] uppercase tracking-[0.18em] text-teal-200/55">{entry.code}</p>
            <p className="mt-2 text-[11px] leading-5 text-zinc-400">{entry.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function IdentityField({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-[#071113] px-3 py-2.5">
      <p className="text-[8px] uppercase tracking-[0.16em] text-zinc-600">{label}</p>
      <p className={`mt-1 text-[10px] uppercase tracking-[0.08em] ${accent ? "text-emerald-300" : "text-zinc-300"}`}>{value}</p>
    </div>
  );
}

function WorksProjectPanel() {
  return (
    <Html position={[1.8, 1.15, 0]} center zIndexRange={[30, 20]}>
      <section
        className="pointer-events-auto max-h-[calc(100vh-2rem)] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto border border-teal-100/30 bg-[#061012]/95 p-5 font-mono text-white shadow-[0_18px_70px_rgba(0,0,0,0.65),0_0_35px_rgba(94,234,212,0.12)] backdrop-blur-md"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[8px] uppercase tracking-[0.2em] text-teal-200/60">Selected system</p>
            <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-teal-50">Works // 03</h3>
          </div>
          <span className="h-2 w-2 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(94,234,212,0.9)]" />
        </div>
        <div className="space-y-1">
          {selectedProjects.map((project) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between border border-transparent px-2 py-2.5 transition-colors hover:border-teal-100/20 hover:bg-teal-100/[0.06]"
            >
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-100">{project.name}</span>
                <span className="mt-1.5 block text-[8px] uppercase tracking-[0.1em] text-zinc-500">{project.eyebrow}</span>
              </span>
              <span className="text-[10px] text-teal-200/50 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-100">→</span>
            </a>
          ))}
        </div>
      </section>
    </Html>
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
      {kind === "servers" && <WorksStation active={active} opacity={opacity} />}
      {kind === "timeline" && <group position={[0, 0.8, 0]}><mesh castShadow><boxGeometry args={[1.35, 1.15, 0.15]} /><Metal opacity={opacity} /></mesh>{[-0.35, 0, 0.35].map((y) => <mesh key={y} position={[0, y, 0.1]}><boxGeometry args={[0.9, 0.035, 0.025]} /><meshStandardMaterial color={teal} emissive={teal} emissiveIntensity={glow} transparent opacity={opacity} /></mesh>)}</group>}
      {kind === "robot" && <group position={[0, 0.25, 0]}><mesh castShadow><cylinderGeometry args={[0.48, 0.62, 0.28, 16]} /><Metal opacity={opacity} /></mesh><mesh position={[0, 0.52, 0]} rotation={[0, 0, -0.45]} castShadow><boxGeometry args={[0.22, 0.9, 0.25]} /><Metal light opacity={opacity} /></mesh><mesh position={[0.32, 0.92, 0]} rotation={[0, 0, 0.8]} castShadow><boxGeometry args={[0.2, 0.72, 0.22]} /><Metal light opacity={opacity} /></mesh><mesh position={[0.58, 1.17, 0]}><boxGeometry args={[0.28, 0.28, 0.28]} /><meshStandardMaterial color={teal} emissive={teal} emissiveIntensity={glow} transparent opacity={opacity} /></mesh></group>}
      {kind === "door" && <AboutStation active={active} opacity={opacity} />}
      {kind === "dish" && <group position={[0, 0.45, 0]}><mesh castShadow><cylinderGeometry args={[0.48, 0.68, 0.6, 16]} /><Metal opacity={opacity} /></mesh><mesh position={[0, 0.72, 0]} rotation={[0.2, 0, 0.35]} castShadow><sphereGeometry args={[0.68, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#28484c" side={THREE.DoubleSide} metalness={0.65} emissive={teal} emissiveIntensity={active ? 0.35 : 0.05} transparent opacity={opacity} /></mesh><mesh position={[0.24, 0.98, 0]}><sphereGeometry args={[0.11, 12, 12]} /><meshBasicMaterial color={teal} /></mesh></group>}
      {kind === "workstation" && <group position={[0, 0.72, 0]}><mesh castShadow><boxGeometry args={[1.45, 1, 0.15]} /><Metal opacity={opacity} /></mesh><mesh position={[0, 0, 0.09]}><planeGeometry args={[1.12, 0.68]} /><meshStandardMaterial color="#15545a" emissive={teal} emissiveIntensity={glow} transparent opacity={opacity} /></mesh><mesh position={[0, -0.68, 0]} castShadow><boxGeometry args={[0.14, 0.38, 0.14]} /><Metal light opacity={opacity} /></mesh><mesh position={[0, -0.9, 0]}><boxGeometry args={[0.75, 0.08, 0.32]} /><Metal light opacity={opacity} /></mesh></group>}
    </group>
  );
}

function Metal({ light = false, opacity = 1 }: { light?: boolean; opacity?: number }) {
  return <meshStandardMaterial color={light ? "#52777b" : darkMetal} emissive={light ? "#205154" : "#10292c"} emissiveIntensity={0.28} metalness={0.6} roughness={0.34} transparent opacity={opacity} />;
}

function AboutStation({ active, opacity }: { active: boolean; opacity: number }) {
  const scanner = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (scanner.current) scanner.current.position.y = Math.sin(clock.elapsedTime * 1.4) * 0.48;
  });

  return (
    <group position={[0, 0.9, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.45, 1.78, 0.32]} />
        <Metal opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, 0.18]}>
        <boxGeometry args={[1.08, 1.42, 0.055]} />
        <meshStandardMaterial color="#123438" emissive={teal} emissiveIntensity={active ? 0.62 : 0.2} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.22, 0.22]}>
        <circleGeometry args={[0.27, 24]} />
        <meshStandardMaterial color="#77b8b1" emissive={teal} emissiveIntensity={active ? 0.8 : 0.25} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, -0.34, 0.22]}>
        <boxGeometry args={[0.62, 0.18, 0.025]} />
        <meshBasicMaterial color="#91c8c2" transparent opacity={0.72 * opacity} />
      </mesh>
      <mesh ref={scanner} position={[0, 0, 0.265]}>
        <boxGeometry args={[0.96, 0.025, 0.018]} />
        <meshBasicMaterial color="#d4fff9" transparent opacity={active ? 1 : 0.45} toneMapped={false} />
      </mesh>
      {[[-0.66, 0.8], [0.66, 0.8], [-0.66, -0.8], [0.66, -0.8]].map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.2]}>
          <boxGeometry args={[0.1, 0.1, 0.06]} />
          <meshBasicMaterial color={teal} transparent opacity={(active ? 1 : 0.48) * opacity} />
        </mesh>
      ))}
    </group>
  );
}

function WorksStation({ active, opacity }: { active: boolean; opacity: number }) {
  const rackPositions: Array<[number, number, number]> = [
    [-0.62, 0.85, -0.34],
    [0, 0.95, -0.42],
    [0.62, 0.85, -0.34],
    [-0.34, 0.76, 0.34],
    [0.34, 0.76, 0.34],
  ];

  return (
    <group>
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[1.95, 0.16, 1.48]} />
        <meshStandardMaterial color="#13272a" metalness={0.72} roughness={0.3} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.76, 0.04, 1.3]} />
        <meshStandardMaterial color="#17383b" emissive={teal} emissiveIntensity={active ? 0.42 : 0.1} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.31, 0.67]}>
        <boxGeometry args={[1.7, 0.045, 0.035]} />
        <meshBasicMaterial color={teal} transparent opacity={active ? 1 : 0.55 * opacity} toneMapped={false} />
      </mesh>
      {rackPositions.map((position, index) => (
        <ServerRack key={`${position[0]}-${position[2]}`} position={position} index={index} active={active} opacity={opacity} />
      ))}
      <mesh position={[-0.83, 0.55, 0.46]} castShadow>
        <boxGeometry args={[0.22, 0.5, 0.32]} />
        <Metal light opacity={opacity} />
      </mesh>
      <mesh position={[-0.83, 0.57, 0.63]}>
        <planeGeometry args={[0.13, 0.2]} />
        <meshStandardMaterial color="#7dfff0" emissive={teal} emissiveIntensity={active ? 2.2 : 0.8} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    </group>
  );
}

function ServerRack({ position, index, active, opacity }: { position: [number, number, number]; index: number; active: boolean; opacity: number }) {
  const height = index === 1 ? 1.45 : index < 3 ? 1.25 : 1.08;
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.42, height, 0.48]} />
        <meshStandardMaterial color="#091315" metalness={0.82} roughness={0.24} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, 0.247]}>
        <planeGeometry args={[0.33, height * 0.88]} />
        <meshStandardMaterial color="#142629" metalness={0.6} roughness={0.35} transparent opacity={opacity} />
      </mesh>
      {[-0.42, -0.21, 0, 0.21, 0.42].map((y, row) => (
        <group key={y} position={[0, y * (height / 1.25), 0.255]}>
          <mesh><boxGeometry args={[0.26, 0.025, 0.012]} /><meshBasicMaterial color={row === 1 ? teal : "#547276"} transparent opacity={(row === 1 && active ? 1 : 0.55) * opacity} /></mesh>
          <StatusLight position={[0.13, 0, 0.012]} delay={index * 0.5 + row * 0.3} active={active} opacity={opacity} />
        </group>
      ))}
      <mesh position={[-0.17, 0, 0]}><boxGeometry args={[0.025, height * 0.94, 0.52]} /><meshStandardMaterial color="#345156" metalness={0.8} transparent opacity={opacity} /></mesh>
      <mesh position={[0.17, 0, 0]}><boxGeometry args={[0.025, height * 0.94, 0.52]} /><meshStandardMaterial color="#345156" metalness={0.8} transparent opacity={opacity} /></mesh>
    </group>
  );
}

function StatusLight({ position, delay, active, opacity }: { position: [number, number, number]; delay: number; active: boolean; opacity: number }) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (!material.current) return;
    const pulse = Math.sin(clock.elapsedTime * 3.5 + delay) > 0.2 ? 1 : 0.22;
    material.current.opacity = opacity * (active ? pulse : 0.45);
  });
  return <mesh position={position}><sphereGeometry args={[0.018, 8, 8]} /><meshBasicMaterial ref={material} color={teal} transparent opacity={opacity} toneMapped={false} /></mesh>;
}
