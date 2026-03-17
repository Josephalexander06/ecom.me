import React, { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
              },
            },
          },
        },
        particles: {
          color: {
            value: "#10ced1",
          },
          links: {
            color: "#10ced1",
            distance: 150,
            enable: true,
            opacity: 0.15,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 0.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 40,
          },
          opacity: {
            value: 0.3,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 2 },
          },
        },
        responsive: [
          {
            maxWidth: 480,
            options: {
              particles: {
                number: { value: 8 },
                move: { speed: 0.3 }
              },
              interactivity: { events: { onHover: { enable: false } } }
            }
          },
          {
            maxWidth: 768,
            options: {
              particles: {
                number: { value: 20 }
              }
            }
          }
        ],
        detectRetina: true,
      }}
      className="absolute inset-0 -z-10"
    />
  );
};

export default ParticleBackground;
