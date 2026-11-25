import type { Vec3 } from "@/lib/darkroom/hotspots";
import { SoftBox } from "./StudioFinishes";

const FOLIAGE = [
  { angle: 0.1, lean: -0.86, height: 0.12, length: 0.083, color: "#586c44" },
  { angle: 1.4, lean: -0.8, height: 0.135, length: 0.078, color: "#3d604b" },
  { angle: 2.45, lean: -1.02, height: 0.142, length: 0.113, color: "#597655" },
  { angle: 3.4, lean: -0.6, height: 0.175, length: 0.1, color: "#76906a" },
  { angle: 4.3, lean: -0.85, height: 0.108, length: 0.097, color: "#496b52" },
  { angle: 5.3, lean: -0.92, height: 0.148, length: 0.091, color: "#5a7251" },
  { angle: 1.0, lean: -0.42, height: 0.18, length: 0.09, color: "#789264" },
  { angle: 4.8, lean: -0.33, height: 0.169, length: 0.10, color: "#5d7d54" },
] as const;

export function ShelfPlant({ position }: { position: Vec3 }) {
  return (
    <group position={[...position]}>
      <mesh position={[0, 0.045, 0]} castShadow>
        <cylinderGeometry args={[0.057, 0.041, 0.09, 12]} />
        <meshStandardMaterial color="#ad8768" roughness={0.78} flatShading />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.051, 0.006, 8, 24]} />
        <meshStandardMaterial color="#ba9674" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.091, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.047, 20]} />
        <meshStandardMaterial color="#30241c" roughness={1} />
      </mesh>
      {FOLIAGE.map(({ angle, lean, height, length, color }) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh position={[0, (0.09 + height) / 2, 0.007]} rotation={[-0.22, 0, 0]}>
            <cylinderGeometry args={[0.0012, 0.0025, height - 0.084, 6]} />
            <meshStandardMaterial color="#516143" roughness={0.85} />
          </mesh>
          <group position={[0, height, 0.012]} rotation={[lean, 0, 0]}>
            <mesh position={[0, length * 0.42, 0]} scale={[length * 0.33, length * 0.56, 0.0045]}>
              <sphereGeometry args={[1, 10, 6]} />
              <meshStandardMaterial color={color} roughness={0.57} />
            </mesh>
            <mesh position={[0, length * 0.43, 0.004]}>
              <boxGeometry args={[0.0014, length * 0.72, 0.001]} />
              <meshStandardMaterial color="#819064" roughness={0.65} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

export function StackedBooks({ position }: { position: Vec3 }) {
  return (
    <group position={[...position]}>
      {[
        { color: "#a65d45", width: 0.27, depth: 0.19, angle: -0.09 },
        { color: "#b3a286", width: 0.25, depth: 0.18, angle: 0.06 },
        { color: "#425858", width: 0.225, depth: 0.155, angle: -0.04 },
      ].map(({ color, width, depth, angle }, i) => (
        <group key={color} position={[i * 0.007, 0.009 + i * 0.019, 0]} rotation={[0, angle, 0]}>
          <SoftBox size={[width - 0.006, 0.015, depth - 0.006]} color="#cbc0a8" radius={0.002} />
          {[-0.008, 0.008].map((y) => (
            <SoftBox key={y} position={[0, y, 0]} size={[width, 0.003, depth]} color={color} radius={0.001} />
          ))}
          <SoftBox position={[-width / 2 + 0.003, 0, 0]} size={[0.008, 0.019, depth]} color={color} radius={0.003} />
        </group>
      ))}
    </group>
  );
}

/** Una lente sul ripiano collega la libreria alla camera oscura. */
export function ShelfLens({ position }: { position: Vec3 }) {
  return (
    <group position={[...position]} rotation={[0, 0.24, 0]}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.047, 0.041, 0.12, 24]} />
        <meshStandardMaterial color="#282c2b" roughness={0.55} metalness={0.28} />
      </mesh>
      {[0.022, 0.055, 0.083, 0.115].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.044, y === 0.083 ? 0.005 : 0.0025, 7, 24]} />
          <meshStandardMaterial color={y === 0.115 ? "#9e8270" : "#1a1d1c"} metalness={0.55} roughness={0.47} />
        </mesh>
      ))}
      <mesh position={[0, 0.121, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.035, 24]} />
        <meshPhysicalMaterial color="#1d3935" roughness={0.16} clearcoat={0.7} metalness={0.25} />
      </mesh>
    </group>
  );
}
