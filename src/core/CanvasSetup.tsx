import { Canvas } from "@react-three/fiber";
import type React from "react";

const CanvasSetup = ({ children }: React.PropsWithChildren) => {

  return (
    <Canvas camera={{
      position: [0, 10, 20],
      fov: 60,
      near: 0.1,
      far: 1000
    }}>
      {children}
    </Canvas>
  )
};

export default CanvasSetup;