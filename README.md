# search-fields
Five animated search components, free to use. Each is one self-contained React file with no dependencies — paste it in and it runs.

Built by Emil Talas. Live gallery: https://www.emiltalas.com

Run it in the browser, no install: Open in StackBlitz

The five
Component	What it does
Packet	A light packet walks the border. The first keystroke bursts it inward.
Iris	Sits as an icon. Click it and the frame extends into a field.
Ascender	Suggestions rise above the field, never below.
Relay	A composer: mode, model, send. Click the equaliser to light the border.
Nexus	All three at once — an icon that morphs open, a lit border the first keystroke bursts, and suggestions rising above.
Use one

Each file is a default export. Copy it into your project and render it:

jsx
import Packet from "./Packet"

export default function App() {
  return <Packet />
}

Every colour, the typography and the timings are props with sensible defaults, so you can drop it in as-is or theme it to your own palette:

jsx
<Packet
  fill="#121316"
  border="#1F2023"
  textColor="#F3F4F6"
  font="Inter, sans-serif"
  fontSize={16}
/>
Requirements
React 17 or newer.
No other dependencies. The animations use the canvas and requestAnimationFrame directly, and pause themselves when there is nothing to draw.
Notes
The moving border light is a canvas effect, so it is React-only. A plain HTML + CSS version of the resting field is available from the live gallery's copy menu if you don't need the animation.
The components respect prefers-reduced-motion.
Licence

MIT — free to use, no attribution required. Credit is welcome, never expected. See LICENSE.
