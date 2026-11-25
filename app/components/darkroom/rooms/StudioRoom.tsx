"use client";

import Hotspot from "../Hotspot";
import RevolvingDoor from "../objects/RevolvingDoor";
import Bookcase from "../studio/Bookcase";
import Desk from "../studio/Desk";
import GamingTv from "../studio/GamingTv";
import HiFi from "../studio/HiFi";
import Posters from "../studio/Posters";
import Showcase from "../studio/Showcase";
import StudioLights from "../studio/StudioLights";
import StudioShell from "../studio/StudioShell";
import { StudioFinishes } from "../studio/StudioFinishes";

/** Lo studio: il lato da sviluppatore e le passioni. La porta in fondo a destra riporta in camera oscura. */
export default function StudioRoom() {
  return (
    <StudioFinishes>
      <StudioLights />
      <StudioShell />
      <Hotspot id="libreria" dotOffset={[0, 0.95, 0.25]}>
        <Bookcase />
      </Hotspot>
      <Hotspot id="musica" dotOffset={[0, 0.25, 0.2]}>
        <HiFi />
      </Hotspot>
      <Hotspot id="cinema" dotOffset={[0, 0.3, 0.1]}>
        <Posters />
      </Hotspot>
      <Hotspot id="scrivania" dotOffset={[0.15, 0.4, 0]}>
        <Desk />
      </Hotspot>
      <Hotspot id="vetrina" dotOffset={[-0.1, 0.8, 0]}>
        <Showcase />
      </Hotspot>
      <Hotspot id="gioco" dotOffset={[-0.1, 0.35, 0]}>
        <GamingTv />
      </Hotspot>
      <Hotspot id="porta-camera" dotOffset={[-0.4, 0.1, 0.4]}>
        <RevolvingDoor
          x={2.05}
          z={-1.5}
          facing={-Math.PI / 4}
          sign="CAMERA OSCURA"
          signColor="#ff5a43"
          leak="#ff2a10"
          hotspotId="porta-camera"
        />
      </Hotspot>
    </StudioFinishes>
  );
}
