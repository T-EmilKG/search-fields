import React from "react"
import { createRoot } from "react-dom/client"

// The components live at the repo root, one folder up from /src.
import Packet from "../Packet.jsx"
import Iris from "../Iris.jsx"
import Ascender from "../Ascender.jsx"
import Relay from "../Relay.jsx"
import Nexus from "../Nexus.jsx"

const wrap = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "64px 24px 96px",
  fontFamily: "Poppins, sans-serif",
  color: "#f3f4f6",
  display: "flex",
  flexDirection: "column",
  gap: 56,
}
const label = {
  font: "500 12px/1 Poppins, sans-serif",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#6b7280",
  marginBottom: 20,
}
const card = {
  border: "1px solid #1f2023",
  borderRadius: 20,
  background: "#0c0d0e",
  padding: 32,
}

function Row({ name, children }) {
  return (
    <div style={card}>
      <div style={label}>{name}</div>
      {children}
    </div>
  )
}

function App() {
  return (
    <div style={wrap}>
      <div>
        <h1 style={{ margin: 0, fontWeight: 600, fontSize: 32 }}>Search Fields</h1>
        <p style={{ margin: "8px 0 0", color: "#9ca3af", fontSize: 16 }}>
          Five animated search components, free to use. Type in them, open them, click around.
        </p>
      </div>
      <Row name="01 · Packet"><Packet /></Row>
      <Row name="02 · Iris"><Iris /></Row>
      <Row name="03 · Ascender"><Ascender /></Row>
      <Row name="04 · Relay"><Relay /></Row>
      <Row name="05 · Nexus"><Nexus /></Row>
    </div>
  )
}

createRoot(document.getElementById("root")).render(<App />)
