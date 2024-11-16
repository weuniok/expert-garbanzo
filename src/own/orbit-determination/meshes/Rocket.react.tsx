/** @jsxImportSource react */

import { type MeshProps, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const Rocket = ({ ...props }: MeshProps) => {
  const gltf = useLoader(
    GLTFLoader,
    "src/images/orbit-determination/rocket.gltf",
  );

  return (
    <mesh {...props}>
      <mesh position={[0, -50, 0]}>
        <primitive object={gltf.scene} />
      </mesh>
    </mesh>
  );
};