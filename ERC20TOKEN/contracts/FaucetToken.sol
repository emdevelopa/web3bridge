// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

error INSUFFICIENT_BALANCE();
error NOT_ALLOWED();
error NOT_OWNER();
error MAX_SUPPLY_EXCEEDED();
error WAIT_FOR_24_HOURS();

contract FaucetToken {
    address public owner;

    string public TokenName = "Pluto";
    string public Symbol = "PLT";
    uint public decimals = 18;

    uint public MAX_SUPPLY = 10_000_000 ether;

    uint public TotalSupply;

    uint256 public faucetAmount = 2 ether;
    constructor() {
        owner = msg.sender;
    }

    //   stores the balance of a token
    mapping(address => uint) public balanceOf;

    mapping(address => mapping(address => uint)) public  allowance;

    mapping(address => uint256) public lastRequestTime;

    modifier OnlyOwner() {
        if (msg.sender != owner) revert NOT_OWNER();
        _;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function transfer(address _to, uint _amount) external returns (bool) {
        if (_amount > balanceOf[msg.sender]) revert INSUFFICIENT_BALANCE();
        // if(balanceOf[msg.sender] < _amount) revert INSUFFICIENT_BALANCE();

        balanceOf[msg.sender] = balanceOf[msg.sender] - _amount;

        balanceOf[_to] = balanceOf[_to] + _amount;

        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function approve(address spender, uint _amount) external returns (bool) {
        if (_amount > balanceOf[msg.sender]) revert INSUFFICIENT_BALANCE();

        
        allowance[msg.sender][spender] = _amount;

        emit Approval(msg.sender, spender, _amount);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint _amount
    ) external returns (bool) {
        if (balanceOf[_from] < _amount) revert INSUFFICIENT_BALANCE();
        if (allowance[_from][msg.sender] < _amount) revert NOT_ALLOWED();

        balanceOf[_from] = balanceOf[_from] - _amount;
        allowance[_from][msg.sender] = balanceOf[_from] - _amount;

        balanceOf[_to] = balanceOf[_to] + _amount;

        return true;
    }

    function _mint(address to, uint amount) internal {
        if (TotalSupply + amount > MAX_SUPPLY) revert MAX_SUPPLY_EXCEEDED();

        TotalSupply = TotalSupply + amount;
        balanceOf[to] = balanceOf[to] + amount;
    }

    //Creating Token by the owner
    function mint(address to, uint amount) public OnlyOwner {
        _mint(to, amount);
    }

    function requestToken() public {
        if (block.timestamp < lastRequestTime[msg.sender] + 1 days)
            revert WAIT_FOR_24_HOURS();

        _mint(msg.sender, faucetAmount);

        lastRequestTime[msg.sender] = block.timestamp;
    }
}
