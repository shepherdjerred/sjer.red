import Hero from "../components/Hero";
import Links from "../components/Links";
import About from "../components/About";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import FooterWrapper from "../components/FooterWrapper";

export default function Home() {
  return (
    <FooterWrapper>
      <Hero />
      <Links />
      <About />
      <Faq />
      <Contact />
    </FooterWrapper>
  );
}
