/**
 * Le immagini dei servizi esterni passano dall'ottimizzatore di Next: arrivano dallo stesso
 * dominio (utilizzabili come texture WebGL senza problemi di CORS), ridimensionate e in cache.
 * Gli host ammessi sono in next.config.ts → images.remotePatterns.
 */
export type ProxyWidth = 128 | 256 | 384 | 640;

export function proxied(url: string, width: ProxyWidth = 384): string {
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=75`;
}
