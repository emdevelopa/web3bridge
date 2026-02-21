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

    uint256 public studentCount;
    uint256 public staffCount;

    mapping(uint256 => Student) public students;
    mapping(uint256 => Staff) public staffs;

    // Owner
    address public owner;

   constructor() {
        owner = msg.sender;

        levelFees[100] = 0.5 ether;
        levelFees[200] = 1 ether;
        levelFees[300] = 1.5 ether;
        levelFees[400] = 2 ether;
    }


    // Events
    event StudentRegistered(uint256 id, string name, uint256 level, bool feePaid);
    event StaffRegistered(uint256 id, string name, string role);
    event FeePaid(uint256 studentId, uint256 amount, uint256 timestamp);
    event SalaryPaid(uint256 staffId, uint256 amount, uint256 timestamp);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier validLevel(uint256 _level) {
        require(
            _level == 100 || _level == 200 || _level == 300 || _level == 400,
            "Invalid level. Must be 100, 200, 300 or 400"
        );
        _;
    }


}