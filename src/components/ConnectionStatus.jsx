import React from 'react'
import { useWallet } from '../hooks/useWallet'

const ConnectionStatus = () => {
  const { isConnected, currentNetwork, formattedAddress, balance } = useWallet()

  if (!isConnected) {
    return (
      <div className="alert alert-warning d-flex align-items-center" role="alert">
        <i className="fa fa-exclamation-triangle me-2"></i>
        <div>
          <strong>Wallet not connected</strong>
          <div className="small">Connect your wallet to access Web3 features</div>
        </div>
      </div>
    )
  }

  return (
    <div className="alert alert-success d-flex align-items-center" role="alert">
      <i className="fa fa-check-circle me-2"></i>
      <div className="flex-grow-1">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <strong>Wallet Connected</strong>
            <div className="small text-muted">
              {formattedAddress} on {currentNetwork.name}
            </div>
          </div>
          <div className="text-end">
            <div className="small text-muted">Balance</div>
            <div className="fw-bold">
              {parseFloat(balance).toFixed(4)} {currentNetwork.symbol}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectionStatus
