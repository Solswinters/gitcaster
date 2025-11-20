// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DeveloperProfileNFT
 * @dev NFT contract for minting GitHub achievement badges and storing Talent Protocol scores
 * @notice This contract allows developers to mint achievement NFTs based on their GitHub activity
 * 
 * Deployment Network: Base (Chain ID: 8453)
 * 
 * Features:
 * - Mint achievement badges for GitHub milestones
 * - Store and update Talent Protocol builder scores on-chain
 * - Soulbound tokens (non-transferable) for verified credentials
 * - Regular transferable badges for general achievements
 * - Integration with GitCaster analytics platform
 */
contract DeveloperProfileNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Achievement types
    enum AchievementType {
        COMMITS_100,        // 100 commits milestone
        COMMITS_1000,       // 1000 commits milestone
        REPOS_10,           // 10 repositories created
        REPOS_50,           // 50 repositories created
        STARS_100,          // 100 stars received
        STARS_1000,         // 1000 stars received
        CONTRIBUTOR_10,     // Contributed to 10 projects
        CONTRIBUTOR_50,     // Contributed to 50 projects
        TALENT_VERIFIED,    // Talent Protocol verified
        EARLY_ADOPTER,      // Early GitCaster user
        BUILDER_SCORE_HIGH  // High Talent Protocol builder score
    }
    
    // Achievement metadata
    struct Achievement {
        AchievementType achievementType;
        uint256 timestamp;
        string githubUsername;
        uint256 talentScore;
        bool isSoulbound; // Non-transferable if true
        string metadataURI;
    }
    
    // Mapping from token ID to achievement data
    mapping(uint256 => Achievement) public achievements;
    
    // Mapping from address to GitHub username (one username per address)
    mapping(address => string) public addressToGithub;
    
    // Mapping from GitHub username to address
    mapping(string => address) public githubToAddress;
    
    // Mapping to track which achievements a user has earned
    mapping(address => mapping(AchievementType => bool)) public hasAchievement;
    
    // Mapping to track Talent Protocol scores
    mapping(address => uint256) public talentScores;
    
    // Trusted minter addresses (backend services)
    mapping(address => bool) public trustedMinters;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Events
    event AchievementMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        AchievementType achievementType,
        string githubUsername,
        uint256 timestamp
    );
    
    event TalentScoreUpdated(
        address indexed developer,
        uint256 oldScore,
        uint256 newScore,
        uint256 timestamp
    );
    
    event GithubLinked(
        address indexed developer,
        string githubUsername,
        uint256 timestamp
    );
    
    event TrustedMinterUpdated(
        address indexed minter,
        bool status
    );
    
    event SoulboundTransferAttempted(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    
    /**
     * @dev Constructor to initialize the NFT collection
     * @param initialOwner Address of the initial contract owner
     */
    constructor(address initialOwner) 
        ERC721("GitCaster Developer Badge", "GCDEV")
        Ownable(initialOwner)
    {
        _baseTokenURI = "https://api.gitcaster.com/metadata/";
    }
    
    /**
     * @dev Set base URI for token metadata
     * @param baseURI The base URI string
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Returns the base URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Add or remove a trusted minter
     * @param minter Address of the minter
     * @param status True to add, false to remove
     */
    function setTrustedMinter(address minter, bool status) external onlyOwner {
        trustedMinters[minter] = status;
        emit TrustedMinterUpdated(minter, status);
    }
    
    /**
     * @dev Link a GitHub username to an Ethereum address
     * @param developer Address of the developer
     * @param githubUsername GitHub username to link
     */
    function linkGithubAccount(address developer, string memory githubUsername) external {
        require(
            msg.sender == owner() || trustedMinters[msg.sender],
            "Only owner or trusted minter can link accounts"
        );
        require(bytes(githubUsername).length > 0, "GitHub username cannot be empty");
        require(
            githubToAddress[githubUsername] == address(0) || 
            githubToAddress[githubUsername] == developer,
            "GitHub username already linked to another address"
        );
        
        // Clear old linking if exists
        string memory oldUsername = addressToGithub[developer];
        if (bytes(oldUsername).length > 0) {
            delete githubToAddress[oldUsername];
        }
        
        addressToGithub[developer] = githubUsername;
        githubToAddress[githubUsername] = developer;
        
        emit GithubLinked(developer, githubUsername, block.timestamp);
    }
    
    /**
     * @dev Update Talent Protocol builder score
     * @param developer Address of the developer
     * @param newScore New Talent Protocol score
     */
    function updateTalentScore(address developer, uint256 newScore) external {
        require(
            msg.sender == owner() || trustedMinters[msg.sender],
            "Only owner or trusted minter can update scores"
        );
        
        uint256 oldScore = talentScores[developer];
        talentScores[developer] = newScore;
        
        emit TalentScoreUpdated(developer, oldScore, newScore, block.timestamp);
    }
    
    /**
     * @dev Mint an achievement badge
     * @param recipient Address to receive the NFT
     * @param achievementType Type of achievement
     * @param githubUsername GitHub username of the recipient
     * @param talentScore Talent Protocol score (0 if not applicable)
     * @param isSoulbound Whether the badge is non-transferable
     * @param metadataURI URI for token metadata
     */
    function mintAchievement(
        address recipient,
        AchievementType achievementType,
        string memory githubUsername,
        uint256 talentScore,
        bool isSoulbound,
        string memory metadataURI
    ) public nonReentrant returns (uint256) {
        require(
            msg.sender == owner() || trustedMinters[msg.sender],
            "Only owner or trusted minter can mint"
        );
        require(recipient != address(0), "Cannot mint to zero address");
        require(!hasAchievement[recipient][achievementType], "Achievement already earned");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        achievements[tokenId] = Achievement({
            achievementType: achievementType,
            timestamp: block.timestamp,
            githubUsername: githubUsername,
            talentScore: talentScore,
            isSoulbound: isSoulbound,
            metadataURI: metadataURI
        });
        
        hasAchievement[recipient][achievementType] = true;
        
        emit AchievementMinted(
            recipient,
            tokenId,
            achievementType,
            githubUsername,
            block.timestamp
        );
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint multiple achievements
     * @param recipients Array of recipient addresses
     * @param achievementTypes Array of achievement types
     * @param githubUsernames Array of GitHub usernames
     * @param talentScores Array of Talent Protocol scores
     * @param areSoulbound Array of soulbound flags
     * @param metadataURIs Array of metadata URIs
     */
    function batchMintAchievements(
        address[] memory recipients,
        AchievementType[] memory achievementTypes,
        string[] memory githubUsernames,
        uint256[] memory talentScores,
        bool[] memory areSoulbound,
        string[] memory metadataURIs
    ) external nonReentrant {
        require(
            msg.sender == owner() || trustedMinters[msg.sender],
            "Only owner or trusted minter can mint"
        );
        require(
            recipients.length == achievementTypes.length &&
            recipients.length == githubUsernames.length &&
            recipients.length == talentScores.length &&
            recipients.length == areSoulbound.length &&
            recipients.length == metadataURIs.length,
            "Array lengths must match"
        );
        
        for (uint256 i = 0; i < recipients.length; i++) {
            if (!hasAchievement[recipients[i]][achievementTypes[i]]) {
                mintAchievement(
                    recipients[i],
                    achievementTypes[i],
                    githubUsernames[i],
                    talentScores[i],
                    areSoulbound[i],
                    metadataURIs[i]
                );
            }
        }
    }
    
    /**
     * @dev Get all token IDs owned by an address
     * @param owner Address to query
     * @return Array of token IDs
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Get achievement details for a token
     * @param tokenId Token ID to query
     * @return Achievement struct
     */
    function getAchievement(uint256 tokenId) external view returns (Achievement memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return achievements[tokenId];
    }
    
    /**
     * @dev Check if an address has earned a specific achievement
     * @param developer Address to check
     * @param achievementType Type of achievement
     * @return bool indicating if achievement is earned
     */
    function hasEarnedAchievement(
        address developer,
        AchievementType achievementType
    ) external view returns (bool) {
        return hasAchievement[developer][achievementType];
    }
    
    /**
     * @dev Override transfer function to enforce soulbound tokens
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        if (from != address(0) && to != address(0)) {
            // Check if token is soulbound
            if (achievements[tokenId].isSoulbound) {
                emit SoulboundTransferAttempted(from, to, tokenId);
                revert("This achievement badge is soulbound and cannot be transferred");
            }
        }
        
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Override required by Solidity
     */
    function _increaseBalance(
        address account,
        uint128 value
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
    
    /**
     * @dev Override tokenURI to return metadata
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override supportsInterface
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

