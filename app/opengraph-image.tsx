import { ImageResponse } from "next/og";

export const alt = "Digital Chautari \u2014 Digital. Together.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 72, background: "#FBFBF9", color: "#101826" }}>
      <div style={{ fontSize: 30, fontWeight: 600, color: "#0B6F66" }}>Digital. Together.</div>
      <div style={{ fontSize: 76, fontWeight: 800, marginTop: 24, background: "linear-gradient(90deg, #0F9488, #E0A930, #7FAE3A)", backgroundClip: "text", color: "transparent" }}>Digital Chautari</div>
      <div style={{ fontSize: 30, marginTop: 20, color: "#5B6472" }}>A Kathmandu-based digital agency.</div>
    </div>,
    { ...size },
  );
}
