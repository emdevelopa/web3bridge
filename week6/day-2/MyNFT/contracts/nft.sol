// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721, Ownable {
     constructor(address initialOwner)ERC721("MyNFT", "MFT"){}
     Ownable(initialOwner)

     function mintNFT(address _to, uint nftId, string memory tokenURI ) public  onlyOwner {
        _mint(_to, _tokenId);
        _setTokenUri(_tokenId ,_tokenURI);
     }
}