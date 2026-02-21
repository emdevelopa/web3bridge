// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import "./IERC20.sol";

contract mySchool {
    IERC20 public token;
    address public admin;

    uint public staffId;
    uint public studentId;
    uint256 public faucetAmount = 1000 * 10 ** 18;
    uint256 constant PAY_INTERVAL = 30 days;

    constructor(address _token) {
        admin = msg.sender;
        token = IERC20(_token);

        // Sample level prices
        levelPrice[100] = 100;
        levelPrice[200] = 200;
        levelPrice[300] = 300;
        levelPrice[400] = 400;

        // token.mint(address(this), 1_000_000 * 10 ** 18);

        userRoles[admin] = Roles.admin;
    }

    // EVENTS
    event StudentEvent(string message, uint studentId);
    event StudentClaimEvent(uint studentId, uint amountPaid, address wallet);
    event StaffEvent(uint staffId, address wallet);
    event StaffPaymentEvent(address staffWallet, uint amountPaid);
    event GenericEvent(string message);

    // ENUMS
    enum Roles { admin, staff, student }
    enum Status { unpaid, paid }

    // STRUCTS
    struct Staff {
        uint id;
        string name;
        address wallet;
        uint salary;
        bool paid;
        uint paidAt;
        Roles role;
        bool claimed;
        uint claimedAt;
        bool suspended;
    }

    struct Student {
        uint id;
        string name;
        address wallet;
        uint level;
        uint8 age;
        uint amountPaid;
        Status paymentStatus;
        Roles role;
        bool claimed;
        uint claimedAt;
    }

    // MAPPINGS
    mapping(address => Roles) public userRoles;
    mapping(uint => uint256) public levelPrice;
    mapping(address => bool) public hasClaimed;
    mapping(address => uint256) public amountClaimed;
    mapping(address => Student) public studentDetails;
    mapping(address => Staff) public staffDetails;
    mapping(address => uint256) public lastPaid;

    Staff[] public staffList;
    Student[] public studentList;

    // MODIFIERS
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    modifier onlyStudent() {
        require(userRoles[msg.sender] == Roles.student, "Only student");
        _;
    }

    modifier onlyStaff() {
        require(userRoles[msg.sender] == Roles.staff, "Only staff");
        _;
    }

    modifier canPayStaff(address _staff_wallet) {
        require(
            staffDetails[_staff_wallet].role == Roles.staff,
            "Only staff can receive salary"
        );
        require(!staffDetails[_staff_wallet].suspended, "Staff is suspended");
        uint timeSinceLastPayment = block.timestamp - lastPaid[_staff_wallet];
        require(timeSinceLastPayment >= PAY_INTERVAL, "Must wait 30 days between payments");
        _;
    }

    // HELPERS
    function etherToWei(uint _amount) internal pure returns (uint256) {
        return _amount * 10 ** 18;
    }

    // FAUCET
    function claimFaucet(address _to) public {
        require(_to != address(0), "Not valid address");
        require(!hasClaimed[_to], "Already claimed tokens");
        // token.mint(_to, faucetAmount);
        hasClaimed[_to] = true;
        amountClaimed[_to] = faucetAmount;
        emit GenericEvent("Faucet claimed");
    }

    // STUDENT FUNCTIONS
    function addStudent(string memory _name, uint _level, uint8 _age) public onlyAdmin {
        require(_level > 0 && levelPrice[_level] > 0, "Invalid Level");

        Student memory newStudent = Student({
            id: studentList.length,
            name: _name,
            wallet: address(0),
            level: _level,
            age: _age,
            amountPaid: 0,
            paymentStatus: Status.unpaid,
            role: Roles.student,
            claimed: false,
            claimedAt: 0
        });

        studentList.push(newStudent);
        emit StudentEvent("Student added successfully", studentId++);
    }

    function claimStudentId(uint _Id) external {
        require(_Id < studentList.length, "Student not found");
        require(msg.sender != admin, "Admin can't claim");
        require(hasClaimed[msg.sender], "Claim faucet first");

        Student storage student = studentList[_Id];
        require(student.role == Roles.student, "Not a student");
        require(!student.claimed, "Already claimed");

        uint fee = etherToWei(levelPrice[student.level]);
        require(token.balanceOf(msg.sender) >= fee, "Insufficient balance");

        student.amountPaid = fee;
        student.claimed = true;
        student.claimedAt = block.timestamp;
        student.paymentStatus = Status.paid;
        student.wallet = msg.sender;

        studentDetails[msg.sender] = student;
        userRoles[msg.sender] = Roles.student;

        require(token.transferFrom(msg.sender, address(this), fee), "Payment failed");

        emit StudentClaimEvent(_Id, fee, msg.sender);
    }

    function removeStudent(uint _studentId) external onlyAdmin {
        require(_studentId < studentList.length, "Student not found");
        Student storage student = studentList[_studentId];

        delete studentDetails[student.wallet];
        userRoles[student.wallet] = Roles.admin;

        // Remove from array
        studentList[_studentId] = studentList[studentList.length - 1];
        studentList.pop();

        emit StudentEvent("Student removed", _studentId);
    }

    // STAFF FUNCTIONS
    function addStaff(string memory _name, uint _salary) public onlyAdmin {
        uint salary = etherToWei(_salary);
        Staff memory newStaff = Staff({
            id: staffList.length,
            name: _name,
            wallet: address(0),
            salary: salary,
            paid: false,
            paidAt: 0,
            role: Roles.staff,
            claimed: false,
            claimedAt: 0,
            suspended: false
        });
        staffList.push(newStaff);
        emit StaffEvent(newStaff.id, newStaff.wallet);
    }

    function employStaff(string memory _name, address _wallet, uint _salary) external onlyAdmin {
        uint salary = etherToWei(_salary);
        Staff memory newStaff = Staff({
            id: staffList.length,
            name: _name,
            wallet: _wallet,
            salary: salary,
            paid: false,
            paidAt: 0,
            role: Roles.staff,
            claimed: true,
            claimedAt: block.timestamp,
            suspended: false
        });
        staffList.push(newStaff);
        staffDetails[_wallet] = newStaff;
        userRoles[_wallet] = Roles.staff;

        emit StaffEvent(newStaff.id, _wallet);
    }

    function claimStaffId(uint _Id) external {
        require(_Id < staffList.length, "Staff not found");
        require(msg.sender != admin, "Admin can't claim");

        Staff storage unClaimedStaff = staffList[_Id];
        require(!unClaimedStaff.claimed, "Already claimed");

        unClaimedStaff.wallet = msg.sender;
        unClaimedStaff.claimed = true;
        unClaimedStaff.claimedAt = block.timestamp;

        staffDetails[msg.sender] = unClaimedStaff;
        userRoles[msg.sender] = Roles.staff;

        emit StaffEvent(_Id, msg.sender);
    }

    function suspendStaff(uint _staffId) external onlyAdmin {
        require(_staffId < staffList.length, "Staff not found");
        Staff storage staff = staffList[_staffId];
        staff.suspended = true;

        emit StaffEvent(_staffId, staff.wallet);
    }

    function reinstateStaff(uint _staffId) external onlyAdmin {
        require(_staffId < staffList.length, "Staff not found");
        Staff storage staff = staffList[_staffId];
        staff.suspended = false;

        emit StaffEvent(_staffId, staff.wallet);
    }

    function payStaff(address _wallet) external onlyAdmin canPayStaff(_wallet) {
        Staff storage _staff = staffDetails[_wallet];
        require(_staff.wallet != address(0), "Not staff/Unclaimed profile");
        require(_staff.salary > 0, "Salary can't be 0");
        require(token.balanceOf(address(this)) >= _staff.salary, "Insufficient funds");

        lastPaid[_wallet] = block.timestamp;
        _staff.paid = true;
        _staff.paidAt = block.timestamp;

        require(token.transfer(_wallet, _staff.salary), "Transfer failed");
        emit StaffPaymentEvent(_wallet, _staff.salary);
    }

    // VIEW FUNCTIONS
    function getStudent(address _wallet) public view returns (Student memory) {
        return studentDetails[_wallet];
    }

    function getStaff(address _wallet) public view returns (Staff memory) {
        return staffDetails[_wallet];
    }

    function getAllStaffDetails() public view returns (Staff[] memory) {
        return staffList;
    }

    function getAllStudentDetails() public view returns (Student[] memory) {
        return studentList;
    }

    function getContractBalance() public view returns (uint) {
        return token.balanceOf(address(this));
    }
}