import React from "react";
import tw from "twin.macro";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: unknown) {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <h1 css={tw`font-mono place-self-center`}>Something went wrong.</h1>
      );
    }

    return this.props.children;
  }
}
