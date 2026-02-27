// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MultiSig {

    /*//////////////////////////////////////////////////////////////
                               EVENTS
    //////////////////////////////////////////////////////////////*/

    event Deposit(address indexed sender, uint amount);
    event TransactionCreated(uint indexed id, address indexed creator, address to, uint amount);
    event TransactionSigned(uint indexed id, address indexed signer);
    event TransactionExecuted(uint indexed id);

    /*//////////////////////////////////////////////////////////////
                               STORAGE
    //////////////////////////////////////////////////////////////*/

    address[] public owners;
    mapping(address => bool) public isOwner;

    uint public transactionCount;

    struct Transaction {
        address creator;
        address to;
        uint amount;
        uint confirmations;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;

    // transactionId => owner => signed?
    mapping(uint => mapping(address => bool)) public hasSigned;

    uint public constant REQUIRED_CONFIRMATIONS = 2;

    /*//////////////////////////////////////////////////////////////
                              MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not owner");
        _;
    }

    modifier txExists(uint _txId) {
        require(_txId < transactionCount, "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint _txId) {
        require(!transactions[_txId].executed, "Transaction already executed");
        _;
    }

    modifier notSigned(uint _txId) {
        require(!hasSigned[_txId][msg.sender], "Already signed");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address _owner1, address _owner2, address _owner3) {
        require(_owner1 != address(0) && _owner2 != address(0) && _owner3 != address(0), "Zero address");
        require(_owner1 != _owner2 && _owner1 != _owner3 && _owner2 != _owner3, "Duplicate owners");

        owners.push(_owner1);
        owners.push(_owner2);
        owners.push(_owner3);

        isOwner[_owner1] = true;
        isOwner[_owner2] = true;
        isOwner[_owner3] = true;
    }

    /*//////////////////////////////////////////////////////////////
                           RECEIVE ETHER
    //////////////////////////////////////////////////////////////*/

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /*//////////////////////////////////////////////////////////////
                        CREATE TRANSACTION
    //////////////////////////////////////////////////////////////*/

    function createTransaction(address _to, uint _amount)
        external
        onlyOwner
    {
        require(address(this).balance >= _amount, "Insufficient balance");

        uint txId = transactionCount;

        transactions[txId] = Transaction({
            creator: msg.sender,
            to: _to,
            amount: _amount,
            confirmations: 0,
            executed: false
        });

        transactionCount++;

        emit TransactionCreated(txId, msg.sender, _to, _amount);
    }

    /*//////////////////////////////////////////////////////////////
                           SIGN TRANSACTION
    //////////////////////////////////////////////////////////////*/

    function signTransaction(uint _txId)
        external
        onlyOwner
        txExists(_txId)
        notExecuted(_txId)
        notSigned(_txId)
    {
        Transaction storage txn = transactions[_txId];

        require(txn.creator != msg.sender, "Creator cannot sign");

        hasSigned[_txId][msg.sender] = true;
        txn.confirmations++;

        emit TransactionSigned(_txId, msg.sender);

        if (txn.confirmations >= REQUIRED_CONFIRMATIONS) {
            _executeTransaction(_txId);
        }
    }

    /*//////////////////////////////////////////////////////////////
                          EXECUTE INTERNAL
    //////////////////////////////////////////////////////////////*/

    function _executeTransaction(uint _txId) internal {
        Transaction storage txn = transactions[_txId];

        require(!txn.executed, "Already executed");
        require(txn.confirmations >= REQUIRED_CONFIRMATIONS, "Not enough confirmations");

        txn.executed = true;

        (bool success, ) = payable(txn.to).call{value: txn.amount}("");
        require(success, "Transfer failed");

        emit TransactionExecuted(_txId);
    }

    /*//////////////////////////////////////////////////////////////
                             VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getTransaction(uint _txId)
        external
        view
        returns (Transaction memory)
    {
        return transactions[_txId];
    }

    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}