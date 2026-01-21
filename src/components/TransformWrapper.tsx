import React from "react";
import Control from "./Control";

type TransformWrapperProps = {
  children: React.ReactNode;
  showControls?: boolean;
  initialOpacity?: number;
  initialScale?: number;
  initialRotate?: number;
};

const TransformWrapper: React.FC<TransformWrapperProps> = ({
  children,
  showControls = true,
  initialOpacity = 1,
  initialScale = 1,
  initialRotate = 0,
}) => {
  const [opacity, setOpacity] = React.useState(initialOpacity);
  const [scale, setScale] = React.useState(initialScale);
  const [rotate, setRotate] = React.useState(initialRotate);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          opacity,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          transformOrigin: "center",
          transition: "transform 0.25s ease, opacity 0.25s ease",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </div>

      {/* Панель управления */}
      {showControls && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "#111",
            color: "#fff",
            fontSize: 12,
            borderRadius: 8,
            display: "grid",
            gap: 8,
            width: 220,
          }}
        >
          <Control
            label="Прозрачность"
            min={0}
            max={1}
            step={0.01}
            value={opacity}
            onChange={setOpacity}
          />

          <Control
            label="Масштаб"
            min={0.5}
            max={2}
            step={0.01}
            value={scale}
            onChange={setScale}
          />

          <Control
            label="Вращение"
            min={-180}
            max={180}
            step={1}
            value={rotate}
            onChange={setRotate}
          />
        </div>
      )}
    </div>
  );
};

export default TransformWrapper;