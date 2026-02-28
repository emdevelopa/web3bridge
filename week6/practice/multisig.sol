// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MultiSig {
    address[] public owners;

    struct Transaction {
        uint id;
        address caller;
        uint amount;
        uint signerCount;
        bool completed;
    }

    Transaction[] public transactions;
    mapping(address => bool) isOwner;
    mapping(uint => mapping(address => bool)) isConfirmed;

    uint trxId;
    uint required;
    constructor(address[] memory _owners, uint _required) {
        require(_owners.length > 0, "owners required");
        require(
            _required > 0 && _required <= _owners.length,
            "Invalid required number"
        );

        for (uint i; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid address");
            require(!isOwner[owner], "not an Owner");

            isOwner[owner] = true;
        }
        required = _required;
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not part of owner");
        _;
    }

    function deposit() external payable onlyOwner {
    require(msg.value > 0, "Must send ETH");
}

    function createTransaction(uint _amount) external onlyOwner {
        require(
            address(this).balance >= _amount,
            "Insufficient contract balance"
        );

        uint txId = transactions.length;

        transactions.push(
            Transaction({
                id: txId,
                caller: msg.sender,
                amount: _amount,
                signerCount: 1, // auto-confirm
                completed: false
            })
        );

        isConfirmed[txId][msg.sender] = true;
    }

    function signTransaction(uint _txId) external onlyOwner {
        require(_txId < transactions.length, "Transaction does not exist");

        Transaction storage trx = transactions[_txId];

        require(!trx.completed, "Transaction already executed");
        require(!isConfirmed[_txId][msg.sender], "Already signed");

        isConfirmed[_txId][msg.sender] = true;
        trx.signerCount++;

        if (trx.signerCount >= required) {
            require(
                address(this).balance >= trx.amount,
                "Insufficient balance"
            );

            trx.completed = true;

            (bool success, ) = payable(trx.caller).call{value: trx.amount}("");
            require(success, "Transfer failed");
        }
    }

    receive() external payable {}
    fallback() external {}
}
