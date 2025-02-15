const ethers = require("ethers"); // v5 syntax
require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function main() {
  // Initialize provider and wallet for Sepolia network
  const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Load contract ABI
  const contractAddress = "0xdF4EA94BBD36975DC8A070833f90291bd662D142"; // Replace with actual contract address
  const contractABIPath = path.join(__dirname, "../artifacts/contracts/Transactions.sol/Transactions.json");
  const contractABI = JSON.parse(fs.readFileSync(contractABIPath)).abi;

  // Initialize contract
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  const numTransactions = 50;
  const startTime = Date.now();

  console.log(`📌 Sending ${numTransactions} transactions...`);

  for (let i = 0; i < numTransactions; i++) {
    try {
      // Get latest nonce before each transaction
      const nonce = await provider.getTransactionCount(wallet.address, "latest");

      const tx = await contract.addToBlockchain(
        "0xf04E175Ab8B608BA3e464D5f9d1Db020d20Fd115",
        ethers.utils.parseEther("0.001"),
        "Scalability test",
        "test",
        { nonce: nonce, gasLimit: 21000, gasPrice: ethers.utils.parseUnits("10", "gwei") }
      );

      console.log(`✅ Transaction ${i + 1} sent: ${tx.hash}`);

      await tx.wait(); // Wait for confirmation to prevent nonce issues
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to prevent nonce collision
    } catch (error) {
      console.error(`❌ Error sending transaction ${i + 1}:`, error);
    }
  }

  const endTime = Date.now();
  const tps = numTransactions / ((endTime - startTime) / 1000);
  console.log(`🚀 Transactions Per Second (TPS): ${tps}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });