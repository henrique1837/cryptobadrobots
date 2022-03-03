import React from "react";
import useConfig from "./hooks/config";
import Menu from "./components/Menu";
import Banner from "./components/Banner";
import MintComponent from "./components/MintComponent";
import * as s from "./styles/globalStyles";
import Team from "./components/Team";
import Footer from "./components/Footer";
import About from "./components/About";


function App() {
  const CONFIG = useConfig()
  return (
      <s.Container
        style={{ padding: 24, backgroundColor: "grey" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}

      >
        <Menu links={[
          {href: '#mint', label: "Mint"},
          {href: '#project', label: "The Project"},
          {href: '#team', label: "Team"},
        ]}/>


        <s.SpacerSmall />

        <Banner title={<s.StyledLogo  ai='flex-center' src="/config/images/logo_complete.png"/>} subtitle={`Smart Contract address: ${CONFIG.CONTRACT_ADDRESS}`} />

        <s.SpacerMedium />
        <s.Container jc="center" ai="center">
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            <p>The badest robots of Polygon network!</p>
            <p>Check minted NFTs at <a href={CONFIG.MARKETPLACE_LINK} rel="noreferrer" style={{color:'darkgrey'}} target="_blank">{CONFIG.MARKETPLACE}</a></p>

          </s.TextDescription>
        </s.Container>

        <MintComponent />

        <s.SpacerMedium />

        <About />

        <s.SpacerLarge/>

        <Team members={[
          { img: "/config/images/11.png", name: 'BongBoy'},
          { img: "/config/images/12.png", name: 'BongMarlina'},
          { img: "/config/images/13.png", name: 'Marola'},
          { img: "/config/images/14.png", name: 'Maruca'},
        ]} />

        <s.SpacerMedium />
        <Footer />
      </s.Container>
  );
}

export default App;
