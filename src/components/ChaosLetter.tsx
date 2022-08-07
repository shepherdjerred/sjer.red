import styled from "@emotion/styled";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface ChaosLetterProps {
  children: React.ReactNode;
}

export default function ChaosLetter(props: ChaosLetterProps) {
  const left = getRandomInt(0, 1).toString();
  const top = getRandomInt(0, 1).toString();
  const Span = styled.span(() => ({
    marginTop: `${top}rem`,
    marginLeft: `${left}rem`,
  }));
  return <Span>{props.children}</Span>;
}
