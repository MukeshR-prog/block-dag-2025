// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CardSmart - Decentralized Card Management System
 * @dev Smart contract for managing digital cards, transactions, and analytics on BlockDAG
 * @author CardSmart Team
 */
contract CardSmart is Ownable, ReentrancyGuard {
    // State variables
    uint256 private _cardIdCounter;
    uint256 private _transactionIdCounter;

    // Card structure
    struct Card {
        uint256 id;
        string cardNumber;
        string cardName;
        string category;
        uint256 balance;
        uint256 creditLimit;
        address owner;
        bool isActive;
        uint256 createdAt;
        uint256 lastUsed;
        uint256 totalSpent;
        uint256 totalTransactions;
    }

    // Transaction structure
    struct Transaction {
        uint256 id;
        uint256 cardId;
        string transactionName;
        uint256 amount;
        string category;
        string transactionType; // "income" or "expense"
        address user;
        string blockchainHash;
        uint256 timestamp;
        bool isConfirmed;
    }

    // User analytics structure
    struct UserAnalytics {
        uint256 totalCards;
        uint256 totalTransactions;
        uint256 totalSpent;
        uint256 totalIncome;
        uint256 monthlySpending;
        string preferredCategory;
        uint256 lastActivity;
    }

    // Mappings
    mapping(uint256 => Card) public cards;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public userCards;
    mapping(address => uint256[]) public userTransactions;
    mapping(address => UserAnalytics) public userAnalytics;
    mapping(address => bool) public authorizedUsers;

    // Events
    event CardCreated(uint256 indexed cardId, address indexed owner, string cardName);
    event CardUpdated(uint256 indexed cardId, string cardName, uint256 balance);
    event TransactionCreated(uint256 indexed transactionId, uint256 indexed cardId, uint256 amount);
    event TransactionConfirmed(uint256 indexed transactionId, string blockchainHash);
    event UserRegistered(address indexed user);
    event BalanceUpdated(uint256 indexed cardId, uint256 newBalance);

    // Modifiers
    modifier onlyCardOwner(uint256 cardId) {
        require(cards[cardId].owner == msg.sender, "Not card owner");
        _;
    }

    modifier cardExists(uint256 cardId) {
        require(cards[cardId].id != 0, "Card does not exist");
        _;
    }

    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Register a new user in the system
     * @param userAddress Address of the user to register
     */
    function registerUser(address userAddress) external onlyOwner {
        require(!authorizedUsers[userAddress], "User already registered");
        
        authorizedUsers[userAddress] = true;
        userAnalytics[userAddress] = UserAnalytics({
            totalCards: 0,
            totalTransactions: 0,
            totalSpent: 0,
            totalIncome: 0,
            monthlySpending: 0,
            preferredCategory: "general",
            lastActivity: block.timestamp
        });

        emit UserRegistered(userAddress);
    }

    /**
     * @dev Create a new card
     * @param cardNumber Unique card number
     * @param cardName Display name for the card
     * @param category Card category (e.g., "Credit", "Debit", "Virtual")
     * @param creditLimit Credit limit for the card
     */
    function createCard(
        string memory cardNumber,
        string memory cardName,
        string memory category,
        uint256 creditLimit
    ) external returns (uint256) {
        require(authorizedUsers[msg.sender], "User not authorized");
        require(bytes(cardNumber).length > 0, "Card number required");
        require(bytes(cardName).length > 0, "Card name required");

        _cardIdCounter++;
        uint256 newCardId = _cardIdCounter;

        cards[newCardId] = Card({
            id: newCardId,
            cardNumber: cardNumber,
            cardName: cardName,
            category: category,
            balance: 0,
            creditLimit: creditLimit,
            owner: msg.sender,
            isActive: true,
            createdAt: block.timestamp,
            lastUsed: 0,
            totalSpent: 0,
            totalTransactions: 0
        });

        userCards[msg.sender].push(newCardId);
        userAnalytics[msg.sender].totalCards++;
        userAnalytics[msg.sender].lastActivity = block.timestamp;

        emit CardCreated(newCardId, msg.sender, cardName);
        return newCardId;
    }

    /**
     * @dev Update card balance
     * @param cardId ID of the card to update
     * @param newBalance New balance amount
     */
    function updateCardBalance(uint256 cardId, uint256 newBalance) 
        external 
        onlyCardOwner(cardId) 
        cardExists(cardId) 
    {
        cards[cardId].balance = newBalance;
        cards[cardId].lastUsed = block.timestamp;
        userAnalytics[msg.sender].lastActivity = block.timestamp;

        emit BalanceUpdated(cardId, newBalance);
    }

    /**
     * @dev Create a new transaction
     * @param cardId ID of the card for transaction
     * @param transactionName Description of the transaction
     * @param amount Transaction amount
     * @param category Transaction category
     * @param transactionType Type of transaction ("income" or "expense")
     * @param blockchainHash Hash from blockchain transaction
     */
    function createTransaction(
        uint256 cardId,
        string memory transactionName,
        uint256 amount,
        string memory category,
        string memory transactionType,
        string memory blockchainHash
    ) external validAmount(amount) cardExists(cardId) returns (uint256) {
        require(authorizedUsers[msg.sender], "User not authorized");
        require(cards[cardId].owner == msg.sender, "Not card owner");
        require(bytes(transactionName).length > 0, "Transaction name required");

        _transactionIdCounter++;
        uint256 newTransactionId = _transactionIdCounter;

        transactions[newTransactionId] = Transaction({
            id: newTransactionId,
            cardId: cardId,
            transactionName: transactionName,
            amount: amount,
            category: category,
            transactionType: transactionType,
            user: msg.sender,
            blockchainHash: blockchainHash,
            timestamp: block.timestamp,
            isConfirmed: false
        });

        userTransactions[msg.sender].push(newTransactionId);

        // Update card statistics
        cards[cardId].totalTransactions++;
        cards[cardId].lastUsed = block.timestamp;

        // Update user analytics
        userAnalytics[msg.sender].totalTransactions++;
        userAnalytics[msg.sender].lastActivity = block.timestamp;

        if (keccak256(bytes(transactionType)) == keccak256(bytes("expense"))) {
            cards[cardId].totalSpent += amount;
            userAnalytics[msg.sender].totalSpent += amount;
            
            // Update card balance for expenses
            if (cards[cardId].balance >= amount) {
                cards[cardId].balance -= amount;
            }
        } else if (keccak256(bytes(transactionType)) == keccak256(bytes("income"))) {
            userAnalytics[msg.sender].totalIncome += amount;
            cards[cardId].balance += amount;
        }

        emit TransactionCreated(newTransactionId, cardId, amount);
        return newTransactionId;
    }

    /**
     * @dev Confirm a transaction with blockchain hash
     * @param transactionId ID of the transaction to confirm
     * @param blockchainHash Hash from blockchain confirmation
     */
    function confirmTransaction(uint256 transactionId, string memory blockchainHash) 
        external 
        onlyOwner 
    {
        require(transactions[transactionId].id != 0, "Transaction does not exist");
        require(!transactions[transactionId].isConfirmed, "Transaction already confirmed");

        transactions[transactionId].isConfirmed = true;
        transactions[transactionId].blockchainHash = blockchainHash;

        emit TransactionConfirmed(transactionId, blockchainHash);
    }

    /**
     * @dev Get user's cards
     * @param userAddress Address of the user
     * @return Array of card IDs owned by the user
     */
    function getUserCards(address userAddress) external view returns (uint256[] memory) {
        return userCards[userAddress];
    }

    /**
     * @dev Get user's transactions
     * @param userAddress Address of the user
     * @return Array of transaction IDs for the user
     */
    function getUserTransactions(address userAddress) external view returns (uint256[] memory) {
        return userTransactions[userAddress];
    }

    /**
     * @dev Get card details
     * @param cardId ID of the card
     * @return Card struct
     */
    function getCard(uint256 cardId) external view cardExists(cardId) returns (Card memory) {
        return cards[cardId];
    }

    /**
     * @dev Get transaction details
     * @param transactionId ID of the transaction
     * @return Transaction struct
     */
    function getTransaction(uint256 transactionId) external view returns (Transaction memory) {
        require(transactions[transactionId].id != 0, "Transaction does not exist");
        return transactions[transactionId];
    }

    /**
     * @dev Get user analytics
     * @param userAddress Address of the user
     * @return UserAnalytics struct
     */
    function getUserAnalytics(address userAddress) external view returns (UserAnalytics memory) {
        return userAnalytics[userAddress];
    }

    /**
     * @dev Toggle card active status
     * @param cardId ID of the card
     */
    function toggleCardStatus(uint256 cardId) 
        external 
        onlyCardOwner(cardId) 
        cardExists(cardId) 
    {
        cards[cardId].isActive = !cards[cardId].isActive;
        userAnalytics[msg.sender].lastActivity = block.timestamp;
    }

    /**
     * @dev Get total number of cards
     * @return Total card count
     */
    function getTotalCards() external view returns (uint256) {
        return _cardIdCounter;
    }

    /**
     * @dev Get total number of transactions
     * @return Total transaction count
     */
    function getTotalTransactions() external view returns (uint256) {
        return _transactionIdCounter;
    }

    /**
     * @dev Emergency withdrawal function (only owner)
     */
    function emergencyWithdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Receive function to accept ether
    receive() external payable {}

    // Fallback function
    fallback() external payable {}
}
