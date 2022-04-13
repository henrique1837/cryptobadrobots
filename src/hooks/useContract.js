import { useMemo, useState,useCallback } from "react";
import { addresses, abis } from "../contracts";
import { ethers } from "ethers";

import useWeb3Modal from './useWeb3Modal';

function useContract() {

  const {provider,netId} = useWeb3Modal();
  const [contract,setContract] = useState()

  useMemo(() => {
    if(!contract && provider && netId){
      if(netId === 4){
        setContract(new ethers.Contract(addresses.nft.rinkeby,abis.nftAbi,provider))
      } else if(netId === 28) {
        setContract(new ethers.Contract(addresses.nft.rinkeby_boba,abis.nftAbi,provider))
      } /* else if(netId === 288){
        setContract(new ethers.Contract(addresses.nft.boba,abis.nftAbi,provider))
      }
      */
    }
  },[contract,provider,netId])



  return({contract})
}

export default useContract;
