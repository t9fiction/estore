import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// WalletConnect project ID - you'll need to get this from https://cloud.walletconnect.com
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
})

// Network configurations
export const supportedNetworks = {
  [mainnet.id]: {
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    color: '#627EEA',
  },
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    color: '#627EEA',
  },
  [polygon.id]: {
    name: 'Polygon',
    symbol: 'MATIC',
    color: '#8247E5',
  },
  [polygonMumbai.id]: {
    name: 'Polygon Mumbai',
    symbol: 'MATIC',
    color: '#8247E5',
  },
}

export const getNetworkName = (chainId) => {
  return supportedNetworks[chainId]?.name || 'Unknown Network'
}

export const getNetworkColor = (chainId) => {
  return supportedNetworks[chainId]?.color || '#666666'
}
