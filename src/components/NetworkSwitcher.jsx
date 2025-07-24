import React, { useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { supportedNetworks } from '../config/web3'
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains'

const NetworkSwitcher = ({ currentNetwork }) => {
  const { switchNetwork, chainId } = useWallet()
  const [showNetworks, setShowNetworks] = useState(false)

  const networks = [
    { ...supportedNetworks[mainnet.id], chainId: mainnet.id },
    { ...supportedNetworks[sepolia.id], chainId: sepolia.id },
    { ...supportedNetworks[polygon.id], chainId: polygon.id },
    { ...supportedNetworks[polygonMumbai.id], chainId: polygonMumbai.id },
  ]

  const handleNetworkSwitch = async (targetChainId) => {
    setShowNetworks(false)
    await switchNetwork(targetChainId)
  }

  return (
    <div className="position-relative">
      <button
        className="btn btn-sm d-flex align-items-center"
        style={{ 
          backgroundColor: currentNetwork.color, 
          color: 'white',
          border: 'none'
        }}
        onClick={() => setShowNetworks(!showNetworks)}
      >
        <span className="me-1">{currentNetwork.name}</span>
        <i className={`fa fa-chevron-${showNetworks ? 'up' : 'down'} small`}></i>
      </button>

      {showNetworks && (
        <div 
          className="position-absolute top-100 end-0 mt-1 bg-white border rounded shadow-sm"
          style={{ minWidth: '200px', zIndex: 1060 }}
        >
          <div className="p-2">
            <h6 className="text-dark mb-2 small">Switch Network</h6>
            {networks.map((network) => (
              <button
                key={network.chainId}
                className={`btn btn-sm w-100 mb-1 d-flex align-items-center justify-content-between ${
                  chainId === network.chainId ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => handleNetworkSwitch(network.chainId)}
                disabled={chainId === network.chainId}
              >
                <span>{network.name}</span>
                <span 
                  className="badge rounded-pill"
                  style={{ backgroundColor: network.color }}
                >
                  {network.symbol}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NetworkSwitcher
