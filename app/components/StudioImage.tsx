"use client";

import Image from "next/image";
import { type ReactNode, useState } from "react";

/** Mantiene il segnaposto anche se il file è stato rimosso o non è raggiungibile. */
export function StudioImage({ src, alt, width, height, className, fallback, caption }: {
  src?: string; alt: string; width: number; height: number; className?: string; fallback: ReactNode; caption?: ReactNode;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  if (!src || failed === src) return <>{fallback}</>;
  const image = (
    <Image src={src} alt={alt} width={width} height={height} sizes={`${width}px`} className={className} onError={() => setFailed(src)} />
  );
  return caption ? (
    <figure className="studio-photo">
      {image}
      <figcaption>{caption}</figcaption>
    </figure>
  ) : image;
}
