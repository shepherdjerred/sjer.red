import Hero from "../components/Hero";
import Links from "../components/Links";
import About from "../components/About";
import Faq from "../components/Faq";
import FooterWrapper from "../components/FooterWrapper";

export default function Home() {
  document.title = "Jerred Shepherd";
  return (
    <FooterWrapper>
      <Hero />
      <Links />
      <About />
      <Faq />
    </FooterWrapper>
  );
}
