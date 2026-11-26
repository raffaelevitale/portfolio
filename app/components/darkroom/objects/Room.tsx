/**
 * Pianta dello studio (metri):
 *   x  -2.6 … 2.6   (parete sinistra … parete destra)
 *   z  -2.0 … 6.5   (parete di fondo … dietro la camera)
 *   y   0   … 2.85
 */
export const ROOM = { minX: -2.6, maxX: 2.6, backZ: -2, frontZ: 6.5, height: 2.85 } as const;
