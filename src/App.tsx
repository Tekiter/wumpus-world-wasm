import { useAtom } from "jotai";
import { worldData } from "./states";
import { useAgent } from "./agent/useAgent";

function App() {
  const agent = useAgent();
  const [world, setWorld] = useAtom(worldData);

  return (
    <div>
      <button
        onClick={() =>
          agent.run({
            breeze: false,
            bump: false,
            glitter: false,
            scream: false,
            stench: false,
          })
        }
      >
        gogo
      </button>
    </div>
  );
}

export default App;
