"use client";

import Hotspot from "../Hotspot";
import DryingLine from "../objects/DryingLine";
import Envelope from "../objects/Envelope";
import Phone from "../objects/Phone";
import Shelf from "../objects/Shelf";
import Bookcase from "../studio/Bookcase";
import Chalkboard from "../studio/Chalkboard";
import DarkroomCorner, { CornerSafelight } from "../studio/DarkroomCorner";
import Desk from "../studio/Desk";
import GamingTv from "../studio/GamingTv";
import HiFi from "../studio/HiFi";
import PhotoWall from "../studio/PhotoWall";
import Posters from "../studio/Posters";
import StudioLights from "../studio/StudioLights";
import StudioShell from "../studio/StudioShell";
import { StudioFinishes } from "../studio/StudioFinishes";

/** Mezzo giro attorno all'asse verticale: porta sulla parete sinistra gli oggetti modellati per quella destra. */
const TO_LEFT_WALL: [number, number, number] = [0, Math.PI, 0];

/**
 * Lo studio: un'unica stanza dove convivono codice, passioni e fotografia.
 * Il filo delle stampe attraversa la parete di fondo, l'angolo della camera oscura è in fondo
 * a destra, e la luce di sicurezza può trasformare tutta la stanza in camera oscura.
 */
export default function StudioRoom() {
  return (
    <StudioFinishes>
      <StudioLights />
      <CornerSafelight />
      <StudioShell />

      <Hotspot id="lavori" dotOffset={[0, 0.32, 0.05]}>
        <DryingLine />
      </Hotspot>
      <Hotspot id="scrivania" dotOffset={[0.15, 0.4, 0]}>
        <Desk />
      </Hotspot>
      <Hotspot id="servizi" dotOffset={[0, 0.32, 0.15]}>
        <DarkroomCorner />
      </Hotspot>
      <Hotspot id="chi-sono" dotOffset={[0.1, 0.38, 0.3]}>
        {/* Mensola e bacheca stanno sopra la scrivania, sulla parete sinistra */}
        <group rotation={TO_LEFT_WALL} position={[0, 0, -0.6]}>
          <Shelf />
        </group>
      </Hotspot>
      <Hotspot id="cv" dotOffset={[0, 0.16, 0]}>
        <Envelope position={[-2.13, 0.742, 0.12]} rotationY={0.86} />
      </Hotspot>
      <Hotspot id="contatti" dotOffset={[0.05, 0.24, 0]}>
        <group rotation={TO_LEFT_WALL} position={[0, 0, 1.5]}>
          <Phone />
        </group>
      </Hotspot>
      <Hotspot id="adesso" dotOffset={[0.05, 0.24, 0]}>
        <Chalkboard />
      </Hotspot>

      <Hotspot id="libreria" dotOffset={[0, 0.95, 0.25]}>
        <Bookcase />
      </Hotspot>
      <Hotspot id="musica" dotOffset={[0, 0.25, 0.2]}>
        <HiFi />
      </Hotspot>
      <Hotspot id="cinema" dotOffset={[0, 0.3, 0.1]}>
        <Posters />
      </Hotspot>
      <Hotspot id="fotografie" dotOffset={[-0.1, 0.42, 0]}>
        <PhotoWall />
      </Hotspot>
      <Hotspot id="gioco" dotOffset={[-0.1, 0.35, 0]}>
        <GamingTv />
      </Hotspot>
    </StudioFinishes>
  );
}
