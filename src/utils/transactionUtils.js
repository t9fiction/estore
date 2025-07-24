import Swal from 'sweetalert2'
import { waitForTransactionReceipt } from '@wagmi/core'
import { config } from '../config/web3'

// Custom SweetAlert2 configuration
const swalConfig = {
  customClass: {
    popup: 'swal-popup',
    title: 'swal-title',
    content: 'swal-content',
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-secondary'
  },
  buttonsStyling: false
}

/**
 * Shows a confirmation dialog before executing a transaction
 */
export const showTransactionConfirmation = async (
  title = 'Confirm Transaction',
  text = 'Please confirm this transaction in your wallet',
  options = {}
) => {
  const result = await Swal.fire({
    ...swalConfig,
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    ...options
  })
  
  return result.isConfirmed
}

/**
 * Shows a waiting dialog during transaction processing
 */
export const showTransactionWaiting = (
  title = 'Processing Transaction',
  text = 'Please confirm the transaction in your wallet...'
) => {
  return Swal.fire({
    ...swalConfig,
    title,
    text,
    icon: 'info',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

/**
 * Updates the waiting dialog to show mining status
 */
export const updateTransactionWaiting = (
  title = 'Transaction Submitted',
  text = 'Waiting for blockchain confirmation...',
  txHash = null
) => {
  Swal.update({
    title,
    text: txHash ? `${text}\nTransaction Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}` : text,
    icon: 'info'
  })
}

/**
 * Shows transaction success message
 */
export const showTransactionSuccess = async (
  title = 'Transaction Successful!',
  text = 'Your transaction has been completed successfully.',
  txHash = null,
  explorerUrl = null
) => {
  const htmlContent = `
    <div class="text-center">
      <p class="mb-3">${text}</p>
      ${txHash ? `
        <div class="mb-3">
          <small class="text-muted">Transaction Hash:</small><br>
          <code class="small">${txHash.slice(0, 10)}...${txHash.slice(-8)}</code>
        </div>
      ` : ''}
      ${explorerUrl && txHash ? `
        <a href="${explorerUrl}/tx/${txHash}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm">
          <i class="fa fa-external-link me-1"></i>
          View on Explorer
        </a>
      ` : ''}
    </div>
  `

  return await Swal.fire({
    ...swalConfig,
    title,
    html: htmlContent,
    icon: 'success',
    confirmButtonText: 'Great!',
    timer: 10000,
    timerProgressBar: true
  })
}

/**
 * Shows transaction error message
 */
export const showTransactionError = async (
  title = 'Transaction Failed',
  error = 'An error occurred while processing your transaction.',
  showRetry = false
) => {
  let errorMessage = error
  
  // Parse common error messages
  if (typeof error === 'object' && error.message) {
    errorMessage = error.message
  }
  
  // Handle user rejection
  if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
    errorMessage = 'Transaction was cancelled by user.'
  }
  
  // Handle insufficient funds
  if (errorMessage.includes('insufficient funds')) {
    errorMessage = 'Insufficient funds to complete this transaction.'
  }
  
  const result = await Swal.fire({
    ...swalConfig,
    title,
    text: errorMessage,
    icon: 'error',
    confirmButtonText: showRetry ? 'Try Again' : 'OK',
    showCancelButton: showRetry,
    cancelButtonText: showRetry ? 'Cancel' : undefined
  })
  
  return showRetry ? result.isConfirmed : false
}

/**
 * Shows network switching confirmation
 */
export const showNetworkSwitchConfirmation = async (networkName, currentNetwork) => {
  return await Swal.fire({
    ...swalConfig,
    title: 'Switch Network?',
    html: `
      <div class="text-center">
        <p>This transaction requires switching to <strong>${networkName}</strong></p>
        <p class="text-muted small">Current network: ${currentNetwork}</p>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Switch Network',
    cancelButtonText: 'Cancel'
  }).then(result => result.isConfirmed)
}

/**
 * Main transaction handler that manages the entire flow
 */
export const handleTransaction = async (
  transactionFunction,
  options = {}
) => {
  const {
    confirmationTitle = 'Confirm Transaction',
    confirmationText = 'Please confirm this transaction',
    waitingTitle = 'Processing Transaction',
    waitingText = 'Please confirm in your wallet...',
    successTitle = 'Transaction Successful!',
    successText = 'Your transaction has been completed successfully.',
    explorerUrl = null,
    showConfirmation = true,
    onSuccess = null,
    onError = null
  } = options

  try {
    // Show confirmation dialog if required
    if (showConfirmation) {
      const confirmed = await showTransactionConfirmation(confirmationTitle, confirmationText)
      if (!confirmed) {
        return { success: false, cancelled: true }
      }
    }

    // Show waiting dialog
    showTransactionWaiting(waitingTitle, waitingText)

    // Execute the transaction
    const txHash = await transactionFunction()

    if (txHash) {
      // Update waiting dialog to show mining status
      updateTransactionWaiting(
        'Transaction Submitted',
        'Waiting for blockchain confirmation...',
        txHash
      )

      // Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      })

      // Close waiting dialog and show success
      Swal.close()
      await showTransactionSuccess(successTitle, successText, txHash, explorerUrl)

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(receipt, txHash)
      }

      return { success: true, txHash, receipt }
    } else {
      throw new Error('Transaction failed to return hash')
    }

  } catch (error) {
    console.error('Transaction error:', error)
    
    // Close any open dialogs
    Swal.close()
    
    // Show error dialog
    const retry = await showTransactionError('Transaction Failed', error, true)
    
    // Call error callback if provided
    if (onError) {
      onError(error)
    }
    
    // If user wants to retry
    if (retry) {
      return await handleTransaction(transactionFunction, options)
    }
    
    return { success: false, error }
  }
}

/**
 * Simple transaction handler for basic transactions without confirmation
 */
export const executeTransaction = async (transactionFunction, options = {}) => {
  return await handleTransaction(transactionFunction, {
    ...options,
    showConfirmation: false
  })
}

/**
 * Formats transaction hash for display
 */
export const formatTxHash = (hash) => {
  if (!hash) return ''
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

/**
 * Gets explorer URL for current network
 */
export const getExplorerUrl = (chainId) => {
  const explorers = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    137: 'https://polygonscan.com',
    80001: 'https://mumbai.polygonscan.com'
  }
  
  return explorers[chainId] || 'https://etherscan.io'
}
