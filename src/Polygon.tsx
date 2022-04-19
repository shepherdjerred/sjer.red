import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function Polygon() {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const current = ref.current as any;
    current.rotation.x += 0.01;
    current.rotation.y += 0.01;
  });
  return (
    <mesh
      ref={ref}
      scale={2}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <icosahedronGeometry args={[1, 0, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
