import { useAtom } from "jotai";
import { worldData } from "../../states";
import { Canvas } from "@react-three/fiber";
import {
  BakeShadows,
  Bounds,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import { WorldMap } from "./WorldMap";

export function Renderer() {
  const world = useAtom(worldData);

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [20, 20, 20] }} shadows>
      <color attach="background" args={["#252530"]} />
      <ambientLight intensity={0.01} />
      <hemisphereLight intensity={0.125} color="#8040df" groundColor="red" />
      <spotLight
        castShadow
        color="#d9dcc0"
        intensity={2}
        position={[-50, 50, 40]}
        angle={0.25}
        penumbra={1}
        shadow-mapSize={[128, 128]}
        shadow-bias={0.00005}
      />

      <Bounds fit clip observe margin={2}>
        <WorldMap />
        {/* <RoundedBox args={[10, 10, 10]} position={[0, 0, 0]} receiveShadow>
          <meshStandardMaterial roughness={1} opacity={1} color="#D6DBE0" />
        </RoundedBox> */}
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
