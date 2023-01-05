// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FariaCollection is ERC721, Ownable {
    uint256 public MINTED;
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public constant MAX_MINT_PER_WALLET = 2;

    uint256 public price = 1000000000000000;
    string public baseUri =
        "ipfs://bafybeibuwfjhfbjjhokawzpjmx2xxhakxblas62eoiatboicvohzsvnhda/";

    constructor() ERC721("FariaCollection", "FAR") {}

    modifier validateMint(uint256 buyAmount) {
        require(
            buyAmount <= MAX_MINT_PER_WALLET,
            "EXCEEDS_MAX_MINT_PER_WALLET"
        );

        require(MINTED + buyAmount <= MAX_SUPPLY, "MAX_SUPPLY_REACHED");

        require(
            msg.value >= price * buyAmount,
            "TRANSACTION_UNDERVALUED"
        );

        _;
    }

    function publicMint(uint256 buyAmount)
        public
        payable
        validateMint(buyAmount)
    {
        for (uint8 i = 0; i < buyAmount; i++) {
            _safeMint(msg.sender, MINTED + 1);
            MINTED += 1;
        }
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function setBaseUri(string memory _baseUri) external onlyOwner {
        baseUri = _baseUri;
    }

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721)
        returns (string memory)
    {
        require(_exists(tokenId), "URI query for nonexistent token");
        return
            bytes(baseUri).length > 0
                ? string(
                    abi.encodePacked(
                        baseUri,
                        Strings.toString(tokenId),
                        ".json"
                    )
                )
                : "";
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}
