import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'
import { getNetworkName, supportedNetworks } from '../config/web3'
import { 
  showNetworkSwitchConfirmation, 
  handleTransaction, 
  getExplorerUrl 
} from '../utils/transactionUtils'

export const useWallet = () => {
  const { address, isConnected, isConnecting, connector } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [balance, setBalance] = useState('0')

  // Fetch ETH balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (address && window.ethereum) {
        try {
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest']
          })
          setBalance(formatEther(BigInt(balance)))
        } catch (error) {
          console.error('Error fetching balance:', error)
          setBalance('0')
        }
      }
    }

    if (isConnected) {
      fetchBalance()
      // Refresh balance every 30 seconds
      const interval = setInterval(fetchBalance, 30000)
      return () => clearInterval(interval)
    }
  }, [address, isConnected, chainId])

  // Handle connection with toast notifications
  const handleConnect = async (connector) => {
    try {
      await connect({ connector })
      toast.success('Wallet connected successfully!')
    } catch (error) {
      toast.error(`Connection failed: ${error.message}`)
    }
  }

  // Handle disconnection
  const handleDisconnect = () => {
    disconnect()
    setBalance('0')
    toast.success('Wallet disconnected')
  }

  // Handle network switching with confirmation
  const handleSwitchNetwork = async (targetChainId) => {
    const targetNetwork = supportedNetworks[targetChainId]
    const confirmed = await showNetworkSwitchConfirmation(
      targetNetwork?.name || 'Unknown Network',
      currentNetwork.name
    )
    
    if (confirmed) {
      try {
        await switchChain({ chainId: targetChainId })
        toast.success(`Switched to ${targetNetwork?.name || 'Unknown Network'}`)
      } catch (error) {
        toast.error(`Network switch failed: ${error.message}`)
      }
    }
  }

  // Execute transaction with full UI feedback
  const executeTransaction = async (transactionFunction, options = {}) => {
    const explorerUrl = getExplorerUrl(chainId)
    
    return await handleTransaction(transactionFunction, {
      explorerUrl,
      onSuccess: (receipt, txHash) => {
        // Refresh balance after successful transaction
        if (address && window.ethereum) {
          setTimeout(async () => {
            try {
              const newBalance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest']
              })
              setBalance(formatEther(BigInt(newBalance)))
            } catch (error) {
              console.error('Error refreshing balance:', error)
            }
          }, 2000) // Wait 2 seconds for block confirmation
        }
      },
      ...options
    })
  }

  // Sign message with transaction UI
  const signMessage = async (message) => {
    return await executeTransaction(
      async () => {
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address]
        })
        return signature
      },
      {
        confirmationTitle: 'Sign Message',
        confirmationText: `Sign this message: "${message}"`,
        waitingTitle: 'Signing Message',
        waitingText: 'Please sign the message in your wallet...',
        successTitle: 'Message Signed!',
        successText: 'Your message has been signed successfully.',
        showConfirmation: true
      }
    )
  }

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Get current network info
  const currentNetwork = supportedNetworks[chainId] || {
    name: 'Unknown Network',
    symbol: 'ETH',
    color: '#666666'
  }

  return {
    // Connection state
    address,
    isConnected,
    isConnecting,
    connector,
    balance,
    chainId,
    currentNetwork,

    // Connection management
    connect: handleConnect,
    disconnect: handleDisconnect,
    switchNetwork: handleSwitchNetwork,

    // Transaction management
    executeTransaction,
    signMessage,

    // Available connectors
    connectors,
    isLoading,
    pendingConnector,
    error,

    // Utilities
    formatAddress,
    formattedAddress: formatAddress(address),
  }
}
