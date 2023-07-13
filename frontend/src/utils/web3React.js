import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'

const POLLING_INTERVAL = 12000
const rpcUrl = 'https://rpc.callisto.network/'
const chainId = 820

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

export const changeChain = async (chainId, chainName, symbol, decimals, rpc) => {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId,
          chainName,
          nativeCurrency: {
            symbol,
            decimals,
          },
          rpcUrls: [rpc],
        },
      ],
    });  
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  } catch (e) {
  }
};