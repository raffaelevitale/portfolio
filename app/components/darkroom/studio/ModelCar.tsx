import { useEffect, useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import type { Vec3 } from "@/lib/darkroom/hotspots";
import type { ShowcaseItem } from "@/lib/studio-content";
import { SoftBox } from "./StudioFinishes";

const LENGTH = 0.24;
type Section = readonly [x: number, bottom: number, top: number, halfWidth: number];
interface Profile {
  body: readonly Section[];
  cabin: readonly Section[];
  axle: readonly [rear: number, front: number];
  wheel: number;
  grille: number;
}

const PROFILES = {
  saloon: {
    body: [
      [-0.12, 0.022, 0.045, 0.042],
      [-0.093, 0.019, 0.054, 0.049],
      [-0.035, 0.02, 0.052, 0.05],
      [0.04, 0.02, 0.049, 0.049],
      [0.094, 0.021, 0.049, 0.047],
      [0.12, 0.025, 0.047, 0.038],
    ],
    cabin: [
      [-0.085, 0.049, 0.051, 0.044],
      [-0.052, 0.049, 0.078, 0.038],
      [0.006, 0.048, 0.082, 0.039],
      [0.054, 0.047, 0.051, 0.043],
    ],
    axle: [-0.078, 0.076], wheel: 0.019, grille: 0.022,
  },
  touring: {
    body: [
      [-0.12, 0.023, 0.047, 0.039],
      [-0.09, 0.02, 0.053, 0.049],
      [-0.036, 0.02, 0.047, 0.05],
      [0.043, 0.019, 0.045, 0.049],
      [0.094, 0.022, 0.044, 0.046],
      [0.12, 0.025, 0.041, 0.037],
    ],
    cabin: [
      [-0.084, 0.046, 0.048, 0.041],
      [-0.049, 0.045, 0.076, 0.037],
      [-0.008, 0.044, 0.076, 0.037],
      [0.035, 0.043, 0.046, 0.043],
    ],
    axle: [-0.078, 0.079], wheel: 0.019, grille: 0.016,
  },
  fastback: {
    body: [
      [-0.12, 0.025, 0.043, 0.037],
      [-0.091, 0.019, 0.051, 0.052],
      [-0.036, 0.019, 0.048, 0.051],
      [0.046, 0.019, 0.047, 0.047],
      [0.093, 0.022, 0.045, 0.045],
      [0.12, 0.026, 0.038, 0.031],
    ],
    cabin: [
      [-0.091, 0.045, 0.048, 0.044],
      [-0.058, 0.044, 0.073, 0.036],
      [-0.022, 0.044, 0.077, 0.035],
      [0.027, 0.043, 0.046, 0.041],
    ],
    axle: [-0.077, 0.081], wheel: 0.02, grille: 0.012,
  },
  rearEngine: {
    body: [
      [-0.12, 0.024, 0.045, 0.036],
      [-0.086, 0.018, 0.052, 0.051],
      [-0.032, 0.019, 0.049, 0.049],
      [0.04, 0.019, 0.048, 0.047],
      [0.088, 0.019, 0.051, 0.047],
      [0.12, 0.023, 0.042, 0.036],
    ],
    cabin: [
      [-0.097, 0.048, 0.051, 0.039],
      [-0.068, 0.047, 0.066, 0.038],
      [-0.033, 0.046, 0.081, 0.036],
      [0.003, 0.046, 0.077, 0.034],
      [0.051, 0.046, 0.049, 0.041],
    ],
    axle: [-0.073, 0.079], wheel: 0.019, grille: 0.011,
  },
  classic: {
    body: [
      [-0.12, 0.03, 0.041, 0.031],
      [-0.086, 0.021, 0.05, 0.047],
      [-0.036, 0.018, 0.047, 0.046],
      [0.037, 0.018, 0.047, 0.044],
      [0.086, 0.021, 0.052, 0.045],
      [0.12, 0.027, 0.044, 0.032],
    ],
    cabin: [
      [-0.081, 0.047, 0.05, 0.039],
      [-0.052, 0.047, 0.076, 0.033],
      [-0.022, 0.046, 0.084, 0.032],
      [0.008, 0.045, 0.079, 0.032],
      [0.046, 0.045, 0.049, 0.038],
    ],
    axle: [-0.072, 0.077], wheel: 0.018, grille: 0.014,
  },
} as const satisfies Record<string, Profile>;

function profileFor(name: string): Profile {
  if (name.startsWith("Bentley")) return PROFILES.saloon;
  if (name.startsWith("Porsche")) return PROFILES.rearEngine;
  if (name.startsWith("Ferrari")) return PROFILES.fastback;
  if (name.startsWith("Mercedes")) return PROFILES.classic;
  return PROFILES.touring;
}

// Le sezioni cambiano larghezza e curvatura lungo la carrozzeria.
function loft(sections: readonly Section[], inset: number) {
  const vertices: number[] = [];
  const indices: number[] = [];
  const ring = 8;
  for (const [x, bottom, top, w] of sections) {
    const shoulder = bottom + (top - bottom) * 0.77;
    vertices.push(
      x, bottom, -w * 0.78,
      x, bottom, w * 0.78,
      x, bottom + (top - bottom) * 0.34, w * 0.95,
      x, shoulder, w,
      x, top, w * inset,
      x, top, -w * inset,
      x, shoulder, -w,
      x, bottom + (top - bottom) * 0.34, -w * 0.95,
    );
  }
  for (let i = 0; i < sections.length - 1; i++) {
    for (let face = 0; face < ring; face++) {
      const a = i * ring + face;
      const b = i * ring + (face + 1) % ring;
      indices.push(a, a + ring, b, b, a + ring, b + ring);
    }
  }
  const last = (sections.length - 1) * ring;
  for (let i = 1; i < ring - 1; i++) {
    indices.push(0, i, i + 1, last, last + i + 1, last + i);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function ModelCar({ item, position, rotationY, scale }: {
  item: ShowcaseItem; position: Vec3; rotationY: number; scale: number;
}) {
  const profile = profileFor(item.name);
  const { body, cabin } = useMemo(() => ({
    body: loft(profile.body, 0.73),
    cabin: loft(profile.cabin, 0.68),
  }), [profile]);
  useEffect(() => () => {
    body.dispose();
    cabin.dispose();
  }, [body, cabin]);

  return (
    <group position={[...position]} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh geometry={body} castShadow>
        <meshPhysicalMaterial color={item.color} metalness={0.28} roughness={0.37} clearcoat={0.65} clearcoatRoughness={0.28} />
      </mesh>
      <mesh geometry={cabin}>
        <meshPhysicalMaterial color="#202f33" metalness={0.38} roughness={0.23} clearcoat={0.9} />
      </mesh>
      {profile.axle.map((x) => [-1, 1].map((side) => (
        <group key={`${x}-${side}`} position={[x, profile.wheel, side * 0.049]} rotation={[0, side > 0 ? 0 : Math.PI, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[profile.wheel, profile.wheel, 0.014, 18]} />
            <meshStandardMaterial color="#151717" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0, 0.0071]}>
            <circleGeometry args={[profile.wheel * 0.67, 16]} />
            <meshStandardMaterial color="#626765" roughness={0.44} metalness={0.55} />
          </mesh>
          <mesh position={[0, 0, 0.0078]}>
            <torusGeometry args={[profile.wheel * 0.62, 0.0012, 5, 16]} />
            <meshStandardMaterial color="#b6b1a6" roughness={0.43} metalness={0.6} />
          </mesh>
          {Array.from({ length: 5 }, (_, i) => (
            <mesh key={i} rotation={[0, 0, i * Math.PI / 5]} position={[0, 0, 0.008]}>
              <boxGeometry args={[0.0011, profile.wheel * 1.15, 0.0006]} />
              <meshStandardMaterial color="#b6b1a6" roughness={0.43} metalness={0.6} />
            </mesh>
          ))}
        </group>
      )))}
      <SoftBox size={[0.0025, profile.grille, 0.039]} position={[LENGTH / 2, 0.034, 0]} color="#202524" radius={0.001} />
      {[-0.028, 0.028].map((z) => (
        <group key={z}>
          <SoftBox size={[0.003, 0.006, 0.013]} position={[0.118, 0.041, z]} color="#d9d5c1" radius={0.0013} />
          <SoftBox size={[0.003, 0.006, 0.013]} position={[-0.119, 0.04, z]} color="#972f28" radius={0.0013} />
        </group>
      ))}
    </group>
  );
}
