import React from 'react'
import { Navbar, Footer, ConnectionStatus } from '../components'
import { useWallet } from '../hooks/useWallet'

const Web3Demo = () => {
  const { 
    isConnected, 
    address, 
    balance, 
    currentNetwork, 
    formattedAddress,
    chainId
  } = useWallet()

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <h1 className="display-4 text-center mb-5">
              <i className="fa fa-wallet me-3"></i>
              Web3 Integration Demo
            </h1>
            
            <ConnectionStatus />
            
            {isConnected ? (
              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <i className="fa fa-user me-2"></i>
                        Wallet Information
                      </h5>
                    </div>
                    <div className="card-body">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td className="fw-bold">Address:</td>
                            <td>
                              <code className="text-primary">{formattedAddress}</code>
                              <button 
                                className="btn btn-sm btn-outline-secondary ms-2"
                                onClick={() => navigator.clipboard.writeText(address)}
                                title="Copy full address"
                              >
                                <i className="fa fa-copy"></i>
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Network:</td>
                            <td>
                              <span 
                                className="badge rounded-pill"
                                style={{ backgroundColor: currentNetwork.color }}
                              >
                                {currentNetwork.name}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Chain ID:</td>
                            <td><code>{chainId}</code></td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Balance:</td>
                            <td>
                              <strong>
                                {parseFloat(balance).toFixed(6)} {currentNetwork.symbol}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0">
                        <i className="fa fa-cogs me-2"></i>
                        Web3 Features
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-3">
                        <button 
                          className="btn btn-outline-primary d-flex align-items-center justify-content-between"
                          onClick={() => {
                            // Example: Sign a message
                            if (window.ethereum) {
                              window.ethereum.request({
                                method: 'personal_sign',
                                params: ['Hello from React Ecommerce!', address]
                              }).then(signature => {
                                alert('Message signed successfully!')
                                console.log('Signature:', signature)
                              }).catch(console.error)
                            }
                          }}
                        >
                          <span>
                            <i className="fa fa-pen me-2"></i>
                            Sign Message
                          </span>
                          <i className="fa fa-chevron-right"></i>
                        </button>
                        
                        <button 
                          className="btn btn-outline-info d-flex align-items-center justify-content-between"
                          onClick={() => {
                            window.open(`https://etherscan.io/address/${address}`, '_blank')
                          }}
                        >
                          <span>
                            <i className="fa fa-external-link me-2"></i>
                            View on Etherscan
                          </span>
                          <i className="fa fa-chevron-right"></i>
                        </button>
                        
                        <button 
                          className="btn btn-outline-warning d-flex align-items-center justify-content-between"
                          onClick={() => {
                            // Refresh balance
                            window.location.reload()
                          }}
                        >
                          <span>
                            <i className="fa fa-refresh me-2"></i>
                            Refresh Data
                          </span>
                          <i className="fa fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center mt-5">
                <div className="card border-0">
                  <div className="card-body">
                    <i className="fa fa-wallet display-1 text-muted mb-4"></i>
                    <h3>Connect Your Wallet</h3>
                    <p className="text-muted mb-4">
                      Connect your Web3 wallet to explore decentralized features and interact with blockchain networks.
                    </p>
                    <div className="row justify-content-center">
                      <div className="col-md-8">
                        <div className="alert alert-info">
                          <h6 className="alert-heading">
                            <i className="fa fa-info-circle me-2"></i>
                            Supported Features:
                          </h6>
                          <ul className="list-unstyled mb-0">
                            <li><i className="fa fa-check text-success me-2"></i>MetaMask Integration</li>
                            <li><i className="fa fa-check text-success me-2"></i>WalletConnect Support</li>
                            <li><i className="fa fa-check text-success me-2"></i>Multi-Network Support</li>
                            <li><i className="fa fa-check text-success me-2"></i>Real-time Balance Updates</li>
                            <li><i className="fa fa-check text-success me-2"></i>Network Switching</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-5">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fa fa-network-wired me-2"></i>
                    Supported Networks
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <div className="d-flex align-items-center">
                        <span className="badge rounded-pill bg-primary me-2">ETH</span>
                        <span>Ethereum Mainnet</span>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="d-flex align-items-center">
                        <span className="badge rounded-pill bg-secondary me-2">ETH</span>
                        <span>Sepolia Testnet</span>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="d-flex align-items-center">
                        <span className="badge rounded-pill" style={{backgroundColor: '#8247E5'}} >MATIC</span>
                        <span className="ms-2">Polygon</span>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="d-flex align-items-center">
                        <span className="badge rounded-pill" style={{backgroundColor: '#8247E5'}}>MATIC</span>
                        <span className="ms-2">Polygon Mumbai</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Web3Demo
