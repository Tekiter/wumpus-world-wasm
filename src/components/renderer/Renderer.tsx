import { Canvas } from "@react-three/fiber";
import { BakeShadows, Bounds, OrbitControls } from "@react-three/drei";
import { WorldMap } from "./WorldMap";
import { Player } from "./Player";
import { useAtomValue } from "jotai";
import { gameStateAtom } from "../../states/game";
import { Suspense } from "react";

export function Renderer() {
  const gameState = useAtomValue(gameStateAtom);

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [20, 20, 20] }} shadows>
      <color attach="background" args={["#252530"]} />
      <ambientLight intensity={0.01} />
      <hemisphereLight intensity={0.125} color="#8040df" groundColor="red" />
      <spotLight
        castShadow
        color="#d9dcc0"
        intensity={1.5}
        position={[-50, 50, 40]}
        angle={0.25}
        penumbra={1}
        shadow-mapSize={[128, 128]}
        shadow-bias={0.00005}
      />
      <directionalLight color="#b1c1da" intensity={0.5} position={[3, 2, 3]} />

      <Bounds fit clip observe margin={1.5}>
        <WorldMap />
        {gameState.type !== "idle" && gameState.type !== "ended" && <Player />}
      </Bounds>

      <BakeShadows />

      <OrbitControls
        makeDefault
        minAzimuthAngle={0}
        maxAzimuthAngle={Math.PI / 2}
        minPolarAngle={(Math.PI * 1.5) / 6}
        maxPolarAngle={(Math.PI * 1.5) / 6}
        enableZoom={true}
        enablePan={true}
        zoomSpeed={0.3}
      />
      <mesh
        scale={200}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -4, 0]}
        receiveShadow
      >
        <planeGeometry />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>
    </Canvas>
  );
}
