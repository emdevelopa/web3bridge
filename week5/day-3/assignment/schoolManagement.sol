// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SchoolSystem{
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    struct Student {
        uint id;
        string name;
        uint level;
        uint schoolFees;
        bool hasPaid;
        uint paymentTimestamp;
    }

    struct Staff {
        uint id;
        string name;
        string role;
        uint salary;
        bool isPaid;
        uint paymentTimestamp;
    }

    mapping(uint => Student) public students;
    mapping(uint => Staff) public staffs;

    uint[] public studentIds;
    uint[] public staffCounter;

    uint public studentCounter;
    uint public staffCounter;
}