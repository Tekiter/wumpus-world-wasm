import { SidePanel } from "./components/sidePanel/SidePanel";
import { Renderer } from "./components/renderer/Renderer";

function App() {
  return (
    <div className="h-screen">
      <div className="flex justify-stretch h-full">
        <div className="grow shrink h-full relative">
          <div className="bg-stone-300 absolute inset-0">
            <Renderer />
          </div>
        </div>
        <div className="shrink-0 w-96">
          <SidePanel />
        </div>
      </div>
    </div>
  );
}

export default App;
