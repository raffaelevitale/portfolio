import type { Viewport } from "next";
import Darkroom from "./components/darkroom/Darkroom";
import "./components/darkroom/darkroom.css";
import "./components/darkroom/darkroom-hud.css";
import "./components/darkroom/darkroom-panel.css";
import "./components/darkroom/darkroom-studio.css";
import "./components/darkroom/darkroom-mobile.css";

export const viewport: Viewport = { themeColor: "#0b0807", viewportFit: "cover" };

export default function Home() {
  return <Darkroom />;
}
