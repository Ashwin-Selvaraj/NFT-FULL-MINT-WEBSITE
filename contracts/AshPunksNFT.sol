//SPDX-license-Identifier: UNLICENSED

pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// ownable will allow us to deifne the functions only the owner can able to access

contract AshPunksNFT is ERC721, Ownable {
    uint256 public mintPrice;
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    // this bool will tell us whether user can able to mint
    bool public isPublicMintEnabled;
    // The url at which the opensea can used to determine where the images are located
    string internal baseTokenUri;
    address payable public withdrawWallet;
    // Mapping to keep track of all the mints
    mapping(address => uint256) public walletMints;

    constructor() payable ERC721("AshPunks", "AP") {
        mintPrice = 0.02 ether;
        totalSupply = 0;
        maxSupply = 1000;
        maxPerWallet = 3;
        withdrawWallet = payable(msg.sender);
        Ownable.transferOwnership(msg.sender);
    }

    function setPublicMintEnabled(
        bool _isPublicMintEnabled
    ) external onlyOwner {
        isPublicMintEnabled = _isPublicMintEnabled;
    }

    function setBaseTokenUri(string calldata _baseTokenUri) external onlyOwner {
        baseTokenUri = _baseTokenUri;
    }

    function tokenURI(
        uint256 tokenId_
    ) public view override returns (string memory) {
        require(_exists(tokenId_), "Token does not exist");
        // This is how opensea will get the uri for all the token IDs
        // abi.encodePacked concatinates all the 3 arguments
        return
            string(
                abi.encodePacked(
                    baseTokenUri,
                    Strings.toString(tokenId_),
                    ".json"
                )
            );
    }

    function withdraw() external onlyOwner {
        (bool success, ) = withdrawWallet.call{value: address(this).balance}(
            ""
        );
        require(success, "Withdraw failed");
    }

    function mint(uint256 _quantity) public payable {
        require(isPublicMintEnabled, "minting not enabled");
        require(
            msg.value == _quantity * mintPrice,
            "Wrong mint value or insufficient funds to mint"
        );
        require(totalSupply + _quantity < maxSupply, "Sold out");
        require(
            walletMints[msg.sender] + _quantity <= maxPerWallet,
            "excedded max per wallet"
        );

        for (uint256 i = 0; i < _quantity; i++) {
            uint256 newTokenId = totalSupply + 1;
            totalSupply++;
            _safeMint(msg.sender, newTokenId);
            walletMints[msg.sender]++;
        }
    }
}
