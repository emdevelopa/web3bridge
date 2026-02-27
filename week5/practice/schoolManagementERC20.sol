// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "./IERC20.sol";

contract SchoolManagementERC20 {

    address public owner;
    IERC20 public feeToken;    

    constructor(address _tokenAddress) {
        owner = msg.sender;
        feeToken = IERC20(_tokenAddress);

        level_fees[100] = 100 * 10**18;
        level_fees[200] = 150 * 10**18;
        level_fees[300] = 200 * 10**18;
        level_fees[400] = 250 * 10**18;
    }

    modifier onlyAdmin() {
        require(msg.sender == owner, "Not Admin");
        _;
    }
 
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

    mapping(uint => Student) public Students;
    mapping(uint => Staff) public Staffs;
    mapping(uint => uint) public level_fees;

    uint public studentCount;
    uint public staffCount;

    

    event StudentRegistered(
        uint indexed id,
        address indexed walletAddress,
        string name,
        uint level
    );

    event PaidFee(
        uint indexed id,
        address indexed walletAddress,
        uint value,
        uint time_payed
    );

    event StaffRegistered(
        uint indexed id,
        address indexed wallet_address,
        string name,
        string role
    );

    event StaffPaid(
        uint indexed id,
        address indexed wallet_address,
        uint salary,
        uint time
    );

    function registerStudent(
        string memory _name,
        uint _level,
        address _wallet
    ) external onlyAdmin {

        studentCount++;

        Student memory newStudent = Student(
            studentCount,
            _name,
            _wallet,
            _level,
            level_fees[_level],
            false,
            0
        );

        Students[studentCount] = newStudent;

        emit StudentRegistered(studentCount, _wallet, _name, _level);
    }
 
    function studentPayFee(uint _id) external {

        Student storage student = Students[_id];

        require(msg.sender == student.wallet_address, "Not student");
        require(!student.payment_status, "Already paid");

        uint fee = level_fees[student.level];

        // Transfer ERC20 tokens from student to contract
        bool success = feeToken.transferFrom(
            msg.sender,
            address(this),
            fee
        );

        require(success, "Token transfer failed");

        student.payment_status = true;
        student.payment_time = block.timestamp;

        emit PaidFee(_id, msg.sender, fee, block.timestamp);
    }
 

    function registerStaff(
        string memory _name,
        address _wallet_address,
        string memory role,
        uint _salary
    ) external onlyAdmin {

        staffCount++;

        Staff memory staff = Staff(
            staffCount,
            _name,
            _wallet_address,
            role,
            _salary,
            0
        );

        Staffs[staffCount] = staff;

        emit StaffRegistered(staffCount, _wallet_address, _name, role);
    }

    function payStaff(uint _id) external onlyAdmin {

        Staff storage staff = Staffs[_id];

        require(staff.id != 0, "Staff not exist");

        uint salary = staff.salary;

        require(
            feeToken.balanceOf(address(this)) >= salary,
            "Insufficient token balance"
        );

        bool success = feeToken.transfer(
            staff.wallet_address,
            salary
        );

        require(success, "Salary payment failed");

        staff.last_payment_time = block.timestamp;

        emit StaffPaid(_id, staff.wallet_address, salary, block.timestamp);
    }

  

    function getStudentById(uint _id)
        external
        view
        returns (Student memory)
    {
        return Students[_id];
    }

    function getStaffById(uint _id)
        external
        view
        returns (Staff memory)
    {
        return Staffs[_id];
    }

    function setLevelFee(uint _level, uint amount)
        external
        onlyAdmin
    {
        level_fees[_level] = amount;
    }
}