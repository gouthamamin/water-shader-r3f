import Box from "./components/Box";
import CanvasSetup from "./core/CanvasSetup";
import Lights from "./core/Lights";

const App = () => {
  return (
    <CanvasSetup>
      <Lights />
      <Box />
    </CanvasSetup>
  );
};

export default App
