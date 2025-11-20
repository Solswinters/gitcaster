/**
 * Wallet Service - Manages Web3 wallet connections and interactions
 */

import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  chainId: number;
  chainName: string;
  balance: string;
  ensName?: string;
  isConnected: boolean;
}

export interface WalletProvider {
  name: string;
  isInstalled: boolean;
  icon?: string;
}

export interface SignatureRequest {
  message: string;
  address: string;
}

export interface TransactionRequest {
  to: string;
  value?: string;
  data?: string;
  gasLimit?: string;
}

export type WalletEventType =
  | 'accountsChanged'
  | 'chainChanged'
  | 'connect'
  | 'disconnect'
  | 'message';

export type WalletEventHandler = (data?: any) => void;

export class WalletService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private eventHandlers: Map<WalletEventType, Set<WalletEventHandler>> = new Map();
  private currentWallet: WalletInfo | null = null;

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Check if a wallet provider is available
   */
  isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
  }

  /**
   * Get available wallet providers
   */
  getAvailableProviders(): WalletProvider[] {
    const providers: WalletProvider[] = [];

    if (typeof window === 'undefined') {
      return providers;
    }

    const ethereum = (window as any).ethereum;

    if (ethereum) {
      // MetaMask
      if (ethereum.isMetaMask) {
        providers.push({
          name: 'MetaMask',
          isInstalled: true,
          icon: '🦊',
        });
      }

      // Coinbase Wallet
      if (ethereum.isCoinbaseWallet) {
        providers.push({
          name: 'Coinbase Wallet',
          isInstalled: true,
          icon: '💼',
        });
      }

      // WalletConnect
      if (ethereum.isWalletConnect) {
        providers.push({
          name: 'WalletConnect',
          isInstalled: true,
          icon: '🔗',
        });
      }

      // Generic provider
      if (!providers.length) {
        providers.push({
          name: 'Web3 Wallet',
          isInstalled: true,
          icon: '💰',
        });
      }
    }

    return providers;
  }

  /**
   * Connect to wallet
   */
  async connect(): Promise<WalletInfo> {
    if (!this.isWalletAvailable()) {
      throw new Error('No wallet provider found. Please install MetaMask or another Web3 wallet.');
    }

    try {
      const ethereum = (window as any).ethereum;
      
      // Request account access
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Initialize provider and signer
      this.provider = new ethers.BrowserProvider(ethereum);
      this.signer = await this.provider.getSigner();

      // Get wallet info
      const address = accounts[0];
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(address);
      
      // Try to resolve ENS name
      let ensName: string | undefined;
      try {
        ensName = await this.provider.lookupAddress(address) || undefined;
      } catch (error) {
        // ENS lookup failed, continue without it
      }

      this.currentWallet = {
        address,
        chainId: Number(network.chainId),
        chainName: network.name,
        balance: ethers.formatEther(balance),
        ensName,
        isConnected: true,
      };

      this.emit('connect', this.currentWallet);

      return this.currentWallet;
    } catch (error: any) {
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.currentWallet = null;
    this.emit('disconnect');
  }

  /**
   * Get current wallet info
   */
  getCurrentWallet(): WalletInfo | null {
    return this.currentWallet;
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.currentWallet !== null && this.currentWallet.isConnected;
  }

  /**
   * Get wallet address
   */
  getAddress(): string | null {
    return this.currentWallet?.address || null;
  }

  /**
   * Get chain ID
   */
  getChainId(): number | null {
    return this.currentWallet?.chainId || null;
  }

  /**
   * Get wallet balance
   */
  async getBalance(address?: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    const targetAddress = address || this.currentWallet?.address;
    if (!targetAddress) {
      throw new Error('No address provided');
    }

    const balance = await this.provider.getBalance(targetAddress);
    return ethers.formatEther(balance);
  }

  /**
   * Sign a message
   */
  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error: any) {
      throw new Error(`Failed to sign message: ${error.message}`);
    }
  }

  /**
   * Sign typed data (EIP-712)
   */
  async signTypedData(domain: any, types: any, value: any): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await this.signer.signTypedData(domain, types, value);
      return signature;
    } catch (error: any) {
      throw new Error(`Failed to sign typed data: ${error.message}`);
    }
  }

  /**
   * Send transaction
   */
  async sendTransaction(tx: TransactionRequest): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const transaction = await this.signer.sendTransaction({
        to: tx.to,
        value: tx.value ? ethers.parseEther(tx.value) : undefined,
        data: tx.data,
        gasLimit: tx.gasLimit,
      });

      return transaction.hash;
    } catch (error: any) {
      throw new Error(`Failed to send transaction: ${error.message}`);
    }
  }

  /**
   * Switch to a different chain
   */
  async switchChain(chainId: number): Promise<void> {
    if (!this.isWalletAvailable()) {
      throw new Error('Wallet not connected');
    }

    try {
      const ethereum = (window as any).ethereum;
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // Chain not added, try to add it
      if (error.code === 4902) {
        throw new Error('Chain not configured in wallet. Please add it manually.');
      }
      throw new Error(`Failed to switch chain: ${error.message}`);
    }
  }

  /**
   * Add a custom chain to the wallet
   */
  async addChain(chainConfig: {
    chainId: number;
    chainName: string;
    rpcUrls: string[];
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    blockExplorerUrls?: string[];
  }): Promise<void> {
    if (!this.isWalletAvailable()) {
      throw new Error('Wallet not connected');
    }

    try {
      const ethereum = (window as any).ethereum;
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainConfig.chainId.toString(16)}`,
            chainName: chainConfig.chainName,
            rpcUrls: chainConfig.rpcUrls,
            nativeCurrency: chainConfig.nativeCurrency,
            blockExplorerUrls: chainConfig.blockExplorerUrls,
          },
        ],
      });
    } catch (error: any) {
      throw new Error(`Failed to add chain: ${error.message}`);
    }
  }

  /**
   * Request personal signature (for authentication)
   */
  async personalSign(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const address = await this.signer.getAddress();
    
    try {
      const ethereum = (window as any).ethereum;
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });
      
      return signature;
    } catch (error: any) {
      throw new Error(`Failed to sign message: ${error.message}`);
    }
  }

  /**
   * Verify a message signature
   */
  verifySignature(message: string, signature: string, expectedAddress: string): boolean {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash: string): Promise<any> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    return await this.provider.getTransactionReceipt(txHash);
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash: string, confirmations: number = 1): Promise<any> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    return await this.provider.waitForTransaction(txHash, confirmations);
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(tx: TransactionRequest): Promise<string> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const gasEstimate = await this.provider.estimateGas({
        to: tx.to,
        value: tx.value ? ethers.parseEther(tx.value) : undefined,
        data: tx.data,
      });
      
      return gasEstimate.toString();
    } catch (error: any) {
      throw new Error(`Failed to estimate gas: ${error.message}`);
    }
  }

  /**
   * Get current gas price
   */
  async getGasPrice(): Promise<string> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    const feeData = await this.provider.getFeeData();
    return feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0';
  }

  /**
   * Resolve ENS name to address
   */
  async resolveENS(name: string): Promise<string | null> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      return await this.provider.resolveName(name);
    } catch (error) {
      return null;
    }
  }

  /**
   * Lookup address to ENS name
   */
  async lookupAddress(address: string): Promise<string | null> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      return await this.provider.lookupAddress(address);
    } catch (error) {
      return null;
    }
  }

  /**
   * Subscribe to wallet events
   */
  on(event: WalletEventType, handler: WalletEventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }

    this.eventHandlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  /**
   * Emit event to subscribers
   */
  private emit(event: WalletEventType, data?: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }

  /**
   * Setup event listeners for wallet provider
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      return;
    }

    // Account changed
    ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else if (this.currentWallet) {
        this.currentWallet.address = accounts[0];
        this.emit('accountsChanged', { address: accounts[0] });
      }
    });

    // Chain changed
    ethereum.on('chainChanged', (chainId: string) => {
      if (this.currentWallet) {
        this.currentWallet.chainId = parseInt(chainId, 16);
        this.emit('chainChanged', { chainId: this.currentWallet.chainId });
      }
      // Reload the page as recommended by MetaMask
      window.location.reload();
    });

    // Connection
    ethereum.on('connect', (connectInfo: { chainId: string }) => {
      this.emit('connect', { chainId: parseInt(connectInfo.chainId, 16) });
    });

    // Disconnection
    ethereum.on('disconnect', () => {
      this.disconnect();
    });

    // Messages
    ethereum.on('message', (message: any) => {
      this.emit('message', message);
    });
  }

  /**
   * Cleanup and destroy service
   */
  destroy(): void {
    this.disconnect();
    this.eventHandlers.clear();
  }
}

// Export singleton instance
let walletServiceInstance: WalletService | null = null;

export function getWalletService(): WalletService {
  if (!walletServiceInstance) {
    walletServiceInstance = new WalletService();
  }
  return walletServiceInstance;
}

export function resetWalletService(): void {
  if (walletServiceInstance) {
    walletServiceInstance.destroy();
    walletServiceInstance = null;
  }
}

