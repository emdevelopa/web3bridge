import { network } from "hardhat";

const { ethers } = await network.connect();


async function main() {
  const contractAddress = "  ";

  const nft = await ethers.getContractAt("MyNFT", contractAddress);

  const tx = await nft.mintNFT(
    "0x66e469D9CBAD5d88F1257e48B9c82171547a6517",
    1,
    "https://gateway.pinata.cloud/ipfs/bafkreibcgf7ch72my4yhujfemcecjnjrdnscy7xwhytertumpmy5czo7ca",
  );

  await tx.wait();

  console.log("NFT Minted!");
}

main();
