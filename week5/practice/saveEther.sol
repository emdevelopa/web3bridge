// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SaveEther {
    // deposit ether
    // withdraw ether
    // getBalnce
    // get Contract balance

    mapping(address => uint) balance;

    event Deposit(address indexed from, address indexed to, uint value );
    event widrawalSuccessful(address indexed receiver, uint _amount);
    function deposit() external payable {
        // require(,"");

        balance[msg.sender] = balance[msg.sender] + msg.value;

        emit Deposit(address(0),msg.sender, msg.value);
    }

    function withdraw(uint _amount) external {
        require(balance[msg.sender] >= _amount, "insufficient balance");
        // require();

        balance[msg.sender] = balance[msg.sender] - _amount;

        (bool result, ) = payable(msg.sender).call{value: _amount}("");

        require(result, "withdrawaal fails");

        emit widrawalSuccessful(msg.sender,_amount);

    }

    function getBalance() external view returns(uint){
        return balance[msg.sender];
    }


    function getContractBalance() external view returns(uint){
        return balance[address(this)];
    }
    receive() external payable {}
    fallback() external {}
}
