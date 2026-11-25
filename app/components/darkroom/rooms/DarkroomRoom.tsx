"use client";

import Hotspot from "../Hotspot";
import Lights from "../Lights";
import DryingLine from "../objects/DryingLine";
import Envelope from "../objects/Envelope";
import LightTable from "../objects/LightTable";
import Phone from "../objects/Phone";
import Props from "../objects/Props";
import RevolvingDoor from "../objects/RevolvingDoor";
import Room from "../objects/Room";
import Shelf from "../objects/Shelf";
import Trays from "../objects/Trays";

/** La camera oscura: luce rossa, stampe, bagni. La porta in fondo a sinistra porta allo studio. */
export default function DarkroomRoom() {
  return (
    <>
      <Lights />
      <Room />
      <Props />
      <Hotspot id="lavori" dotOffset={[0, 0.42, 0.05]}>
        <DryingLine />
      </Hotspot>
      <Hotspot id="processo" dotOffset={[0, 0.16, 0.2]}>
        <Trays />
      </Hotspot>
      <Hotspot id="servizi" dotOffset={[0.1, 0.22, 0]}>
        <LightTable />
      </Hotspot>
      <Hotspot id="chi-sono" dotOffset={[0, 0.32, 0.2]}>
        <Shelf />
      </Hotspot>
      <Hotspot id="cv" dotOffset={[0, 0.14, 0]}>
        <Envelope />
      </Hotspot>
      <Hotspot id="contatti" dotOffset={[0, 0.24, 0]}>
        <Phone />
      </Hotspot>
      <Hotspot id="porta-studio" dotOffset={[0.4, 0.1, 0.4]}>
        <RevolvingDoor
          x={-2.05}
          z={-1.5}
          facing={Math.PI / 4}
          sign="STUDIO →"
          signColor="#f2b56b"
          leak="#ffb066"
          hotspotId="porta-studio"
        />
      </Hotspot>
    </>
  );
}
