const hre = require("hardhat");

async function main() {
  console.log("Compiling and strictly deploying the TransactionRegistry to Ethereum Sepolia...");

  const Registry = await hre.ethers.getContractFactory("TransactionRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  
  console.log("------------------------------------------");
  console.log(`✅ TransactionRegistry deployed securely to: ${contractAddress}`);
  console.log("💡 Copy the address above. You will need it in your APP_SMART_CONTRACT_ADDRESS environment variable!");
  console.log("------------------------------------------");
}

main().catch((error) => {
  console.error("Deployment Error:", error);
  process.exitCode = 1;
});
