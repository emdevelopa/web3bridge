// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SchoolSys {

    struct Student {
        uint256 id;
        string name;
        uint256 level;
        address walletAddress;
        bool feePaid;
        uint256 amountPaid;
        uint256 paymentTimestamp;
    }
    struct Staff {
        uint256 id;
        string name;
        string role;
        address walletAddress;
        uint256 salary;
        bool salaryPaid;
        uint256 paymentTimestamp;
    }

    mapping(uint256 => uint256) public levelFees;

    constructor() {
        levelFees[100] = 0.5 ether;
        levelFees[200] = 1 ether;
        levelFees[300] = 1.5 ether;
        levelFees[400] = 2 ether;
    }

    uint256 public studentCount;
    uint256 public staffCount;

    mapping(uint256 => Student) public students;
    mapping(uint256 => Staff) public staffs;

    // Owner
    address public owner;

}