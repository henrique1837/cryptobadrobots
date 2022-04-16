import React from 'react'
import { Container, ResponsiveWrapper, Screen, TextDescription, TextTitle,StyledLink } from "../styles/globalStyles"

export default function About() {
  return <Screen id="project" >
  <ResponsiveWrapper
    style={{
      textAlign: "left",
      color: "var(--primary-text)",
      padding: 24,
    }}
    flex={1}
  >
    <Container flex={1} style={{ margin: 'auto'}}>
      <TextTitle style={{
        fontSize: 50
      }}>
        About
      </TextTitle>
      <div style={{
        fontSize: 20
      }}>
        <p>Buy your robot and be bad! Crypto Bad Robots!!!! You never forget them cause they will be part of your nightmares!</p>
        <p>Bad Robot Bad Robot Bad Crypto Robot!</p>
        <p>Robots IDs are generated using <StyledLink target={"_blank"} href={'https://docs.chain.link/docs/chainlink-vrf/'} rel="noreferrer" style={{color: 'darkgrey'}}>Chainlink VRF</StyledLink></p>

        <p>Dont be shy, let's kill others NFTs at <StyledLink target={"_blank"} href={'https://thevibes--space-crypto.ipns.dweb.link/#/badrobots-v0'} rel="noreferrer" style={{color: 'darkgrey'}}>TheVibes Space</StyledLink></p>
      </div>
    </Container>
    <Container flex={1} ai="end" style={{ margin: 'auto'}}>
      <center>
        <img alt={"CryptoBadRobots"} src={"/config/images/badrobots.jpeg"} style={{width: '90%',borderRadius:'25%'}}/>
      </center>
    </Container>
  </ResponsiveWrapper>

</Screen>
}
