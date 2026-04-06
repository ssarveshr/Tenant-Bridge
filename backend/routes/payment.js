const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");
const { ethers } = require("ethers");

// Minimum ABI to communicate with the mapped Contract
const CONTRACT_ABI = [
  "function recordTransaction(address _tenant, address _owner, uint256 _amount, uint256 _platformFee, string memory _paymentId) public"
];

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Supabase Admin Client
// We use the service_role key to bypass RLS for inserting trusted transactions
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/payment/create-order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ error: "Failed to create order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payment/verify-payment
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      user_id,
      amount
    } = req.body;

    // 1. Verify Signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // 2. Perform Blockchain Split & Recording using Node App Wallet
    let txHash = null;
    try {
      if (process.env.APP_WALLET_PRIVATE_KEY && process.env.SEPOLIA_RPC_URL && process.env.APP_SMART_CONTRACT_ADDRESS) {
        console.log("💳 Orchestrating Ethereum Blockchain Record...");
        
        // Setup Ethers RPC Connection
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        const wallet = new ethers.Wallet(process.env.APP_WALLET_PRIVATE_KEY, provider);
        
        // Connect to our deployed Custom Solidity Contract
        const contract = new ethers.Contract(process.env.APP_SMART_CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

        // Split Logic: User paid 10000, 5 is platform fee, 9995 to owner.
        // We simulate the mapping by injecting placeholder/fixed addresses as proof-of-concept
        const platformFee = 5;
        const receiverAmount = amount - platformFee;
        const tenantAddress = wallet.address; // Real world: Pull from user profile
        const ownerAddress = "0x0000000000000000000000000000000000000000"; // Real world: Pull property owner

        // Submit to Mempool (costs gas from App Wallet)
        const tx = await contract.recordTransaction(
          tenantAddress,
          ownerAddress,
          amount,
          platformFee,
          razorpay_payment_id
        );
        
        // We get the hash immediately without waiting 30 seconds for mining!
        txHash = tx.hash;
        console.log("✅ Broadcasted to Sepolia! Hash:", txHash);
      }
    } catch (blockchainError) {
      console.error("Blockchain recording skipped/failed:", blockchainError.message);
      // We continue intentionally to securely record the fiat payment in Supabase anyway
    }

    // 3. Verified securely. Save fiat transaction + blockchain txhash to Supabase
    const { data, error } = await supabase.from("transactions").insert([
      {
        user_id: user_id,
        amount: amount,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        blockchain_hash: txHash, // Stores Ethereum Proof on Postgres
        status: "captured",
      },
    ]);

    if (error) {
      console.error("Supabase Insertion Error:", error);
      return res.status(500).json({ error: "Payment verified but failed to record in DB" });
    }

    res.json({ message: "Payment verified successfully", verified: true, blockchain_hash: txHash });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
