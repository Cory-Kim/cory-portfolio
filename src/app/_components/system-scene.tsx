"use client";

import { ContactShadows, Float, Grid, Html, MeshReflectorMaterial, OrbitControls, RoundedBox, Stars, useCursor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { siCplusplus, siDjango, siGit, siGithub, siGmail, siJavascript, siLinux, siMongodb, siNextdotjs, siNodedotjs, siPostgresql, siPython, siReact, siTypescript } from "simple-icons";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { certifications, education, experienceEntries } from "../_data/experience";
import { selectedProjects } from "../_data/projects";
import { featuredSkills, supportingSkills, type Skill } from "../_data/skills";

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
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.7 }}
        camera={{ position: [7.8, 8.8, 10], fov: 42, near: 0.1, far: 80 }}
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
      {selected === "experience" && <ExperiencePanel onClose={() => selectStation(null)} />}
      {selected === "skills" && <SkillsPanel onClose={() => selectStation(null)} />}
      {selected === "contact" && <ContactPanel onClose={() => selectStation(null)} />}
    </div>
  );
}

function SceneControls({ selected }: { selected: string | null }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();
  const defaultPosition = useMemo(() => {
    if (size.width < 700) return new THREE.Vector3(15, 17, 19);
    if (size.width < 1100) return new THREE.Vector3(11, 13, 15);
    return new THREE.Vector3(7.8, 8.8, 10);
  }, [size.width]);

  useEffect(() => {
    if (!selected) camera.position.copy(defaultPosition);
  }, [camera, defaultPosition, selected]);

  useFrame(() => {
    const station = stations.find((item) => item.id === selected);
    const target = station
      ? new THREE.Vector3(station.position[0], station.position[1] - 0.7, station.position[2])
      : new THREE.Vector3(0, -1.15, 0);
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
        <StationNode key={station.id} station={station} active={activeId === station.id} selected={selected === station.id} panelOpen={Boolean(selected)} aboutExpanded={aboutExpanded} hovered={hovered === station.id} dimmed={Boolean(activeId && activeId !== station.id)} onHover={onHover} onSelect={onSelect} onToggleAbout={onToggleAbout} />
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
      <mesh castShadow receiveShadow><cylinderGeometry args={[1.2, 1.42, 0.44, 8]} /><meshStandardMaterial color="#183033" metalness={0.64} roughness={0.26} /></mesh>
      <mesh position={[0, 0.24, 0]}><boxGeometry args={[1.25, 0.22, 1.25]} /><meshStandardMaterial ref={glow} color="#bafff5" emissive={teal} emissiveIntensity={3.2} toneMapped={false} /></mesh>
      <mesh position={[0, 0.37, 0]}><boxGeometry args={[0.84, 0.12, 0.84]} /><meshStandardMaterial color="#effffc" emissive={teal} emissiveIntensity={1.8} toneMapped={false} /></mesh>
      {showLabel && <SceneLabel position={[0, 1.05, 0]} label="CORE" detail="CENTRAL" />}
    </group>
  );
}

function StationNode({ station, active, selected, panelOpen, aboutExpanded, hovered, dimmed, onHover, onSelect, onToggleAbout }: { station: Station; active: boolean; selected: boolean; panelOpen: boolean; aboutExpanded: boolean; hovered: boolean; dimmed: boolean; onHover: (id: string | null) => void; onSelect: (id: string | null) => void; onToggleAbout: () => void }) {
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
      <mesh position={[0, 0.07, 0]} receiveShadow><cylinderGeometry args={[1.3, 1.46, 0.16, 8]} /><meshStandardMaterial color={active ? "#173033" : darkMetal} emissive={teal} emissiveIntensity={active ? 0.5 : 0.04} metalness={0.72} roughness={0.34} transparent opacity={dimmed ? 0.42 : 1} /></mesh>
      <StationModel kind={station.kind} active={active} dimmed={dimmed} />
      {!panelOpen && (
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
              Hi, I&apos;m Cory, a Vancouver-based developer with experience across web products, Linux systems, education, and AI evaluation.
            </p>
            <p className={`${expanded ? "text-[13px] leading-6" : "text-[11px] leading-5"} mt-3 text-zinc-400`}>
              I enjoy understanding how a product works end to end: building the interface, working through backend logic, testing the details, and making the result easier for people to use.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-px bg-white/10">
              <IdentityField label="Base" value="Vancouver, BC" />
              <IdentityField label="Role" value="Software Developer" />
              <IdentityField label="Focus" value="Full-stack + Linux" />
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
      code: "01 / FOUNDATION",
      text: "My Computer Systems Technology training at BCIT gave me a foundation in algorithms, databases, software development, and systems thinking.",
    },
    {
      code: "02 / PRACTICE",
      text: "Working on a real e-commerce platform taught me how code reviews, testing, APIs, infrastructure, and maintainability fit together.",
    },
    {
      code: "03 / CURRENT",
      text: "Today I split my time between evaluating AI output, teaching math, and building projects that push my full-stack skills further.",
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

function ContactPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020506]/76 px-4 pb-5 pt-16 backdrop-blur-[2px]" onClick={onClose}>
      <section className="pointer-events-auto max-h-[calc(100vh-5.5rem)] w-[68rem] max-w-full overflow-y-auto border border-teal-100/30 bg-[#061012]/98 font-mono text-white shadow-[0_24px_100px_rgba(0,0,0,0.8),0_0_50px_rgba(94,234,212,0.12)]" onClick={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            <p className="text-[8px] uppercase tracking-[0.22em] text-teal-200/60">Communication uplink // 05</p>
            <h3 className="mt-2 text-2xl font-bold uppercase tracking-[0.1em] text-white sm:text-3xl">Contact</h3>
            <p className="mt-1.5 text-[11px] text-zinc-400">Let&apos;s build something thoughtful together.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close Contact panel" title="Back to system" className="flex h-9 items-center gap-2 border border-white/15 px-3 text-[8px] uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:border-teal-100/40 hover:text-teal-50"><span>←</span><span className="hidden sm:inline">Back to system</span></button>
        </header>

        <div className="grid min-h-[32rem] lg:grid-cols-[23rem_1fr]">
          <div className="flex flex-col border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3 border border-emerald-300/15 bg-emerald-300/[0.025] px-4 py-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-300/60" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </span>
              <div>
                <p className="text-[8px] uppercase tracking-[0.18em] text-emerald-300">Signal ready</p>
                <p className="mt-1 text-[9px] text-zinc-500">Available for opportunities</p>
              </div>
            </div>

            <p className="mt-7 text-sm leading-6 text-zinc-300">Have a role, project, or interesting problem in mind? Email is the fastest way to reach me.</p>

            <div className="mt-6 space-y-2.5">
              <ContactLink href="mailto:cdokyung@gmail.com" label="Email me" detail="cdokyung@gmail.com" path={siGmail.path} />
              <ContactLink href="https://www.linkedin.com/in/dokyung-kim-0a7a8425b/" label="LinkedIn" detail="Connect professionally" icon="in" external />
              <ContactLink href="https://github.com/Cory-Kim" label="GitHub" detail="Explore my repositories" path={siGithub.path} external />
            </div>

            <div className="mt-auto grid grid-cols-2 gap-px bg-white/10 pt-px">
              <div className="bg-[#071113] px-4 py-3"><p className="text-[7px] uppercase tracking-[0.18em] text-zinc-600">Base</p><p className="mt-1.5 text-[9px] uppercase text-zinc-300">Vancouver, BC</p></div>
              <div className="bg-[#071113] px-4 py-3"><p className="text-[7px] uppercase tracking-[0.18em] text-zinc-600">Response</p><p className="mt-1.5 text-[9px] uppercase text-teal-200/75">Channel open</p></div>
            </div>
          </div>

          <div className="relative min-h-[30rem] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(18,104,110,0.16),transparent_62%)]">
            <ContactSignalScene />
            <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 border border-teal-100/20 bg-[#051012]/85 px-4 py-2 text-center backdrop-blur">
              <p className="text-[7px] uppercase tracking-[0.2em] text-teal-200/60">Awaiting transmission</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-zinc-300">Send a message to establish contact</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactLink({ href, label, detail, path, icon, external = false }: { href: string; label: string; detail: string; path?: string; icon?: string; external?: boolean }) {
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="group flex items-center gap-3 border border-white/10 px-4 py-3 transition-colors hover:border-teal-100/35 hover:bg-teal-100/[0.035]">
      <span className="grid h-9 w-9 shrink-0 place-items-center border border-white/10 text-teal-100/70 group-hover:border-teal-100/30 group-hover:text-teal-50">
        {path ? <BrandIcon path={path} /> : <span className="font-sans text-sm font-bold tracking-normal">{icon}</span>}
      </span>
      <span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-100">{label}</span><span className="mt-1 block truncate text-[8px] text-zinc-500">{detail}</span></span>
      <span className="text-xs text-teal-200/40 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-100">→</span>
    </a>
  );
}

function BrandIcon({ path }: { path: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d={path} /></svg>;
}

function ContactSignalScene() {
  return (
    <div className="absolute inset-0">
      <Canvas dpr={[1, 2]} shadows camera={{ position: [5.8, 4.2, 7.5], fov: 42, near: 0.1, far: 40 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.45 }}>
        <ambientLight intensity={1.1} color="#b7d5d1" />
        <directionalLight position={[4, 8, 5]} intensity={3.5} color="#effffc" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[0, 3, 1]} intensity={26} distance={10} color={teal} />
        <Stars radius={24} depth={12} count={350} factor={1.5} saturation={0} fade speed={0.18} />
        <SatelliteDish />
        <ContactShadows position={[0, -1.45, 0]} opacity={0.75} scale={9} blur={2.5} far={8} />
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3.1} maxPolarAngle={Math.PI / 2.35} minAzimuthAngle={-0.55} maxAzimuthAngle={0.55} target={[0, 0.35, 0]} />
      </Canvas>
    </div>
  );
}

function SatelliteDish() {
  const assembly = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (assembly.current) assembly.current.rotation.y = Math.sin(clock.elapsedTime * 0.28) * 0.2;
  });

  return (
    <group position={[0, -0.9, 0]}>
      <mesh castShadow receiveShadow><cylinderGeometry args={[1.5, 1.85, 0.35, 32]} /><meshStandardMaterial color="#071416" metalness={0.82} roughness={0.24} /></mesh>
      <mesh position={[0, 0.65, 0]} castShadow><cylinderGeometry args={[0.56, 0.8, 1.3, 24]} /><meshStandardMaterial color="#16292c" metalness={0.75} roughness={0.25} /></mesh>
      <group ref={assembly} position={[0, 1.55, 0]} rotation={[0, 0, -0.18]}>
        <mesh rotation={[0.15, 0, -0.48]} castShadow><sphereGeometry args={[1.55, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2.55]} /><meshPhysicalMaterial color="#19363a" side={THREE.DoubleSide} metalness={0.72} roughness={0.2} clearcoat={0.8} /></mesh>
        <mesh position={[0.64, 0.72, 0]} rotation={[0, 0, -0.45]}><cylinderGeometry args={[0.06, 0.08, 1.25, 12]} /><meshStandardMaterial color="#82a7a5" metalness={0.8} /></mesh>
        <mesh position={[0.94, 1.08, 0]}><sphereGeometry args={[0.16, 16, 16]} /><meshStandardMaterial color="#dcfffa" emissive={teal} emissiveIntensity={3.5} toneMapped={false} /></mesh>
      </group>
      {[0, 0.34, 0.68].map((delay) => <SignalPulse key={delay} delay={delay} />)}
    </group>
  );
}

