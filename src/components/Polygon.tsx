import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function Polygon() {
  const ref = useRef();
  const [isHovered, setHovered] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const [multiplier, setMultiplier] = useState(0.035);
  const [direction, setDirection] = useState(0);
  const [marker, setMarker] = useState(true);
  useFrame(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const current = ref.current as any;
    if (!isClicked) {
      if (Math.random() > 0.5) {
        if (marker == true) {
          setDirection(direction + 0.1);
        }
      } else {
        if (marker == false) {
          setDirection(direction - 0.1);
        }
      }

      if (direction < -17) {
        setMarker(true);
      } else if (direction > 17) {
        setMarker(false);
      }

      current.rotation.x += (direction / 11) * multiplier;
      current.rotation.y += (direction / 11) * multiplier;
    }
    if (isHovered) {
      setMultiplier(multiplier * 1.05);
    } else {
      if (multiplier > 0.035) {
        setMultiplier(multiplier * 0.95);
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
