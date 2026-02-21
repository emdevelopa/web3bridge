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
    event StudentRegistered(
        uint256 id,
        string name,
        uint256 level,
        bool feePaid
    );
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

    function registerStudent(
        string memory _name,
        uint256 _level
    ) public payable validLevel(_level) {
        uint256 requiredFee = levelFees[_level];
        require(msg.value >= requiredFee, "Insufficient fee payment");

        studentCount++;

        students[studentCount] = Student({
            id: studentCount,
            name: _name,
            level: _level,
            walletAddress: msg.sender,
            feePaid: true,
            amountPaid: msg.value,
            paymentTimestamp: block.timestamp
        });

        emit StudentRegistered(studentCount, _name, _level, true);
        emit FeePaid(studentCount, msg.value, block.timestamp);
    }

    function registerStaff(
        string memory _name,
        string memory _role,
        address _walletAddress,
        uint256 _salary
    ) public onlyOwner {
        staffCount++;

        staffs[staffCount] = Staff({
            id: staffCount,
            name: _name,
            role: _role,
            walletAddress: _walletAddress,
            salary: _salary,
            salaryPaid: false,
            paymentTimestamp: 0
        });

        emit StaffRegistered(staffCount, _name, _role);
    }

    function payStaff(uint256 _staffId) public payable onlyOwner {
        Staff storage staff = staffs[_staffId];

        require(staff.id != 0, "Staff does not exist");
        require(msg.value >= staff.salary, "Insufficient salary amount");

        (bool sent, ) = staff.walletAddress.call{value: msg.value}("");
        require(sent, "Payment failed");

        staff.salaryPaid = true;
        staff.paymentTimestamp = block.timestamp;

        emit SalaryPaid(_staffId, msg.value, block.timestamp);
    }

    function updateStudentPaymentStatus(uint256 _studentId) public payable {
        Student storage student = students[_studentId];

        require(student.id != 0, "Student does not exist");
        require(!student.feePaid, "Fee already marked as paid");

        uint256 requiredFee = levelFees[student.level];
        require(msg.value >= requiredFee, "Insufficient payment");

        student.feePaid = true;
        student.amountPaid = msg.value;
        student.paymentTimestamp = block.timestamp;

        emit FeePaid(_studentId, msg.value, block.timestamp);
    }
}
