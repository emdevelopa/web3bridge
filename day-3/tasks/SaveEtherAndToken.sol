// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

 
 

contract SaveEtherAndToken {
    mapping(address => uint) private etherBalances;


    function depositEther() external payable{

        require(msg.value > 0, "must send ether");

        etherBalances[msg.sender] = msg.value;

    }


    function getEtherBal(address user) public view returns(uint){
        return etherBalances[user];
    }




}
