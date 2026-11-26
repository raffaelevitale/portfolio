"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

const loader = new THREE.TextureLoader();
const MAX_TEXTURE_SIZE = 512;

/**
 * Carica un'immagine remota come texture senza sospendere la scena: finché non arriva
 * (o se fallisce) restituisce null e l'oggetto mostra il suo aspetto di riserva.
 */
export function useRemoteTexture(url: string | null): THREE.Texture | null {
  const [result, setResult] = useState<{ url: string; texture: THREE.Texture } | null>(null);

  useEffect(() => {
    if (!url) {
      setResult(null);
      return;
    }
    let alive = true;
    let loaded: THREE.Texture | null = null;
    loader.load(
      url,
      (texture) => {
        if (!alive) {
          texture.dispose();
          return;
        }
        let mapped: THREE.Texture = texture;
        const image = texture.image;
        const scale = MAX_TEXTURE_SIZE / Math.max(image.naturalWidth, image.naturalHeight);
        if (scale < 1) {
          // Anche una copertina aggiunta a mano resta entro il limite WebGL dello studio.
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            texture.dispose();
            return;
          }
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          mapped = new THREE.CanvasTexture(canvas);
          texture.dispose();
        }
        mapped.colorSpace = THREE.SRGBColorSpace;
        mapped.anisotropy = 4;
        loaded = mapped;
        setResult({ url, texture: mapped });
      },
      undefined,
      () => {
        if (alive) setResult(null);
      },
    );
    return () => {
      alive = false;
      loaded?.dispose();
    };
  }, [url]);

  return result?.url === url ? result.texture : null;
}

/** Carica un'immagine (stesso dominio) da disegnare dentro una texture canvas. */
export function useImage(url: string | null): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!url) {
      setImage(null);
      return;
    }
    let alive = true;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => alive && setImage(img);
    img.onerror = () => alive && setImage(null);
    img.src = url;
    return () => {
      alive = false;
    };
  }, [url]);

  return image;
}

/** Ritaglia la foto al formato della stampa, come object-fit: cover. */
export function useCoverFit(texture: THREE.Texture | null, aspect: number): THREE.Texture | null {
  const fitted = useMemo(() => {
    if (!texture) return null;
    const image = texture.image as { width?: number; height?: number } | undefined;
    const ratio = (image?.width ?? 1) / Math.max(1, image?.height ?? 1);
    const copy = texture.clone();
    if (ratio > aspect) {
      copy.repeat.set(aspect / ratio, 1);
      copy.offset.set((1 - aspect / ratio) / 2, 0);
    } else {
      copy.repeat.set(1, ratio / aspect);
      copy.offset.set(0, (1 - ratio / aspect) / 2);
    }
    copy.needsUpdate = true;
    return copy;
  }, [texture, aspect]);
  useEffect(() => () => fitted?.dispose(), [fitted]);
  return fitted;
}
