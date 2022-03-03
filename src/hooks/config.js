import { useEffect, useState } from "react";

export default function useConfig() {
  const [config, setConfig] = useState({
    CONTRACT_ADDRESS: "0x8dead658e69f0933c68383277adc9e9a205bd643",
    SCAN_LINK: "https://rinkeby.etherscan.io/token/0x8dead658e69f0933c68383277adc9e9a205bd643",
    NETWORK: {
      NAME: "Rinkeby",
      SYMBOL: "ETH",
      ID: 4,
    },
    NFT_NAME: "Crypto Bad Robots",
    SYMBOL: "CBR",
    MAX_SUPPLY: 10,
    WEI_COST: 10000000000000000,
    DISPLAY_COST: 0.01,
    GAS_LIMIT: 285000,
    MARKETPLACE: "Rarible",
    MARKETPLACE_LINK: "https://rinkeby.rarible.com/collection/0x8dead658e69f0933c68383277adc9e9a205bd643/items",
    SHOW_BACKGROUND: true,
  });


  useEffect(() => {
    getConfig();
  }, []);

    const getConfig = async () => {
      const configResponse = await fetch("/config/config.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const config = await configResponse.json();
      setConfig(config);
    };

  return config
}
