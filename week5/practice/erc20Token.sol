// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ER20 {
    // name
    // symbol
    // decimal
    // totalSupply
    // balanceOf
    // transfer
    // transferFrom
    // Approve
    // Allowance

    // Approve Event
    // Transfer Event

    string constant TokenName = "Teni";
    string constant TokenSymbol = "TE";
    uint8 constant TokenDecimal = 18;
    uint256  TotalSupply;

    

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowances;

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function name() external pure returns (string memory) {
        return TokenName;
    }

    function symbol() external pure returns (string memory) {
        return TokenSymbol;
    }

    function decimal() external pure returns (uint8) {
        return TokenDecimal;
    }

    function totalSupply() external view returns (uint) {
        return TotalSupply;
    }

    function balanceOf(address _owner) external view returns (uint) {
        return balances[_owner];
    }

    function transfer(address _to, uint _value) external returns (bool){
        require(balances[msg.sender] >= _value, "Insufficient Funds");

        balances[msg.sender] = balances[msg.sender] - _value; 
        balances[_to] = balances[_to] + _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function mint(address _to, uint _amount) external {
        TotalSupply = TotalSupply + _amount;
        balances[_to] = balances[_to] + _amount;

        emit Transfer(address(0), _to, _amount); 

    }

    function transferFrom(address _from, address _to, uint _amount)external returns(bool){
        require(balances[_from] >= _amount, "Insufficient balance");
        require(allowances[_from][msg.sender] >= _amount,"amount can not be less than allowance balance");

        balances[_from] = balances[_from] - _amount;
        balances[_to] = balances[_to] + _amount;
        allowances[_from][msg.sender] = allowances[_from][msg.sender] - _amount;  

        emit Transfer(_from, _to, _amount);


        return true;
    }

    function Approve(address _spender, uint _amount) external returns(bool){
        require(balances[msg.sender] => _amount, "balance is low");
        allowances[msg.sender][_spender] = _amount;

        emit Approval(msg.sender, _spender, _amount);

        return true;
    }
}
