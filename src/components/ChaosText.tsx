import "react";
import ChaosLetter from "./ChaosLetter";

export default function ChaosText({ text }: { text: string }) {
  const chaosText = text.split("").map((char) => {
    return <ChaosLetter key={char}>{char}</ChaosLetter>;
  });
  return <>{chaosText}</>;
}
