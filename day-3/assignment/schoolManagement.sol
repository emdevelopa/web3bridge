// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SchoolManagement {

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
    uint[] public staffIds;

    uint public studentCounter;
    uint public staffCounter;

 
    function registerStudent(string memory _name, uint _level) public payable {

        require(_level >= 100 && _level <= 400, "Invalid level");

        studentCounter++;

        uint fee = getFeeByLevel(_level);

        require(msg.value == fee, "Incorrect school fee");

        students[studentCounter] = Student(
            studentCounter,
            _name,
            _level,
            fee,
            true,
            block.timestamp
        );

        studentIds.push(studentCounter);
    }

 
    function registerStaff(string memory _name, string memory _role, uint _salary) public onlyOwner {

        staffCounter++;

        staffs[staffCounter] = Staff(
            staffCounter,
            _name,
            _role,
            _salary,
            false,
            0
        );

        staffIds.push(staffCounter);
    }

     
    function payStaff(uint _staffId) public payable onlyOwner {

        Staff storage s = staffs[_staffId];

        require(!s.isPaid, "Already paid");
        require(msg.value == s.salary, "Incorrect salary amount");

        s.isPaid = true;
        s.paymentTimestamp = block.timestamp;
    }
 
    function getStudent(uint _studentId) public view returns (Student memory) {
        return students[_studentId];
    }

 
    function getAllStaff() public view returns (uint[] memory) {
        return staffIds;
    }

     
    function getFeeByLevel(uint _level) internal pure returns (uint) {
        if (_level == 100) return 1 ether;
        if (_level == 200) return 2 ether;
        if (_level == 300) return 3 ether;
        if (_level == 400) return 4 ether;

        revert("Invalid level");
    }
}