function SignalPulse({ delay }: { delay: number }) {
  const ring = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    const progress = (clock.elapsedTime * 0.32 + delay) % 1;
    if (ring.current) {
      const scale = 0.5 + progress * 2.3;
      ring.current.scale.setScalar(scale);
      ring.current.position.y = 2.75 + progress * 1.1;
    }
    if (material.current) material.current.opacity = Math.sin(progress * Math.PI) * 0.62;
  });
  return <mesh ref={ring} position={[0.55, 2.75, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.55, 0.018, 8, 48]} /><meshBasicMaterial ref={material} color={teal} transparent opacity={0} toneMapped={false} /></mesh>;
}

function SkillsPanel({ onClose }: { onClose: () => void }) {
  const [activeSkill, setActiveSkill] = useState<Skill>(featuredSkills[4]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020506]/76 px-4 pb-5 pt-16 backdrop-blur-[2px]" onClick={onClose}>
      <section className="pointer-events-auto max-h-[calc(100vh-5.5rem)] w-[74rem] max-w-full overflow-y-auto border border-teal-100/30 bg-[#061012]/98 font-mono text-white shadow-[0_24px_100px_rgba(0,0,0,0.8),0_0_50px_rgba(94,234,212,0.12)]" onClick={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            <p className="text-[8px] uppercase tracking-[0.22em] text-teal-200/60">Toolchain matrix // 03</p>
            <h3 className="mt-2 text-2xl font-bold uppercase tracking-[0.1em] text-white sm:text-3xl">Skills</h3>
            <p className="mt-1.5 text-[11px] text-zinc-400">The languages, frameworks, and systems behind my work.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close Skills panel" title="Back to system" className="flex h-9 items-center gap-2 border border-white/15 px-3 text-[8px] uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:border-teal-100/40 hover:text-teal-50"><span>←</span><span className="hidden sm:inline">Back to system</span></button>
        </header>

        <div className="grid lg:grid-cols-[1fr_17rem]">
          <div className="relative min-h-[31rem] overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(28,116,119,0.18),transparent_58%)] lg:border-b-0 lg:border-r">
            <SkillsCubeScene activeSkill={activeSkill} onSelect={setActiveSkill} />
            <p className="absolute bottom-5 left-0 right-0 z-10 text-center text-[8px] uppercase tracking-[0.2em] text-teal-200/50">Hover or tap a module to inspect</p>
          </div>

          <aside className="flex flex-col p-6 sm:p-7">
            <div>
              <p className="text-[7px] uppercase tracking-[0.2em] text-teal-200/55">Active module</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center border text-sm font-black" style={{ borderColor: `${activeSkill.color}80`, color: activeSkill.color, boxShadow: `0 0 24px ${activeSkill.color}22` }}>{activeSkill.short}</div>
                <div>
                  <h4 className="text-base font-semibold text-zinc-100">{activeSkill.name}</h4>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-zinc-500">{activeSkill.category}</p>
                </div>
              </div>
            </div>

            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="text-[7px] uppercase tracking-[0.2em] text-teal-200/55">System categories</p>
              <div className="mt-3 space-y-2">
                {["Languages", "Frontend", "Backend", "Data & Systems"].map((category) => (
                  <div key={category} className="flex items-center justify-between border-b border-white/5 pb-2 text-[9px] uppercase tracking-[0.1em] text-zinc-400">
                    <span>{category}</span>
                    <span className="text-teal-200/45">{featuredSkills.filter((skill) => skill.category === category).length.toString().padStart(2, "0")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="text-[7px] uppercase tracking-[0.2em] text-teal-200/55">Supporting toolchain</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {supportingSkills.map((skill) => <span key={skill} className="border border-white/10 px-2 py-1.5 text-[8px] text-zinc-500">{skill}</span>)}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

const skillIcons: Record<string, { path: string }> = {
  Python: siPython,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  "C++": siCplusplus,
  React: siReact,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  Django: siDjango,
  Linux: siLinux,
  SQL: siPostgresql,
  MongoDB: siMongodb,
  Git: siGit,
};

const cubePositions: Array<[number, number, number]> = [
  [-3.75, 0.12, -2.5], [-1.25, 0.12, -2.5], [1.25, 0.12, -2.5], [3.75, 0.12, -2.5],
  [-3.75, 0.12, 0], [-1.25, 0.12, 0], [1.25, 0.12, 0], [3.75, 0.12, 0],
  [-3.75, 0.12, 2.5], [-1.25, 0.12, 2.5], [1.25, 0.12, 2.5], [3.75, 0.12, 2.5],
];

function SkillsCubeScene({ activeSkill, onSelect }: { activeSkill: Skill; onSelect: (skill: Skill) => void }) {
  return (
    <div className="absolute inset-0">
      <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 12.5, 14], fov: 43, near: 0.1, far: 50 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.45 }}>
        <ambientLight intensity={1.1} color="#b9d8d4" />
        <directionalLight position={[4, 9, 6]} intensity={3.2} color="#e8fffb" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-4, 2, 2]} intensity={22} distance={11} color="#35d8ff" />
        <pointLight position={[4, 2, -1]} intensity={18} distance={10} color="#3de8bd" />

        <group position={[0, -0.6, 0]}>
          <mesh position={[0, -1.35, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[6.35, 6.8, 0.42, 64]} />
            <meshStandardMaterial color="#071214" metalness={0.86} roughness={0.2} />
          </mesh>
          <mesh position={[0, -1.125, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[6.23, 64]} />
            <MeshReflectorMaterial color="#091719" metalness={0.82} roughness={0.28} mirror={0.48} blur={[280, 80]} mixBlur={1.2} mixStrength={0.75} resolution={512} depthScale={0.5} minDepthThreshold={0.4} maxDepthThreshold={1.4} />
          </mesh>
          {[2.55, 4.3, 5.95].map((radius) => (
            <mesh key={radius} position={[0, -1.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius, radius + 0.025, 64]} />
              <meshBasicMaterial color={teal} transparent opacity={radius === 4.65 ? 0.5 : 0.18} toneMapped={false} />
            </mesh>
          ))}

          {featuredSkills.map((skill, index) => (
            <SkillCube3D key={skill.name} skill={skill} index={index} position={cubePositions[index]} active={activeSkill.name === skill.name} onSelect={onSelect} />
          ))}
          <ContactShadows position={[0, -1.08, 0]} opacity={0.72} scale={13} blur={2.5} far={8} />
        </group>

        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4.2} maxPolarAngle={Math.PI / 3} minAzimuthAngle={-0.28} maxAzimuthAngle={0.28} target={[0, -0.45, 0]} />
      </Canvas>
    </div>
  );
}

function SkillCube3D({ skill, index, position, active, onSelect }: { skill: Skill; index: number; position: [number, number, number]; active: boolean; onSelect: (skill: Skill) => void }) {
  const texture = useSkillIconTexture(skillIcons[skill.name].path, skill.color);
  const size = index === 4 ? 1.3 : index % 5 === 1 ? 1.18 : 1.08;

  return (
    <Float speed={1.15 + (index % 4) * 0.12} rotationIntensity={0.12} floatIntensity={0.32} floatingRange={[-0.08, 0.14]}>
      <group position={position} rotation={[0, -0.08 + (index % 4) * 0.05, 0.015 * ((index % 3) - 1)]} onPointerEnter={(event) => { event.stopPropagation(); onSelect(skill); }} onClick={(event) => { event.stopPropagation(); onSelect(skill); }}>
        <RoundedBox args={[size, size, size]} radius={0.12} smoothness={5} castShadow receiveShadow>
          <meshPhysicalMaterial color="#0a171a" emissive={skill.color} emissiveIntensity={active ? 0.5 : 0.14} metalness={0.5} roughness={0.2} clearcoat={0.85} clearcoatRoughness={0.16} />
        </RoundedBox>
        <mesh position={[0, 0, size / 2 + 0.008]}>
          <planeGeometry args={[size * 0.58, size * 0.58]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} opacity={active ? 1 : 0.82} />
        </mesh>
        <pointLight position={[0, 0.1, 0.9]} intensity={active ? 4.5 : 1.2} distance={2.8} color={skill.color} />
      </group>
    </Float>
  );
}

function useSkillIconTexture(path: string, color: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (context) {
      context.translate(32, 32);
      context.scale(8, 8);
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 1.5;
      context.fill(new Path2D(path));
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [color, path]);
}

function ExperiencePanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020506]/72 px-4 pb-5 pt-16 backdrop-blur-[2px]" onClick={onClose}>
      <section
        className="pointer-events-auto max-h-[calc(100vh-5.5rem)] w-[76rem] max-w-full overflow-y-auto border border-teal-100/30 bg-[#061012]/98 font-mono text-white shadow-[0_24px_100px_rgba(0,0,0,0.8),0_0_50px_rgba(94,234,212,0.12)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-[19rem] overflow-hidden border-b border-teal-100/20">
          <Image src="/images/experience-journey.png" alt="A glowing path connecting milestones through a futuristic landscape" fill sizes="(max-width: 1280px) 100vw, 1216px" className="object-cover" priority />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,9,0.92)_0%,rgba(2,7,9,0.48)_48%,rgba(2,7,9,0.14)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061012] via-transparent to-black/20" />
          <div className="absolute left-7 top-6 sm:left-9 sm:top-8">
            <p className="text-[9px] uppercase tracking-[0.24em] text-teal-200/70">Career archive // 02</p>
            <h3 className="mt-3 text-3xl font-bold uppercase tracking-[0.08em] text-white sm:text-4xl">Experience</h3>
            <p className="mt-2 text-xs text-zinc-300 sm:text-sm">A journey through learning, building, and growth.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close Experience panel" title="Back to system" className="absolute right-6 top-6 flex h-9 items-center gap-2 border border-white/20 bg-black/30 px-3 text-[8px] uppercase tracking-[0.14em] text-zinc-300 backdrop-blur transition-colors hover:border-teal-100/50 hover:text-teal-50"><span>←</span><span className="hidden sm:inline">Back to system</span></button>
          <div className="absolute bottom-5 left-7 right-7 grid grid-cols-3 sm:left-9 sm:right-9">
            {experienceEntries.map((entry, index) => (
              <div key={entry.organization} className="relative border-t border-teal-100/45 pt-3">
                <span className={`absolute -top-1.5 left-0 h-3 w-3 rounded-full border border-teal-50 ${index === 0 ? "bg-white shadow-[0_0_16px_rgba(94,234,212,1)]" : "bg-teal-300"}`} />
                <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-teal-100 sm:text-[10px]">{entry.period.replace(" — ", "–")}</p>
                <p className="mt-1 hidden max-w-40 text-[9px] leading-4 text-zinc-300 sm:block">{entry.organization}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.55fr_0.75fr] lg:p-9">
          <div className="relative space-y-4 before:absolute before:bottom-4 before:left-[6px] before:top-4 before:w-px before:bg-teal-200/20">
            {experienceEntries.map((entry, index) => (
              <article key={entry.organization} className="relative grid grid-cols-[14px_1fr] gap-4">
                <span className={`relative z-10 mt-5 h-[13px] w-[13px] rounded-full border ${index === 0 ? "border-teal-100 bg-teal-300 shadow-[0_0_14px_rgba(94,234,212,0.8)]" : "border-teal-200/50 bg-[#071113]"}`} />
                <div className="border border-white/10 bg-black/15 p-5 transition-colors hover:border-teal-100/25 hover:bg-teal-100/[0.025]">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.16em] text-teal-200/70">{entry.period}</p>
                      <h4 className="mt-2 text-base font-semibold text-zinc-100">{entry.role}</h4>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-zinc-400">{entry.organization}</p>
                    </div>
                    <span className="border border-white/10 px-2 py-1 text-[7px] uppercase tracking-[0.12em] text-zinc-500">{entry.type}</span>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-zinc-300">{entry.summary}</p>
                  <ul className="mt-3 space-y-1.5">
                    {entry.highlights.map((highlight) => <li key={highlight} className="flex gap-2 text-[10px] leading-4 text-zinc-500"><span className="text-teal-200/60">+</span>{highlight}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-4">
            <section className="border border-white/10 bg-black/15 p-5">
              <p className="text-[8px] uppercase tracking-[0.2em] text-teal-200/60">Education</p>
              <h4 className="mt-2 text-sm font-semibold leading-5 text-zinc-100">{education.school}</h4>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.08em] text-zinc-400">{education.program}</p>
              <p className="mt-3 text-[10px] leading-5 text-zinc-500">{education.detail}</p>
            </section>
            <section className="border border-white/10 bg-black/15 p-5">
              <p className="text-[8px] uppercase tracking-[0.2em] text-teal-200/60">Certifications // 04</p>
              <div className="mt-3 space-y-2">
                {certifications.map((certification, index) => (
                  <div key={certification} className="flex items-start gap-2 border-b border-white/5 pb-2.5 text-[10px] leading-4 text-zinc-400 last:border-0 last:pb-0">
                    <span className="text-teal-200/50">0{index + 1}</span>
                    <span>{certification}</span>
                  </div>
                ))}
              </div>
            </section>
            <a href="mailto:cdokyung@gmail.com" className="flex items-center justify-between border border-teal-100/20 px-5 py-4 text-[9px] uppercase tracking-[0.14em] text-teal-200/70 transition-colors hover:border-teal-100/45 hover:bg-teal-100/5 hover:text-teal-50"><span>Discuss an opportunity</span><span>→</span></a>
          </aside>
        </div>
      </section>
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
      {kind === "timeline" && <ExperienceStation active={active} opacity={opacity} />}
      {kind === "robot" && <SkillsStation active={active} opacity={opacity} />}
      {kind === "door" && <AboutStation active={active} opacity={opacity} />}
      {kind === "dish" && <group position={[0, 0.45, 0]}><mesh castShadow><cylinderGeometry args={[0.48, 0.68, 0.6, 16]} /><Metal opacity={opacity} /></mesh><mesh position={[0, 0.72, 0]} rotation={[0.2, 0, 0.35]} castShadow><sphereGeometry args={[0.68, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#28484c" side={THREE.DoubleSide} metalness={0.65} emissive={teal} emissiveIntensity={active ? 0.35 : 0.05} transparent opacity={opacity} /></mesh><mesh position={[0.24, 0.98, 0]}><sphereGeometry args={[0.11, 12, 12]} /><meshBasicMaterial color={teal} /></mesh></group>}
      {kind === "workstation" && <group position={[0, 0.72, 0]}><mesh castShadow><boxGeometry args={[1.45, 1, 0.15]} /><Metal opacity={opacity} /></mesh><mesh position={[0, 0, 0.09]}><planeGeometry args={[1.12, 0.68]} /><meshStandardMaterial color="#15545a" emissive={teal} emissiveIntensity={glow} transparent opacity={opacity} /></mesh><mesh position={[0, -0.68, 0]} castShadow><boxGeometry args={[0.14, 0.38, 0.14]} /><Metal light opacity={opacity} /></mesh><mesh position={[0, -0.9, 0]}><boxGeometry args={[0.75, 0.08, 0.32]} /><Metal light opacity={opacity} /></mesh></group>}
    </group>
  );
}

function Metal({ light = false, opacity = 1 }: { light?: boolean; opacity?: number }) {
  return <meshStandardMaterial color={light ? "#52777b" : darkMetal} emissive={light ? "#205154" : "#10292c"} emissiveIntensity={0.28} metalness={0.6} roughness={0.34} transparent opacity={opacity} />;
}

function SkillsStation({ active, opacity }: { active: boolean; opacity: number }) {
  const modules = [
    { position: [-0.52, 0.56, -0.18] as [number, number, number], color: "#68d8ff", scale: 0.34 },
    { position: [0, 0.78, -0.3] as [number, number, number], color: "#f7df5e", scale: 0.4 },
    { position: [0.5, 0.53, -0.16] as [number, number, number], color: "#5aa9ff", scale: 0.32 },
    { position: [-0.3, 0.4, 0.4] as [number, number, number], color: "#63e6ff", scale: 0.3 },
    { position: [0.28, 0.45, 0.4] as [number, number, number], color: "#7fe38d", scale: 0.33 },
  ];

  return (
    <group>
      <mesh position={[0, 0.19, 0]} receiveShadow>
        <cylinderGeometry args={[1.05, 1.18, 0.22, 24]} />
        <meshStandardMaterial color="#102528" metalness={0.72} roughness={0.3} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.92, 32]} />
        <meshStandardMaterial color={teal} emissive={teal} emissiveIntensity={active ? 1.1 : 0.28} transparent opacity={(active ? 0.8 : 0.36) * opacity} toneMapped={false} />
      </mesh>
      {modules.map((module, index) => (
        <group key={`${module.position[0]}-${module.position[2]}`} position={module.position} rotation={[0.05 * index, 0.35 * index, 0.04 * (index - 2)]}>
          <mesh castShadow scale={module.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#102124" emissive={module.color} emissiveIntensity={active ? 0.75 : 0.22} metalness={0.48} roughness={0.26} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, 0, module.scale * 0.52]} scale={module.scale * 0.42}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color={module.color} transparent opacity={(active ? 1 : 0.65) * opacity} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ExperienceStation({ active, opacity }: { active: boolean; opacity: number }) {
  const scan = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (scan.current) scan.current.position.y = Math.sin(clock.elapsedTime * 1.15) * 0.52;
  });

  return (
    <group position={[0, 0.88, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.52, 1.58, 0.22]} />
        <Metal opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, 0.125]}>
        <boxGeometry args={[1.24, 1.28, 0.035]} />
        <meshStandardMaterial color="#10282b" emissive={teal} emissiveIntensity={active ? 0.38 : 0.1} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-0.42, 0, 0.155]}>
        <boxGeometry args={[0.025, 0.98, 0.025]} />
        <meshBasicMaterial color={teal} transparent opacity={(active ? 0.95 : 0.45) * opacity} />
      </mesh>
      {[0.38, 0, -0.38].map((y, index) => (
        <group key={y} position={[-0.42, y, 0.18]}>
          <mesh><sphereGeometry args={[0.07, 12, 12]} /><meshBasicMaterial color={index === 0 ? "#d7fff9" : teal} transparent opacity={(active ? 1 : 0.62) * opacity} toneMapped={false} /></mesh>
          <mesh position={[0.42, 0, 0]}><boxGeometry args={[0.62, 0.035, 0.025]} /><meshBasicMaterial color={index === 0 ? "#bffaf2" : "#557b7d"} transparent opacity={opacity} /></mesh>
        </group>
      ))}
      <mesh ref={scan} position={[0.2, 0, 0.2]}>
        <boxGeometry args={[0.7, 0.025, 0.018]} />
        <meshBasicMaterial color="#d4fff9" transparent opacity={active ? 0.9 : 0.25} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.94, 0]} castShadow><boxGeometry args={[0.18, 0.32, 0.18]} /><Metal light opacity={opacity} /></mesh>
      <mesh position={[0, -1.12, 0]}><boxGeometry args={[0.92, 0.08, 0.46]} /><Metal light opacity={opacity} /></mesh>
    </group>
  );
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
