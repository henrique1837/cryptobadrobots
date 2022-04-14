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



  const CONFIG = useConfig();
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [totalSupply,setTotalSupply] = useState();
  const [maxSupply,setMaxSupply] = useState();
  const [cost,setCost] = useState(CONFIG.DISPLAY_COST);


  const initiateContracts = async () => {

    try{
      const newSupply = await props.contract.totalSupply()
      const newTotalSupply = Number(newSupply);
      const newMaxSupply = Number(await props.contract.maxSupply());
      const newCost = Number(await props.contract.cost())/10**18;
      setTotalSupply(newTotalSupply);
      setMaxSupply(newMaxSupply);
      setCost(newCost);
      const filter = props.contract.filters.Transfer("0x0000000000000000000000000000000000000000",null,null);
      const res = props.contract.on(filter, async (from,to,tokenId) => {
        let eventTotalSupply = Number(await props.contract.totalSupply());
        setTotalSupply(eventTotalSupply);
        await props.getLastNftsMetadatas();
        if(props.coinbase){
          await props.getLastNftsMetadatas(props.coinbase)
        }
      });
    } catch(err){
      console.log(err)
    }

  }

  const claimNFTs = async () => {
    try{
      let totalCost = String(cost * mintAmount);
      console.log("Cost: ", totalCost);
      setFeedback(`Minting your CryptoBadRobot ...`);
      setClaimingNft(true);
      const signer = props.provider.getSigner()
      const tokenWithSigner = props.contract.connect(signer);
      const tx = await tokenWithSigner.mint(mintAmount,{
        value: ethers.utils.parseEther(totalCost.toString())
      });
      setFeedback(
        `Waiting transaction confirmation`
      );
      await tx.wait();
      setFeedback(
        `CryptoBadRobot will emerge from the apocalypse soon!`
      );
      const newTotalSupply = Number(await props.contract.totalSupply());
      setTotalSupply(newTotalSupply);
      setTimeout(() => {
        setClaimingNft(false);
        setFeedback();

      },10000)
    } catch(err){
      console.log(err);
      setFeedback(err.message);
      setClaimingNft(false);
      setTimeout(() => {
        setClaimingNft(false);
        setFeedback();

      },10000)
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


  useEffect(() => {
    if(props.contract){
      initiateContracts()
    } else {
      setTotalSupply();
      setMaxSupply();
    }
  },[props.contract])


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
              <StyledLink target={"_blank"} href={
                `${props.netId === 4 ?
                 CONFIG.SCAN_LINK_RINKEBY :
                 props.netId === 28 ?
                 CONFIG.SCAN_LINK_BOBA_RINKEBY :
                 CONFIG.SCAN_LINK}/${props.contract?.address}`
              }>
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
                <StyledLink target={"_blank"} href={
                  props.netId === 4 ?
                  CONFIG.MARKETPLACE_LINK_RINKEBY :
                  props.netId === 28 ?
                  CONFIG.MARKETPLACE_LINK_BOBA_RINKEBY :
                  CONFIG.MARKETPLACE_LINK
                }>
                  {
                    props.netId === 4 ?
                    CONFIG.MARKETPLACE_RINKEBY :
                    props.netId === 28 ?
                    CONFIG.MARKETPLACE_BOBA_RINKEBY : 
                    CONFIG.MARKETPLACE
                  }
                </StyledLink>
              </>
            ) : (
              <>
                <TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {cost}{" "}
                  {
                    props.netId === 4 ?
                    "ETH" :
                    "MATIC"
                  }
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
                        wordBreak: "break-word"
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
