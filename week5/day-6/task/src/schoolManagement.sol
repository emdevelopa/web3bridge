// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import "./IERC20.sol";

contract mySchool {
    IERC20 public token;
    address public schoolAdmin;

    uint public nextStaffId;
    uint public nextStudentId;
    uint256 public faucetTokens = 1000 * 10 ** 18;
    uint256 constant SALARY_INTERVAL = 30 days;

    enum Role { Admin, Staff, Student }
    enum PaymentStatus { Unpaid, Paid }

    struct Staff {
        uint id;
        string fullName;
        address wallet;
        uint monthlySalary;
        bool hasBeenPaid;
        uint lastPaidAt;
        Role role;
        bool claimed;
        uint claimedAt;
        bool suspended;
    }

    struct Student {
        uint id;
        string fullName;
        address wallet;
        uint level;
        uint8 age;
        uint feesPaid;
        PaymentStatus paymentStatus;
        Role role;
        bool claimed;
        uint claimedAt;
    }

    mapping(address => Role) public roles;
    mapping(uint => uint256) public levelFees;
    mapping(address => bool) public faucetClaimed;
    mapping(address => uint256) public totalClaimed;
    mapping(address => Student) public students;
    mapping(address => Staff) public staffMembers;
    mapping(address => uint256) public lastSalaryPaid;

    Student[] public studentRegistry;
    Staff[] public staffRegistry;

    event StudentAdded(string message, uint studentId);
    event StudentFeesPaid(uint studentId, uint amount, address wallet);
    event StaffAdded(uint staffId, address wallet);
    event StaffPaid(address wallet, uint amount);
    event GenericLog(string message);

    modifier onlyAdmin() {
        require(msg.sender == schoolAdmin, "Not admin");
        _;
    }

    modifier onlyStudent() {
        require(roles[msg.sender] == Role.Student, "Not student");
        _;
    }

    modifier onlyStaff() {
        require(roles[msg.sender] == Role.Staff, "Not staff");
        _;
    }

    modifier canReceiveSalary(address _staffWallet) {
        require(staffMembers[_staffWallet].role == Role.Staff, "Invalid staff");
        require(!staffMembers[_staffWallet].suspended, "Staff suspended");
        uint timeSinceLast = block.timestamp - lastSalaryPaid[_staffWallet];
        require(timeSinceLast >= SALARY_INTERVAL, "Salary interval not reached");
        _;
    }

    constructor(address _token) {
        schoolAdmin = msg.sender;
        token = IERC20(_token);

        levelFees[100] = 100;
        levelFees[200] = 200;
        levelFees[300] = 300;
        levelFees[400] = 400;

        roles[schoolAdmin] = Role.Admin;
    }

    function claimFaucet(address _receiver) public {
        require(_receiver != address(0), "Invalid address");
        require(!faucetClaimed[_receiver], "Already claimed");
        faucetClaimed[_receiver] = true;
        totalClaimed[_receiver] = faucetTokens;
        emit GenericLog("Faucet tokens claimed");
    }

    function registerStudent(string memory _name, uint _level, uint8 _age) public onlyAdmin {
        require(_level > 0 && levelFees[_level] > 0, "Invalid level");
        Student memory s = Student({
            id: studentRegistry.length,
            fullName: _name,
            wallet: address(0),
            level: _level,
            age: _age,
            feesPaid: 0,
            paymentStatus: PaymentStatus.Unpaid,
            role: Role.Student,
            claimed: false,
            claimedAt: 0
        });
        studentRegistry.push(s);
        emit StudentAdded("Student registered", nextStudentId++);
    }

    function payStudentFees(uint _studentIndex) external {
        require(_studentIndex < studentRegistry.length, "Student not found");
        require(msg.sender != schoolAdmin, "Admin cannot claim fees");
        require(faucetClaimed[msg.sender], "Claim faucet first");

        Student storage s = studentRegistry[_studentIndex];
        require(!s.claimed, "Already claimed");

        uint fee = s.level * 10 ** 18;
        require(token.balanceOf(msg.sender) >= fee, "Insufficient tokens");

        s.feesPaid = fee;
        s.claimed = true;
        s.claimedAt = block.timestamp;
        s.paymentStatus = PaymentStatus.Paid;
        s.wallet = msg.sender;

        students[msg.sender] = s;
        roles[msg.sender] = Role.Student;

        require(token.transferFrom(msg.sender, address(this), fee), "Token transfer failed");
        emit StudentFeesPaid(_studentIndex, fee, msg.sender);
    }

    function removeStudent(uint _index) external onlyAdmin {
        require(_index < studentRegistry.length, "Student not found");
        Student storage s = studentRegistry[_index];

        delete students[s.wallet];
        roles[s.wallet] = Role.Admin;

        studentRegistry[_index] = studentRegistry[studentRegistry.length - 1];
        studentRegistry.pop();
        emit StudentAdded("Student removed", _index);
    }

    function registerStaff(string memory _name, uint _salary) public onlyAdmin {
        Staff memory s = Staff({
            id: staffRegistry.length,
            fullName: _name,
            wallet: address(0),
            monthlySalary: _salary * 10 ** 18,
            hasBeenPaid: false,
            lastPaidAt: 0,
            role: Role.Staff,
            claimed: false,
            claimedAt: 0,
            suspended: false
        });
        staffRegistry.push(s);
        emit StaffAdded(s.id, s.wallet);
    }

    function employStaff(address _wallet, string memory _name, uint _salary) external onlyAdmin {
        Staff memory s = Staff({
            id: staffRegistry.length,
            fullName: _name,
            wallet: _wallet,
            monthlySalary: _salary * 10 ** 18,
            hasBeenPaid: false,
            lastPaidAt: 0,
            role: Role.Staff,
            claimed: true,
            claimedAt: block.timestamp,
            suspended: false
        });
        staffRegistry.push(s);
        staffMembers[_wallet] = s;
        roles[_wallet] = Role.Staff;
        emit StaffAdded(s.id, _wallet);
    }

    function claimStaff(uint _index) external {
        require(_index < staffRegistry.length, "Staff not found");
        Staff storage s = staffRegistry[_index];
        require(!s.claimed, "Already claimed");
        require(msg.sender != schoolAdmin, "Admin cannot claim");

        s.wallet = msg.sender;
        s.claimed = true;
        s.claimedAt = block.timestamp;

        staffMembers[msg.sender] = s;
        roles[msg.sender] = Role.Staff;
        emit StaffAdded(_index, msg.sender);
    }

    function suspendStaff(uint _index) external onlyAdmin {
        require(_index < staffRegistry.length, "Staff not found");
        staffRegistry[_index].suspended = true;
        emit StaffAdded(_index, staffRegistry[_index].wallet);
    }

    function reinstateStaff(uint _index) external onlyAdmin {
        require(_index < staffRegistry.length, "Staff not found");
        staffRegistry[_index].suspended = false;
        emit StaffAdded(_index, staffRegistry[_index].wallet);
    }

    function payStaffSalary(address _wallet) external onlyAdmin canReceiveSalary(_wallet) {
        Staff storage s = staffMembers[_wallet];
        require(s.wallet != address(0), "Invalid staff");
        require(s.monthlySalary > 0, "Salary is zero");
        require(token.balanceOf(address(this)) >= s.monthlySalary, "Insufficient funds");

        lastSalaryPaid[_wallet] = block.timestamp;
        s.hasBeenPaid = true;
        s.lastPaidAt = block.timestamp;

        require(token.transfer(_wallet, s.monthlySalary), "Transfer failed");
        emit StaffPaid(_wallet, s.monthlySalary);
    }

    function getStudentDetails(address _wallet) public view returns (Student memory) {
        return students[_wallet];
    }

    function getStaffDetails(address _wallet) public view returns (Staff memory) {
        return staffMembers[_wallet];
    }

    function allStudents() public view returns (Student[] memory) {
        return studentRegistry;
    }

    function allStaff() public view returns (Staff[] memory) {
        return staffRegistry;
    }

    function contractBalance() public view returns (uint) {
        return token.balanceOf(address(this));
    }
}