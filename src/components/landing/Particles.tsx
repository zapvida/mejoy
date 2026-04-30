// src/components/landing/Particles.tsx
import { Particles } from "@tsparticles/react";
import type { FC } from "react";

const Particulas: FC = () => {
  return (
    <Particles
      id="tsparticles"
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      options={{
        fullScreen: { enable: false },
        background: { color: "transparent" },
        particles: {
          number: { value: 60, density: { enable: true } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.5 },
          size: { value: 2 },
          move: {
            enable: true,
            speed: 0.6,
            direction: "none",
            outModes: { default: "out" },
          },
          links: {
            enable: true,
            distance: 120,
            color: "#ffffff",
            opacity: 0.3,
            width: 1,
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: ["repulse", "bubble", "attract"] },
            resize: { enable: true, delay: 0.5 },
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            bubble: { distance: 120, size: 6, duration: 2, opacity: 1 },
            attract: { distance: 150, duration: 0.4, factor: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default Particulas;