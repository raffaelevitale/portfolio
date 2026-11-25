"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Component, Suspense, type ReactNode, useMemo, useRef } from "react";
import { Box3, Mesh, type Object3D, Texture, Vector3 } from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import { romeTime } from "@/lib/rome-time";

type Kind = "watch" | "car";
const HANDS = ["hour", "minute", "second"] as const;

function checkTextures(node: Object3D) {
  if (!(node instanceof Mesh)) return;
  const materials = Array.isArray(node.material) ? node.material : [node.material];
  for (const material of materials) {
    for (const value of Object.values(material)) {
      if (!(value instanceof Texture)) continue;
      const image = value.image as { width?: number; height?: number } | undefined;
      if (Math.max(image?.width ?? 0, image?.height ?? 0) > 512) {
        throw new Error("Texture GLB oltre 512 px");
      }
    }
  }
}

function Model({ url, kind }: { url: string; kind: Kind }) {
  const { scene } = useGLTF(url);
  const last = useRef(-1);
  const model = useMemo(() => {
    const object = clone(scene);
    const bounds = new Box3().setFromObject(object);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    // Convenzione dei GLB: X = lunghezza auto / diametro quadrante, Y = alto.
    if (!size.toArray().every(Number.isFinite) || size.x <= 0) throw new Error("Modello senza dimensioni valide");
    const scale = (kind === "watch" ? 0.045 : 0.24) / size.x;
    const offset: [number, number, number] = [-center.x, kind === "car" ? -bounds.min.y : -center.y, -center.z];
    const hands: Partial<Record<(typeof HANDS)[number], { node: Object3D; rest: number }>> = {};
    object.traverse((node) => {
      checkTextures(node);
      if (kind !== "watch") return;
      const name = node.name.toLowerCase().replace(/[^a-z]/g, "");
      const hand = HANDS.find((key) => name === `${key}hand` || name === `hand${key}`);
      if (hand) hands[hand] = { node, rest: node.rotation.z };
    });
    return { object, scale, offset, hands };
  }, [scene, kind]);

  useFrame(({ clock }) => {
    const { hour, minute, second } = model.hands;
    if (!hour && !minute && !second) return;
    const tick = Math.floor(clock.elapsedTime * 4);
    if (tick === last.current) return;
    last.current = tick;
    const t = romeTime();
    if (hour) hour.node.rotation.z = hour.rest - (((t.h % 12) + t.m / 60) / 12) * Math.PI * 2;
    if (minute) minute.node.rotation.z = minute.rest - ((t.m + t.s / 60) / 60) * Math.PI * 2;
    if (second) second.node.rotation.z = second.rest - (t.s / 60) * Math.PI * 2;
  });

  return (
    <group scale={model.scale}>
      <group position={model.offset}>
        <primitive object={model.object} dispose={null} />
      </group>
    </group>
  );
}

class ModelBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

/** Un GLB assente o non valido non deve interrompere il rendering della vetrina. */
export function ShowcaseModel({ url, kind, fallback, position, rotationY, scale = 1 }: {
  url: string; kind: Kind; fallback: ReactNode;
  position: [number, number, number]; rotationY: number; scale?: number;
}) {
  return (
    <ModelBoundary key={url} fallback={fallback}>
      <Suspense fallback={fallback}>
        <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
          <Model url={url} kind={kind} />
        </group>
      </Suspense>
    </ModelBoundary>
  );
}
