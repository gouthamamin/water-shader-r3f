import { Canvas } from "@react-three/fiber";
import type React from "react";

const CanvasSetup = ({ children }: React.PropsWithChildren) => {

  return (
    <Canvas>
      {children}
    </Canvas>
  )
};

export default CanvasSetup;