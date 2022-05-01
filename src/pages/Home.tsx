import React from "react";
import tw from "twin.macro";
import Hero from "../components/Hero";
import Links from "../components/Links";
import About from "../components/About";
import Footer from "../components/Footer";
import Faq from "../components/Faq";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <React.Fragment>
      <div css={tw`h-screen`}>
        <Hero />
        <Links />
        <About />
        <Faq />
        <Contact />
        <Footer />
      </div>
    </React.Fragment>
  );
}
