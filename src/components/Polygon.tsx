import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function Polygon() {
  const ref = useRef();
  const [isHovered, setHovered] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const [multiplier, setMultiplier] = useState(0.035);
  useFrame(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const current = ref.current as any;
    if (!isClicked) {
      current.rotation.x += Math.random() * multiplier;
      current.rotation.y += Math.random() * multiplier;
    }
    if (isHovered) {
      setMultiplier(multiplier * 1.01);
    } else {
      if (multiplier > 0.035) {
        setMultiplier(multiplier * 0.99);
      }
    }
  });
  return (
    <mesh
      ref={ref}
      scale={2.3}
      onClick={() => setClicked(!isClicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <icosahedronGeometry args={[1, 0, 1]} />
      <meshStandardMaterial color={isHovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
