// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20{
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address _owner) external view returns (uint256 balance);
    function transfer(address _to, uint256 _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
    function approve(address _spender, uint256 _value) external returns (bool success);
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);


}

contract ERC20{
    string constant TOKEN_NAME = "WEB3CXIV";
    string constant TOKEN_SYMBOL = "W3CXIV";
    uint8 constant TOKEN_DECIMAL = 18;
    uint256 constant TOTAL_SUPPLY = 2_000_000_000_000_000_000_000;


    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function name() external view returns (string memory){
        return TOKEN_NAME;
    }

    function symbol() external view returns (string memory){
        return TOKEN_SYMBOL;
    }

    function decimals() external view returns (uint8){
        return  TOKEN_DECIMAL;
    }

    function totalSupply() external view returns (uint256){
        return TOTAL_SUPPLY;
    }

    function balanceOf(address _owner) external view returns (uint256 balance){
       return balances[_owner];
    }

    function allowance(address _owner, address _spender) external view returns (uint256 remaining){
        remaining = allowances[_owner][_spender];

        return remaining;
    }

    function transfer(address _to, uint256 _value) external returns (bool success){
        require(balances[msg.sender] >= _value, "Insufficient balance");
        
        balances[msg.sender] = balances[msg.sender] - _value; 
        balances[_to] = balances[_to] + _value; 

        return true;
    }

     function approve(address _spender, uint256 _value) external returns (bool success){
        require(balances[msg.sender] >= _value, "Insufficient Balance");

        allowances[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
     }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success){
        require(balances[_from] >= _value, "Insufficient Balance From owner");
        require(allowances[_from][msg.sender] >= _value, "amount entered is not allowed to be spent");

        balances[_from] = balances[_from] - _value;
        balances[_to] = balances[_to] + _value;

        emit Transfer(_from, _to, _value);
        return true;
    }



    


}

