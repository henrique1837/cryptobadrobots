import React,{useState,useMemo,useEffect,useCallback} from "react";
import { ethers } from "ethers";

import useConfig from "./hooks/config";
import useClient from "./hooks/useGraphClient";
import useWeb3Modal from "./hooks/useWeb3Modal";
import { AppContext, useAppState } from './hooks/useAppState'


import { addresses, abis } from "./contracts";


import Menu from "./components/Menu";
import Banner from "./components/Banner";
import MintComponent from "./components/MintComponent";
import * as s from "./styles/globalStyles";
import Team from "./components/Team";
import NFTs from "./components/NFTs";

import Footer from "./components/Footer";
import About from "./components/About";


function App() {
  const CONFIG = useConfig();
  const { state, actions } = useAppState();

  const {client,initiateClient,contractAddress,getNftsFrom,getLastNfts} = useClient();
  const {provider,coinbase,netId,loadWeb3Modal,connecting} = useWeb3Modal();
  const [contract,setContract] = useState();
  const [initiated,setInitiated] = useState();

  const [totalSupply,setTotalSupply] = useState();
  const [maxSupply,setMaxSupply] = useState();
  const [cost,setCost] = useState(CONFIG.DISPLAY_COST);
  const [nfts,setNFTs] = useState([]);
  const [myNfts,setMyNFTs] = useState([]);
  const [loaded,setLoaded] = useState();
  const [loadedCoinbase,setLoadedCoinbase] = useState();



  const getMetadata = item => {
    return(
      new Promise(async (resolve,reject) => {
        try {
          let tokenURI;
          const contractAddress = item.id.split("/")[0];
          //ERC1155
          if(item.token){
            tokenURI = item.token.uri;
          } else {
            tokenURI = item.uri;
          }
          if(!tokenURI){
            resolve({});
          }
          const uri = tokenURI.replace("ipfs://","https://ipfs.io/ipfs/");
          let metadataToken = JSON.parse(await (await fetch(uri)).text());
          resolve(JSON.stringify({
            img: metadataToken.image.replace('ipfs://',"https://ipfs.io/ipfs/"),
            name: metadataToken.name
          }))
        } catch(err){
          resolve({});
        }
      })
    )
  }

  const getLastNftsMetadatas = useCallback(async (address) => {
    try{
      let results;
      if(address){
        results = await getNftsFrom(address);
      } else {
        results = await getLastNfts();
      }
      console.log(results)
      const erc721Tokens = results.data.erc721Transfers;
      const promises = erc721Tokens.map(getMetadata);
      const newNfts = await Promise.all(promises);
      if(address){
        setMyNFTs(newNfts)
      } else {
        setNFTs(newNfts);
      }
    } catch(err){

    }
  },[nfts,contract])

  const getLastNftsMTEvents = async (from,to,tokenId) => {
    console.log(from,to,tokenId)
    if(!to || !tokenId){
      return
    }
    console.log(from,to,tokenId)
    const tokenURI = await contract.tokenURI(tokenId);
    const uri = tokenURI.replace("ipfs://","https://ipfs.io/ipfs/");
    const metadataToken = JSON.parse(await (await fetch(uri)).text());
    const obj = {
      img: metadataToken.image.replace('ipfs://',"https://ipfs.io/ipfs/"),
      name: metadataToken.name
    }
    console.log(coinbase,obj);
    if(nfts.length === 0){
      await getLastNftsMetadatas();
    }
    if(!nfts.includes(JSON.stringify(obj))){
      setNFTs([JSON.stringify(obj),...nfts]);
    }
  }

  const getMyLastNftsMTEvents = async (from,to,tokenId) => {
    if(!to || !tokenId){
      return
    }
    const tokenURI = await contract.tokenURI(tokenId);
    const uri = tokenURI.replace("ipfs://","https://ipfs.io/ipfs/");
    const metadataToken = JSON.parse(await (await fetch(uri)).text());
    const obj = {
      img: metadataToken.image.replace('ipfs://',"https://ipfs.io/ipfs/"),
      name: metadataToken.name
    }
    if(myNfts.length === 0){
      await getLastNftsMetadatas(to)
    }
    if(!myNfts.includes(JSON.stringify(obj))){
      setMyNFTs([JSON.stringify(obj),...myNfts]);
    }
  }

  const initiateContracts = async () => {

    try{
      const newSupply = await contract.totalSupply()
      const newTotalSupply = Number(newSupply);
      const newMaxSupply = Number(await contract.maxSupply());
      const newCost = Number(await contract.cost())/10**18;
      setTotalSupply(newTotalSupply);
      setMaxSupply(newMaxSupply);
      setCost(newCost);
    } catch(err){
      console.log(err)
    }

  }

  useEffect(() => {
    setLoaded(false);
    if(netId === 4){
      setContract(new ethers.Contract(addresses.nft.rinkeby,abis.nftAbi,provider))
    } else if(netId === 28) {
      setContract(new ethers.Contract(addresses.nft.rinkeby_boba,abis.nftAbi,provider))
    } /*else if(netId === 137) {
      setContract();
    }*/ else {
      setContract();
      setNFTs([]);
      setMyNFTs([]);
      return;
    }

    setNFTs([]);
    setMyNFTs([]);
    initiateClient(netId);

  },[netId]);

  useMemo(() => {
    if(contract){
      initiateContracts();
    }
  },[contract]);

  useEffect(() => {
    actions.setProvider(provider);
  },[provider]);
  useEffect(() => {
    actions.setCost(cost);
  },[cost]);
  useEffect(() => {
    actions.setLoadWeb3Modal(loadWeb3Modal);
  },[loadWeb3Modal]);
  useEffect(() => {
    actions.setCoinbase(coinbase);
  },[coinbase]);
  useEffect(() => {
    actions.setTotalSupply(totalSupply);
  },[totalSupply]);
  useEffect(() => {
    actions.setMaxSupply(maxSupply);
  },[maxSupply]);
  useEffect(() => {
    actions.setContract(contract);
  },[contract]);
  useEffect(() => {
    actions.setNetId(netId);
  },[netId]);


  useEffect(() => {
    if(nfts.length > 5){
      nfts.pop();
    }
  },[nfts]);

  useEffect(() => {
    if(myNfts.length > 5){
      myNfts.pop();
    }
  },[myNfts]);

  useEffect(() => {
    if(!loaded && client && contractAddress){
      getLastNftsMetadatas()
      .then(() => {
        setLoaded(true)
      });
    }
  },[client,contractAddress,loaded])

  useEffect(() => {
    if(!loadedCoinbase && coinbase && client && contractAddress){
      getLastNftsMetadatas(coinbase)
      .then(() => {
        setLoadedCoinbase(true)
      });
    }
  },[coinbase,client,contractAddress,loadedCoinbase])

  useMemo(() => {
    if(loaded && contract){
      const filter = contract.filters.Transfer("0x0000000000000000000000000000000000000000",null,null);
      const res = contract.on(filter, async (from,to,tokenId) => {
        console.log(from,to,tokenId)
        let eventTotalSupply = Number(await contract.totalSupply());
        setTotalSupply(eventTotalSupply);
        if(to){
          await getLastNftsMTEvents(from,to,tokenId);
        }
      });
    }
  },[loaded,contract])

  useMemo(() => {
    if(loadedCoinbase && contract && coinbase){
      const filter = contract.filters.Transfer("0x0000000000000000000000000000000000000000",coinbase,null);
      const res = contract.on(filter, async (from,to,tokenId) => {
        await getMyLastNftsMTEvents(from,to,tokenId);
      });
    }
  },[loadedCoinbase,contract,coinbase])

  return (
    <AppContext.Provider value={{ state, actions }}>

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

        <Banner title={<s.StyledLogo  ai='flex-center' src="/config/images/logo_complete.png"/>}
                subtitle={
                  contract &&
                  <>Smart Contract address: <s.StyledLink target="_blank" href={
                    netId === 4 ?
                    `${CONFIG.SCAN_LINK_RINKEBY}/${contract.address}`:
                    netId === 28 ?
                    `${CONFIG.SCAN_LINK_BOBA_RINKEBY}/${contract.address}`:
                    `${CONFIG.SCAN_LINK}/${contract.address}`
                  }>{contract.address}</s.StyledLink></>}
                   />

        <s.SpacerMedium />
        <s.Container jc="center" ai="center"
        style={{
          textAlign: "center",
          color: "var(--primary-text)",
        }}>

            <p>The badest robots of {
              netId === 4 ?
              "Rinkeby" :
              netId === 28 ?
              "Boba Rinkeby" :
              "Polygon"
            } network!</p>
            <p>Check minted NFTs at <a href={
              `${netId === 4 ?
               CONFIG.MARKETPLACE_LINK_RINKEBY :
               netId === 28 ?
               CONFIG.MARKETPLACE_LINK_BOBA_RINKEBY :
               CONFIG.MARKETPLACE_LINK}/${contract?.address}`
             } rel="noreferrer" style={{color:'darkgrey'}} target="_blank">{
               `${netId === 4 ?
                CONFIG.MARKETPLACE_RINKEBY :
                netId === 28 ?
                CONFIG.MARKETPLACE_BOBA_RINKEBY :
                CONFIG.MARKETPLACE}`
             }</a></p>

        </s.Container>

        <MintComponent />

        {
          myNfts?.length > 0 &&
          <NFTs nfts={myNfts.map(str => {return(JSON.parse(str))})} title={"Latest 5 BadRobots owned by You"} />
        }


        <s.SpacerMedium />

        <About/>

        <s.SpacerSmall/>
        {
          nfts?.length > 0 &&
          <NFTs nfts={nfts.map(str => {return(JSON.parse(str))})} title={"Latest 5 BadRobots Minted"} />
        }


        <s.SpacerLarge/>
        <center>
          <img alt={"example"} src={"/config/images/cryptobadrobots.png"} style={{width: '15%'}}/>
        </center>
        <s.SpacerSmall/>
        <Team members={[
          { img: "/config/images/11.png", name: 'BongBoy'},
          { img: "/config/images/12.png", name: 'BongMarlina'},
          { img: "/config/images/13.png", name: 'Marola'},
          { img: "/config/images/14.png", name: 'Maruca'},
        ]} />

        <s.SpacerMedium />
        <Footer />
      </s.Container>
    </AppContext.Provider>
  );
}

export default App;
