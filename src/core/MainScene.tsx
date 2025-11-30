import { OrbitControls } from "@react-three/drei";
import Box from "../components/Box";
import Ocean from "../components/Ocean";
import Lights from "./Lights";

const MainScene = () => {
  return (
    <>
      <Lights />
      <Box />
      <Ocean />
      <OrbitControls />
    </>
  );
};
export default MainScene;