// scripts/testFlow.js
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [owner, user1] = await hre.ethers.getSigners();

  const addresses = JSON.parse(fs.readFileSync("deployedAddresses.json"));

  const ORTtoken = await hre.ethers.getContractFactory("ORTtoken");
  const ort = await ORTtoken.attach(addresses.ORTtoken);

  const NFT = await hre.ethers.getContractFactory("UyArtNFT");
  const nft = await NFT.attach(addresses.UyArtNFT);

  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.attach(addresses.Staking);

  console.log("Transfiriendo 5000 ORT a user1...");
  await ort.transfer(user1.address, 5000);

  console.log("Aprobando 3000 ORT desde user1 para el staking...");
  await ort.connect(user1).approve(staking.target, 3000);

  console.log("User1 hace stake de 3000 ORT...");
  await staking.connect(user1).stake(3000);

  console.log("Avanzando 1001 bloques...");
  for (let i = 0; i < 1001; i++) {
    await hre.network.provider.send("evm_mine");
  }

  console.log("User1 reclama NFTs...");
  await staking.connect(user1).claimNFTs();

  const balance = await nft.balanceOf(user1.address);
  console.log("NFTs obtenidos por user1:", balance.toString());

  const tokenUri = await nft.tokenURI(1);
  console.log("URI del primer NFT:", tokenUri);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
