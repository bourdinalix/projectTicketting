// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @custom:security-contact security@spacekids.io
contract SpaceKidsClub is
    ERC721,
    ERC721Enumerable,
    Pausable,
    Ownable,
    ReentrancyGuard,
    PaymentSplitter
{
    using Counters for Counters.Counter;
    using Strings for uint256;

    //Max NFT supply
    uint256 public constant MAX_SUPPLY = 5555;

    //The different whitelists Merkle roots
    bytes32 public presaleWhitelistRoot;
    bytes32 public publicWhitelistRoot;

    //ID of the next NFT to mint
    Counters.Counter private _nftIdCounter;

    //Maximum mint quantity
    uint256 maxMintPresale = 5;
    uint256 maxMintWhitelist = 5;
    uint256 public maxMintQuantity = 5;

    //The different prices
    uint256 public presalePrice = 0.08 ether;
    uint256 public whitelistPrice = 0.1 ether;
    uint256 public salePrice = 0.3 ether;

    //URI of the NFTs when revealed
    string public baseURI;
    //URI of the NFTs when not revealed
    string public unrevealedURI;

    //Are the NFTs revealed yet
    bool public revealed = false;

    //The statuses of the collection
    enum Status {
        Before,
        Presale,
        WhitelistSale,
        Sale,
        SoldOut,
        Reveal
    }

    Status public status = Status.Before;

    //Events
    event ChangePresaleConfig(
        uint256 _startTime,
        uint256 _duration,
        uint256 _maxCount
    );
    event ChangeSaleConfig(uint256 _startTime, uint256 _maxCount);
    event ChangeIsBurnEnabled(bool _isBurnEnabled);
    event ChangeBaseURI(string _baseURI);
    event GiftMint(address indexed _recipient, uint256 _amount);
    event PresaleMint(address indexed _minter, uint256 _amount, uint256 _price);
    event WhitelistMint(
        address indexed _minter,
        uint256 _amount,
        uint256 _price
    );
    event SaleMint(address indexed _minter, uint256 _amount, uint256 _price);
    event StatusChange(Status _previousStatus, Status _newStatus);
    event PauseMint();
    event UnpauseMint();
    event Revealed();

    //Owner of the smart contract
    address private _owner;

    //Keep a track of the number of tokens per address
    mapping(address => uint256) nftsPerWallet;

    //Addresses of all the members of the team
    address[] private _team = [0xdD870fA1b7C4700F2BD7f44238821C26f7392148];

    //Shares of all the members of the team
    uint256[] private _teamShares = [100];

    constructor(
        string memory _newBaseURI,
        string memory _unrevealedURI,
        bytes32 _whitelistRoot,
        bytes32 _presaleWhitelistRoot
    ) ERC721("SpaceKidsClub", "SKC") PaymentSplitter(_team, _teamShares) {
        baseURI = _newBaseURI;
        unrevealedURI = _unrevealedURI;
        publicWhitelistRoot = _whitelistRoot;
        presaleWhitelistRoot = _presaleWhitelistRoot;
    }

    /**
     * @notice Pauses mint operations
     **/
    function pause() public onlyOwner {
        _pause();
        emit PauseMint();
    }

    /**
     * @notice Unpauses mint operations
     **/
    function unpause() public onlyOwner {
        _unpause();
        emit UnpauseMint();
    }

    /**
     * @notice Edit the Merkle Root of the presale
     *
     * @param _newPresaleMerkleRoot The new Merkle Root
     **/
    function changePresaleMerkleRoot(bytes32 _newPresaleMerkleRoot)
        external
        onlyOwner
    {
        presaleWhitelistRoot = _newPresaleMerkleRoot;
    }

    /**
     * @notice Edit the Merkle Root of the public whitelist
     *
     * @param _newWhitelistMerkleRoot The new Merkle Root
     **/
    function changeWhitelistMerkleRoot(bytes32 _newWhitelistMerkleRoot)
        external
        onlyOwner
    {
        publicWhitelistRoot = _newWhitelistMerkleRoot;
    }

    /**
     * @notice Change the number of NFTs that an address can mint
     *
     * @param _maxMintAllowed The number of NFTs that an address can mint
     **/
    function changeMaxMint(uint256 _maxMintAllowed) external onlyOwner {
        maxMintQuantity = _maxMintAllowed;
    }

    /**
     * @notice Change the number of NFTs that an address can mint during presale
     *
     * @param _maxMintAllowed The number of NFTs that an address can mint
     **/
    function changeMaxMintPresale(uint256 _maxMintAllowed) external onlyOwner {
        maxMintPresale = _maxMintAllowed;
    }

    /**
     * @notice Change the number of NFTs that an address can mint during whitelist
     *
     * @param _maxMintAllowed The number of NFTs that an address can mint
     **/
    function changeMaxMintWhitelist(uint256 _maxMintAllowed)
        external
        onlyOwner
    {
        maxMintWhitelist = _maxMintAllowed;
    }

    /**
     * @notice Change the price of one NFT for the presale and whitelist sale
     *
     * @param _pricePresale The new price of one NFT for the presale and whitelist sale
     **/
    function changePricePresale(uint256 _pricePresale) external onlyOwner {
        presalePrice = _pricePresale;
    }

    /**
     * @notice Change the price of one NFT for the presale and whitelist sale
     *
     * @param _whitelistPrice The new price of one NFT for the presale and whitelist sale
     **/
    function changePriceWhitelist(uint256 _whitelistPrice) external onlyOwner {
        whitelistPrice = _whitelistPrice;
    }

    /**
     * @notice Change the price of one NFT for the sale
     *
     * @param _priceSale The new price of one NFT for the sale
     **/
    function changePriceSale(uint256 _priceSale) external onlyOwner {
        salePrice = _priceSale;
    }

    /**
     * @notice Change the base URI
     *
     * @param _newBaseURI The new base URI
     **/
    function setBaseUri(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    /**
     * @notice Change the not revealed URI
     *
     * @param _unrevealedURI The new not revealed URI
     **/
    function setNotRevealURI(string memory _unrevealedURI) external onlyOwner {
        unrevealedURI = _unrevealedURI;
    }

    /**
     * @notice Allows to set the revealed variable to true
     **/
    function reveal() external onlyOwner {
        revealed = true;
        emit Revealed();
    }

    /**
     * @notice Return URI of the NFTs when revealed
     *
     * @return The URI of the NFTs when revealed
     **/
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @notice Allows to change the status to Presale
     **/
    function setupPresale() external onlyOwner {
        require(
            status == Status.Before,
            "The collection is not in the right status to set up presale, should be Before"
        );
        status = Status.Presale;
        emit StatusChange(Status.Before, status);
    }

    /**
     * @notice Allows to change the status to Whitelist
     **/
    function setupWhitelistPresale() external onlyOwner {
        require(
            status == Status.Presale,
            "The collection is not in the right status to set up whitelist sale, should be Presale"
        );
        status = Status.WhitelistSale;
        emit StatusChange(Status.Presale, status);
    }

    /**
     * @notice Allows to change the status to Sale
     **/
    function setupSale() external onlyOwner {
        require(
            status == Status.WhitelistSale,
            "The collection is not in the right status to set up sale, should be WhitelistSale"
        );
        status = Status.Sale;
        emit StatusChange(Status.WhitelistSale, status);
    }

    /**
     * @notice Allows to mint one NFT if whitelisted for presale
     *
     * @param _account The account of the user minting the NFT
     * @param _proof The Merkle Proof
     **/
    function presaleMint(address _account, bytes32[] calldata _proof)
        external
        payable
        whenNotPaused
        nonReentrant
    {
        //Are we in Presale
        require(status == Status.Presale, "Presale has not started yet.");
        //Did this account already mint an NFT
        require(
            nftsPerWallet[_account] < maxMintPresale,
            "You can only get 5 NFTs on the Presale"
        );
        //Is this user on the whitelist
        require(
            isOnWhitelist(presaleWhitelistRoot, _account, _proof),
            "Not on the whitelist"
        );
        //Did the user send enough Ethers
        require(msg.value >= presalePrice, "Insufficent funds.");
        //Increment the number of NFTs this user minted
        nftsPerWallet[_account]++;
        //Mint the user NFT
        _safeMint(_account, _nftIdCounter.current());
        //Increment the Id of the next NFT to mint
        _nftIdCounter.increment();
    }

    /**
     * @notice Allows to mint one NFT if whitelisted for presale
     *
     * @param _account The account of the user minting the NFT
     * @param _proof The Merkle Proof
     **/
    function whitelistMint(address _account, bytes32[] calldata _proof)
        external
        payable
        whenNotPaused
        nonReentrant
    {
        //Are we in Whitelist
        require(status == Status.Presale, "Presale has not started yet.");
        //Did this account already mint an NFT
        require(
            nftsPerWallet[_account] < maxMintWhitelist,
            "You can only get 1 NFT on the Presale"
        );
        //Is this user on the whitelist
        require(
            isOnWhitelist(publicWhitelistRoot, _account, _proof),
            "Not on the whitelist"
        );
        //Did the user send enough Ethers
        require(msg.value >= whitelistPrice, "Insufficent funds.");
        //Increment the number of NFTs this user minted
        nftsPerWallet[_account]++;
        //Mint the user NFT
        _safeMint(_account, _nftIdCounter.current());
        //Increment the Id of the next NFT to mint
        _nftIdCounter.increment();
    }

    /**
     * @notice Allows to mint NFTs
     *
     * @param _amount The ammount of NFTs the user wants to mint
     **/
    function saleMint(uint256 _amount)
        external
        payable
        whenNotPaused
        nonReentrant
    {
        //Number of NFT sold
        uint256 supply = totalSupply();
        //If everything has been bought
        require(status != Status.SoldOut, "Sorry, no NFTs left.");
        //If Sale didn't start yet
        require(status == Status.Sale, "Sorry, sale has not started yet.");
        //Has user paid enough Ethers
        require(msg.value >= salePrice * _amount, "Insufficent funds.");
        //The user can only mint max 3 NFTs
        require(
            _amount <= maxMintQuantity,
            "You can't mint more than 3 tokens"
        );
        //If the user try to mint any non-existent token
        require(
            supply + _amount <= MAX_SUPPLY,
            "Sale is almost done and we don't have enough NFTs left."
        );
        //Add the ammount of NFTs minted by the user to the total he minted
        nftsPerWallet[msg.sender] += _amount;
        //If this account minted the last NFTs available
        if (supply + _amount == MAX_SUPPLY) {
            status = Status.SoldOut;
        }
        //Minting all the account NFTs
        for (uint256 i = 1; i <= _amount; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }

    /**
     * @notice Allows to gift one NFT to an address
     *
     * @param _account The account of the new owner of one NFT
     **/
    function gift(address _account) external onlyOwner {
        require(totalSupply() + 1 <= MAX_SUPPLY, "Sold out");
        _safeMint(_account, totalSupply() + 1);
    }

    /**
     * @notice Return true or false if the account is public whitelisted or not
     *
     * @param _account The account of the user
     * @param _proof The Merkle Proof
     *
     * @return true or false if the account is whitelisted or not
     **/
    function isOnWhitelist(
        bytes32 _merkleTree,
        address _account,
        bytes32[] calldata _proof
    ) internal pure returns (bool) {
        return
            MerkleProof.verify(
                _proof,
                _merkleTree,
                keccak256(abi.encodePacked(_account))
            );
    }

    /**
     * @notice Allows to get the complete URI of a specific NFT by his ID
     *
     * @param _nftId The id of the NFT
     *
     * @return The token URI of the NFT which has _nftId Id
     **/
    function tokenURI(uint256 _nftId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        require(_exists(_nftId), "This NFT doesn't exist.");
        if (revealed == false) {
            return unrevealedURI;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(currentBaseURI, _nftId.toString(), ".json")
                )
                : "";
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
