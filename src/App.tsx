import { SidePanel } from "./components/sidePanel/SidePanel";
import { Canvas } from "./components/visual/Canvas";

function App() {
  return (
    <div className="flex">
      <div className="grow">
        <Canvas />
      </div>
      <div className="shrink-0">
        <SidePanel />
      </div>
    </div>
  );
}

export default App;
