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

    struct Staff {
        uint id;
        string name;
        address wallet_address;
        string role;
        uint salary;
        uint last_payment_time;
    }

    mapping(uint => Student) Students;
    mapping(uint => uint) level_fees;

    mapping(uint => Staff) Staffs;
    // mapping(uint => uint) ;

    event StudentRegistered(uint indexed id,address indexed walletAddress,string name,uint level);
    event PaidFee(uint indexed id,address indexed walletAddress,uint value,uint time_payed);

    constructor(){
        owner = msg.sender;
        level_fees[100] = 1 ether;
        level_fees[200] = 1.5 ether;
        level_fees[300] = 2 ether;
        level_fees[400] = 2.5 ether;
    }

    modifier onlyAdmin(){
        require(msg.sender == owner, "Not and Admin");
        _;
    }
    
    uint studentCount;
    uint staffCount;

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
        require(msg.sender == Students[_id].wallet_address, "Student not exist");
        require(!Students[_id].payment_status, "Student not exist");

        uint level = Students[_id].level;
        uint fee = level_fees[level];

        require(msg.value == fee, "Incorrect fee amount");

        emit PaidFee(_id, msg.sender, msg.value, block.timestamp);

    }

    function registerStaff(string memory _name, string memory role)external onlyAdmin(){
        staffCount = staffCount + 1;
        Staffs memory staff = Staff(staffCount, _name, ,role ,block.timestamp);
    }

    function getStaffById(uint _id) external view returns(Staff memory){
        return Staffs[_id];
    }

    // Geting a Student by Id
    function getStudentById(uint _id) external view returns (Student memory) {
        return Students[_id];
    }

    
}
