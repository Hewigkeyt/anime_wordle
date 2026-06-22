import { useMemo } from "react";
import "./Sakura.css";

const PETAL_COUNT = 20;

export default function Sakura() {
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => ({
        id: i,
        left:  Math.random() * 100,
        delay: Math.random() * 3,
        dur:   3 + Math.random() * 4,
        size:  8 + Math.random() * 14,
        rot:   Math.random() * 360,
      })),
    []
  );

  return (
    <div className="sakura" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="sakura__petal"
          style={{
            left:             `${p.left}%`,
            width:            p.size,
            height:           p.size,
            animationDuration: `${p.dur}s`,
            animationDelay:   `${p.delay}s`,
            transform:        `rotate(${p.rot}deg)`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="#f9a8d4" opacity="0.85">
            <path d="M12 2 C14 6 18 8 12 12 C6 8 10 6 12 2Z" />
            <path d="M12 2 C16 4 18 10 12 12 C6 10 8 4 12 2Z" fill="#fbcfe8" />
          </svg>
        </div>
      ))}
    </div>
  );
}
