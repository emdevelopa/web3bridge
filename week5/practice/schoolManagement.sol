// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SchoolManagement {
    address owner;

    struct Student {
        uint id;
        string name;
        address wallet_address;
        uint level;
        uint fee_amount;
        bool payment_status;
        uint payment_time;
    }

    mapping(uint => Student) Students;
    mapping(uint => uint) level_fees;

    event StudentRegistered(uint id,address indexed walletAddress,string name,uint level);

    constructor(){
        owner = msg.sender;
        level_fees[100] = 1 ether;
        level_fees[200] = 1.2 ether;
        level_fees[300] = 1.3 ether;
        level_fees[400] = 2 ether;
    }

    modifier onlyAdmin(){
        require(msg.sender == owner, "Not and Admin");
        _;
    }
    
    uint studentCount;

    // Registering a Student
    function registerStudent(
        string memory _name,
        uint _level
    ) external {
        require(msg.sender == owner, "Admin can not register as student");
        studentCount = studentCount + 1;

        Student memory newStudent = Student(
            studentCount,
            _name,
            msg.sender,
            _level,
            level_fees[_level],
            false,
            block.timestamp
        );

        Students[studentCount] = newStudent;

        emit StudentRegistered(studentCount, msg.sender, _name, _level);
    }

    function StudentPayFee(uint _id)external payable{
        require(msg.sender != owner, "Admin can not pay student fee");
        require(msg.sender == Students[_id].wallet_address, "Student not exist");
        require(!Students[_id].payment_status, "Student not exist");

        uint level = Students[_id].level;
        uint fee = level_fees[level];

        require(msg.value == fee, "Incorrect fee amount");

    }

    // Geting a Student by Id
    function getStudentById(uint _id) external view returns (Student memory) {
        return Students[_id];
    }

    
}
