import React from "react";
import tw from "twin.macro";
import About from "./About";
import Footer from "./Footer";
import Hero from "./Hero";
import Social from "./Social";

export default function App() {
  return (
    <React.Fragment>
      <div css={tw`h-screen`}>
        <Hero />
        <Social />
        <About />
        <Footer />
      </div>
    </React.Fragment>
  );
}
