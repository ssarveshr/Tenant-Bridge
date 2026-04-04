// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TransactionRegistry {
    address public admin;

    struct RentTransaction {
        address tenant;
        address owner;
        uint256 amount;
        uint256 platformFee;
        uint256 timestamp;
        string paymentId;
    }

    // Store transactions securely indexed by their Razorpay payment ID
    mapping(string => RentTransaction) public transactions;

    // Events allow external Dapps to listen for successful logging
    event TransactionRecorded(
        string indexed paymentId,
        address indexed tenant,
        address indexed owner,
        uint256 amount,
        uint256 platformFee,
        uint256 timestamp
    );

    constructor() {
        admin = msg.sender;
    }

    function recordTransaction(
        address _tenant,
        address _owner,
        uint256 _amount,
        uint256 _platformFee,
        string memory _paymentId
    ) public {
        // Enforce that only the App Backend Wallet (Admin) can log transactions to protect integrity
        require(msg.sender == admin, "Only admin server can record transactions");
        // Ensure it has not been recorded before
        require(transactions[_paymentId].timestamp == 0, "Transaction already recorded");

        RentTransaction memory newTx = RentTransaction({
            tenant: _tenant,
            owner: _owner,
            amount: _amount,
            platformFee: _platformFee,
            timestamp: block.timestamp,
            paymentId: _paymentId
        });

        transactions[_paymentId] = newTx;

        emit TransactionRecorded(_paymentId, _tenant, _owner, _amount, _platformFee, block.timestamp);
    }
}
