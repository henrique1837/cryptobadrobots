import React, { useEffect,useMemo, useState } from 'react'
import { ethers } from "ethers";

import {
  Container,
  ResponsiveWrapper,
  SpacerLarge,
  SpacerMedium,
  SpacerSmall,
  SpacerXSmall,
  StyledButton,
  StyledLink,
  StyledRoundButton,
  TextDescription,
  TextTitle
} from "../styles/globalStyles"
import useConfig from '../hooks/config';


const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;


export default function MintComponent(props) {

  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [totalSupply,setTotalSupply] = useState();
  const [maxSupply,setMaxSupply] = useState();

  const CONFIG = useConfig()


  useEffect(async () => {
    if(props.contract){
      props.contract.totalSupply()
      .then(async supply => {
        const newTotalSupply = Number(supply);
        const newMaxSupply = Number(await props.contract.maxSupply());
        setTotalSupply(newTotalSupply);
        setMaxSupply(newTotalSupply);

        const filter = props.contract.filters.Transfer("0x0000000000000000000000000000000000000000",null,null);
        const res = props.contract.on(filter, async (from,to,tokenId) => {
          const newTotalSupply = Number(await props.contract.totalSupply());
          setTotalSupply(newTotalSupply);
        });
      })
      .catch(err => {
        console.log(err)
      })
    }
  },[props.contract])



  const claimNFTs = async () => {
    try{
      let cost = 0.01;
      let totalCost = String(cost * mintAmount);
      console.log("Cost: ", totalCost);
      setFeedback(`Minting your CryptoBadRobot ...`);
      setClaimingNft(true);
      const signer = props.provider.getSigner()
      const tokenWithSigner = props.contract.connect(signer);
      const tx = await tokenWithSigner.mint(mintAmount,{
        value: ethers.utils.parseEther(totalCost.toString())
      });

      await tx.wait();
      setFeedback(
        `WOW, the CryptoBadRobot is yours! It will appears from the apocalypse soon!`
      );
    } catch(err){
      console.log(err);
      setFeedback(err.message);
      setClaimingNft(false);
    }
  };

  const changeMintAmount = (e, number) => {
    e.preventDefault()
    let newMintAmount = mintAmount + number;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    } else if (newMintAmount > 5) {
      newMintAmount = 5;
    }
    setMintAmount(newMintAmount);
  };



  return (
    <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{ padding: 24, borderRadius: 24 }}
            id="mint"
          >
            <TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {totalSupply ? totalSupply : 0 } / {maxSupply ? maxSupply : 0}
            </TextTitle>
            <TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={`${CONFIG.SCAN_LINK}/${props.contract?.address}`}>
                {props.contract && truncate(props.contract?.address, 15)}
              </StyledLink>
            </TextDescription>
            <SpacerSmall />
            {Number(totalSupply) >= Number(maxSupply) ? (
              <>
                <TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </TextTitle>
                <TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </TextDescription>
                <SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </TextTitle>
                <SpacerXSmall />
                <TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fee
                </TextDescription>
                <SpacerSmall />
                {
                  !props.coinbase ||
                  !props.contract ? (
                  <Container ai={"center"} jc={"center"}>
                    <TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </TextDescription>
                    <SpacerSmall />

                    <StyledButton
                      onClick={async (e) => {
                        e.preventDefault();
                        await props.loadWeb3Modal();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {
                        props.err &&
                        <>
                          <SpacerSmall />
                          <TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {props.err.message}
                          </TextDescription>
                        </>
                    }
                  </Container>
                ) : (
                  <>
                    <TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </TextDescription>
                    <SpacerMedium />
                    <Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => changeMintAmount(e, -1)}
                      >
                        -
                      </StyledRoundButton>
                      <SpacerMedium />
                      <TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </TextDescription>
                      <SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => changeMintAmount(e, 1)}
                      >
                        +
                      </StyledRoundButton>
                    </Container>
                    <SpacerSmall />
                    <Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={async (e) => {
                          e.preventDefault();
                          await claimNFTs();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </Container>
                  </>
                )}
              </>
            )}
            <SpacerMedium />
          </Container>
          <SpacerLarge />
        </ResponsiveWrapper>
  )
}
