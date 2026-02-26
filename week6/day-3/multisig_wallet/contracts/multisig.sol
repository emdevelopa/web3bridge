// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MultiSig {

    address[] public users;

    struct Transaction {
        address user_caller;
        uint id;
        uint amount;
        bool signer1;
        bool signer2;
        bool signed;
    }

    mapping(uint => Transaction) transactions;

    uint id_count;
    uint[] private transactionsID;

    constructor(address _user1, address _user2, address _user3) {
        users.push(_user1);
        users.push(_user2);
        users.push(_user3);
    }

    

    function CreateTransactions(uint _amount) external {
        id_count = id_count + 1;

        Transaction memory trx = Transaction(
            msg.sender,
            id_count,
            _amount,
            false,
            false,
            false
        );

        transactions[id_count] = trx;
        transactionsID.push(id_count);
    }

    function getTransactionById(
        uint _id
    ) external view returns (Transaction memory) {
        for (uint i = 0; i < transactionsID.length; i++) {
            require(
                transactions[_id].id == transactionsID[i],
                "transaction does not exist"
            );
            return transactions[_id];
        }
    }

    function signTransaction1(uint _id) external {
        require(
            transactions[_id].user_caller != msg.sender,
            "You can not sign this transaction cus created the Transaction"
        );

        for (uint i = 0; i < users.length; i++) {
            if (users[i] == msg.sender) transactions[_id].signer1 = true;
            for (uint i = 0; i < users.length; i++) {
                if (users[i] == msg.sender) transactions[_id].signer2 = true;
                withdraw(
                    transactions[_id].user_caller,
                    transactions[_id].amount
                );
            }
        }
    }

    function signTransaction2(uint _id) external {
        require(
            transactions[_id].user_caller != msg.sender,
            "You can not sign this transaction cus created the Transaction"
        );

        for (uint i = 0; i < users.length; i++) {
            if (users[i] == msg.sender) transactions[_id].signer2 = true;
            withdraw(transactions[_id].user_caller, transactions[_id].amount);
        }
    }

    function withdraw(address _to, uint _amount) internal returns (bool) {
        (bool success, ) = payable(_to).call{value: _amount}("");
        return success;
    }

    receive() external payable{}
    fallback() external{}
}
