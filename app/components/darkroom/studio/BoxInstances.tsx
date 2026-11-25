import { useLayoutEffect, useRef } from "react";
import { Color, type InstancedMesh, Object3D } from "three";
import type { Vec3 } from "@/lib/darkroom/hotspots";

export interface BoxInstance {
  position: Vec3;
  size: Vec3;
  color: string;
}

export function BoxInstances({ boxes, shadow = false }: { boxes: readonly BoxInstance[]; shadow?: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const current = mesh.current;
    if (!current) return;
    const transform = new Object3D();
    const tint = new Color();
    boxes.forEach(({ position, size, color }, i) => {
      transform.position.set(...position);
      transform.scale.set(...size);
      transform.updateMatrix();
      current.setMatrixAt(i, transform.matrix);
      current.setColorAt(i, tint.set(color));
    });
    current.instanceMatrix.needsUpdate = true;
    if (current.instanceColor) current.instanceColor.needsUpdate = true;
    current.computeBoundingSphere();
  }, [boxes]);

  if (boxes.length === 0) return null;
  // Tasti e dorsi condividono una sola geometria e un solo materiale.
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, boxes.length]} castShadow={shadow} receiveShadow>
      <boxGeometry />
      <meshStandardMaterial roughness={0.72} />
    </instancedMesh>
  );
}
