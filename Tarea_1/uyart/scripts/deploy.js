const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // 1. Deploy ORTtoken
  const ORTToken = await hre.ethers.getContractFactory("ORTtoken");
  const ortToken = await ORTToken.deploy();
  await ortToken.waitForDeployment();
  console.log("ORTtoken deployed to:", ortToken.target);

  // 2. Deploy UyArtNFT
  const UyArtNFT = await hre.ethers.getContractFactory("UyArtNFT");
  const uyArt = await UyArtNFT.deploy();
  await uyArt.waitForDeployment();
  console.log("UyArtNFT deployed to:", uyArt.target);

  // 3. Deploy Staking
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(ortToken.target, uyArt.target);
  await staking.waitForDeployment();
  console.log("Staking deployed to:", staking.target);

  // 4. Autorizar Staking como minter del NFT
  const tx = await uyArt.setMinter(staking.target);
  await tx.wait();
  console.log("Staking autorizado como minter");

const addresses = {
  ORTtoken: ortToken.target,
  UyArtNFT: uyArt.target,
  Staking: staking.target
};

fs.writeFileSync("deployedAddresses.json", JSON.stringify(addresses, null, 2));
console.log("Direcciones guardadas en deployedAddresses.json");

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
