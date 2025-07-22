import { ethers } from 'ethers'
// Contract ABI - you'll need to update this with your actual ABI after compilation
const CARDSMART_ABI = [
  // Events
  "event CardCreated(uint256 indexed cardId, address indexed owner, string cardName)",
  "event TransactionCreated(uint256 indexed transactionId, uint256 indexed cardId, uint256 amount)",
  "event UserRegistered(address indexed user)",
  
  // Read functions
  "function owner() view returns (address)",
  "function authorizedUsers(address) view returns (bool)",
  "function cards(uint256) view returns (tuple(uint256 id, string cardNumber, string cardName, string category, uint256 balance, uint256 creditLimit, address owner, bool isActive, uint256 createdAt, uint256 lastUsed, uint256 totalSpent, uint256 totalTransactions))",
  "function transactions(uint256) view returns (tuple(uint256 id, uint256 cardId, string transactionName, uint256 amount, string category, string transactionType, address user, string blockchainHash, uint256 timestamp, bool isConfirmed))",
  "function getUserCards(address userAddress) view returns (uint256[])",
  "function getUserTransactions(address userAddress) view returns (uint256[])",
  "function getCard(uint256 cardId) view returns (tuple(uint256 id, string cardNumber, string cardName, string category, uint256 balance, uint256 creditLimit, address owner, bool isActive, uint256 createdAt, uint256 lastUsed, uint256 totalSpent, uint256 totalTransactions))",
  "function getTransaction(uint256 transactionId) view returns (tuple(uint256 id, uint256 cardId, string transactionName, uint256 amount, string category, string transactionType, address user, string blockchainHash, uint256 timestamp, bool isConfirmed))",
  "function getUserAnalytics(address userAddress) view returns (tuple(uint256 totalCards, uint256 totalTransactions, uint256 totalSpent, uint256 totalIncome, uint256 monthlySpending, string preferredCategory, uint256 lastActivity))",
  "function getTotalCards() view returns (uint256)",
  "function getTotalTransactions() view returns (uint256)",
  
  // Write functions
  "function registerUser(address userAddress)",
  "function createCard(string cardNumber, string cardName, string category, uint256 creditLimit) returns (uint256)",
  "function updateCardBalance(uint256 cardId, uint256 newBalance)",
  "function createTransaction(uint256 cardId, string transactionName, uint256 amount, string category, string transactionType, string blockchainHash) returns (uint256)",
  "function confirmTransaction(uint256 transactionId, string blockchainHash)",
  "function toggleCardStatus(uint256 cardId)"
];

// Network configuration
const BLOCKDAG_TESTNET = {
  chainId: '0x413', // 1043 in hex
  chainName: 'BlockDAG Primordial Testnet',
  nativeCurrency: {
    name: 'BDAG',
    symbol: 'BDAG',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.primordial.bdagscan.com'],
  blockExplorerUrls: ['https://primordial.bdagscan.com/'],
};

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = process.env.NEXT_PUBLIC_CARDSMART_CONTRACT_ADDRESS;
  }

  // Initialize Web3 connection
  async initialize() {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        await this.switchToBlockDAG();
        return true;
      } else {
        throw new Error('MetaMask not found. Please install MetaMask to continue.');
      }
    } catch (error) {
      console.error('Web3 initialization failed:', error);
      throw error;
    }
  }

  // Switch to BlockDAG network
  async switchToBlockDAG() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BLOCKDAG_TESTNET.chainId }],
      });
    } catch (switchError) {
      // Network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BLOCKDAG_TESTNET],
          });
        } catch (addError) {
          throw new Error('Failed to add BlockDAG network to MetaMask');
        }
      } else {
        throw switchError;
      }
    }
  }

  // Connect wallet
  async connectWallet() {
    try {
      if (!this.provider) {
        await this.initialize();
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      this.signer = await this.provider.getSigner();
      
      if (this.contractAddress) {
        this.contract = new ethers.Contract(this.contractAddress, CARDSMART_ABI, this.signer);
      }

      return {
        address: accounts[0],
        balance: await this.provider.getBalance(accounts[0]),
      };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  // Get contract instance
  getContract() {
    if (!this.contract) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }
    return this.contract;
  }

  // Format ether values
  formatEther(value) {
    return ethers.formatEther(value);
  }

  // Parse ether values
  parseEther(value) {
    return ethers.parseEther(value.toString());
  }

  // Contract interaction methods
  async createCard(cardNumber, cardName, category, creditLimit) {
    const contract = this.getContract();
    const tx = await contract.createCard(
      cardNumber,
      cardName, 
      category,
      this.parseEther(creditLimit)
    );
    return await tx.wait();
  }

  async createTransaction(cardId, transactionName, amount, category, transactionType) {
    const contract = this.getContract();
    const blockchainHash = `0x${Date.now().toString(16)}`; // Generate simple hash
    
    const tx = await contract.createTransaction(
      cardId,
      transactionName,
      this.parseEther(amount),
      category,
      transactionType,
      blockchainHash
    );
    return await tx.wait();
  }

  async getUserCards(address) {
    const contract = this.getContract();
    return await contract.getUserCards(address);
  }

  async getUserTransactions(address) {
    const contract = this.getContract();
    return await contract.getUserTransactions(address);
  }

  async getCard(cardId) {
    const contract = this.getContract();
    return await contract.getCard(cardId);
  }

  async getTransaction(transactionId) {
    const contract = this.getContract();
    return await contract.getTransaction(transactionId);
  }

  async getUserAnalytics(address) {
    const contract = this.getContract();
    return await contract.getUserAnalytics(address);
  }

  async updateCardBalance(cardId, newBalance) {
    const contract = this.getContract();
    const tx = await contract.updateCardBalance(cardId, this.parseEther(newBalance));
    return await tx.wait();
  }

  async toggleCardStatus(cardId) {
    const contract = this.getContract();
    const tx = await contract.toggleCardStatus(cardId);
    return await tx.wait();
  }

  // Listen to contract events
  onCardCreated(callback) {
    const contract = this.getContract();
    contract.on('CardCreated', callback);
  }

  onTransactionCreated(callback) {
    const contract = this.getContract();
    contract.on('TransactionCreated', callback);
  }

  // Remove event listeners
  removeAllListeners() {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }

  // Get current network info
  async getNetwork() {
    if (!this.provider) return null;
    return await this.provider.getNetwork();
  }

  // Check if connected to correct network
  async isCorrectNetwork() {
    const network = await this.getNetwork();
    return network && network.chainId === BigInt(1043);
  }
}

// Create singleton instance
const web3Service = new Web3Service();

export default web3Service;
