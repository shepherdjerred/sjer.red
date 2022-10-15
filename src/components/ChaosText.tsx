import ChaosLetter from "./ChaosLetter";
import React from "react";

export default function ChaosText({ text }: { text: string }) {
  const chaosText = text.split("").map((char) => {
    return <ChaosLetter key={char}>{char}</ChaosLetter>;
  });
  return <React.Fragment>{chaosText}</React.Fragment>;
}
