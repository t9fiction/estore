import React, { useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import NetworkSwitcher from './NetworkSwitcher'

const WalletConnect = () => {
  const {
    address,
    isConnected,
    isConnecting,
    balance,
    currentNetwork,
    connect,
    disconnect,
    connectors,
    isLoading,
    pendingConnector,
    formattedAddress,
  } = useWallet()

  const [showDropdown, setShowDropdown] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)

  const toggleDropdown = () => setShowDropdown(!showDropdown)
  const toggleConnectModal = () => setShowConnectModal(!showConnectModal)

  // Get connector display names and icons
  const getConnectorInfo = (connector) => {
    const name = connector.name.toLowerCase()
    if (name.includes('metamask')) {
      return { name: 'MetaMask', icon: '🦊' }
    }
    if (name.includes('walletconnect')) {
      return { name: 'WalletConnect', icon: '🔗' }
    }
    if (name.includes('injected')) {
      return { name: 'Browser Wallet', icon: '🌐' }
    }
    return { name: connector.name, icon: '💼' }
  }

  if (isConnected) {
    return (
      <div className="position-relative">
        <button 
          className="btn btn-success d-flex align-items-center gap-2 position-relative"
          onClick={toggleDropdown}
        >
          <span 
            className="badge rounded-pill me-1"
            style={{ backgroundColor: currentNetwork.color }}
          >
            {currentNetwork.symbol}
          </span>
          <span className="d-none d-md-inline">{formattedAddress}</span>
          <span className="d-md-none">
            {address ? `${address.slice(0, 4)}...` : ''}
          </span>
          <i className={`fa fa-chevron-${showDropdown ? 'up' : 'down'} ms-1`}></i>
        </button>

        {/* Wallet Info Dropdown */}
        {showDropdown && (
          <div 
            className="position-absolute top-100 end-0 mt-2 bg-white border rounded shadow-lg p-3"
            style={{ minWidth: '280px', zIndex: 1050 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 text-dark">Wallet Info</h6>
              <button 
                className="btn-close" 
                onClick={() => setShowDropdown(false)}
                aria-label="Close"
              ></button>
            </div>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Network:</span>
                <NetworkSwitcher currentNetwork={currentNetwork} />
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Address:</span>
                <code className="small text-primary">{formattedAddress}</code>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Balance:</span>
                <span className="small fw-bold">
                  {parseFloat(balance).toFixed(4)} {currentNetwork.symbol}
                </span>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  navigator.clipboard.writeText(address)
                  setShowDropdown(false)
                }}
              >
                <i className="fa fa-copy me-1"></i>
                Copy Address
              </button>
              
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={() => {
                  disconnect()
                  setShowDropdown(false)
                }}
              >
                <i className="fa fa-sign-out-alt me-1"></i>
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <button 
        className="btn btn-outline-primary position-relative"
        onClick={toggleConnectModal}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Connecting...
          </>
        ) : (
          <>
            <i className="fa fa-wallet me-1"></i>
            Connect Wallet
          </>
        )}
      </button>

      {/* Connect Modal */}
      {showConnectModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="fa fa-wallet me-2"></i>
                    Connect Your Wallet
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={toggleConnectModal}
                  ></button>
                </div>
                
                <div className="modal-body">
                  <p className="text-muted mb-4">
                    Choose a wallet to connect to this dapp:
                  </p>
                  
                  <div className="d-grid gap-3">
                    {connectors.map((connector) => {
                      const connectorInfo = getConnectorInfo(connector)
                      const isCurrentlyConnecting = isLoading && pendingConnector?.id === connector.id
                      
                      return (
                        <button
                          key={connector.id}
                          className="btn btn-outline-dark d-flex align-items-center justify-content-between p-3"
                          onClick={() => {
                            connect(connector)
                            setShowConnectModal(false)
                          }}
                          disabled={isLoading}
                        >
                          <div className="d-flex align-items-center">
                            <span className="fs-4 me-3">{connectorInfo.icon}</span>
                            <div className="text-start">
                              <div className="fw-semibold">{connectorInfo.name}</div>
                              <small className="text-muted">
                                {connector.name.includes('MetaMask') && 'Connect using MetaMask'}
                                {connector.name.includes('WalletConnect') && 'Scan with WalletConnect'}
                                {connector.name.includes('Injected') && 'Connect using browser wallet'}
                              </small>
                            </div>
                          </div>
                          
                          {isCurrentlyConnecting && (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  
                  <div className="mt-4 p-3 bg-light rounded">
                    <small className="text-muted">
                      <i className="fa fa-info-circle me-1"></i>
                      By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default WalletConnect
