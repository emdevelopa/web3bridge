// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint public tokenCount;

    constructor(address initialOwner)
        ERC721("MyNFT", "MFT")
        Ownable(initialOwner)
    {
        tokenCount = 0;
    }

    function mintNFT(
        address _to,
        uint256 nftId,
        string memory tokenURI
    ) public onlyOwner {
        _mint(_to, nftId);
        _setTokenURI(nftId, tokenURI);

        tokenCount++;
    }
}