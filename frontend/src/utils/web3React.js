import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'

const POLLING_INTERVAL = 12000
const rpcUrl = 'https://mainnet.infura.io/v3/a47cfbd514324d3f866b5610325b047e'
const chainId = 1

const injected = new InjectedConnector({ supportedChainIds: [chainId] })

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

const bscConnector = new BscConnector({ supportedChainIds: [chainId] })

// TODO move this enum to the uikit

export const connectorsByName = {
  "injected": injected,
  "walletconnect": walletconnect,
  "bsc": bscConnector,
}

export const getLibrary = (provider) => {
  return provider
}

export const change = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
    document.location.reload();
  } catch (e) {
    if(e.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x1",
            chainName: "Ethereum Mainnet",
            nativeCurrency: {
              symbol: "CLO",
              decimals: 18,
            },
            rpcUrls: ["https://mainnet.infura.io/v3/a47cfbd514324d3f866b5610325b047e"],
          },
        ],
      });  
    }
  }
};