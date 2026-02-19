// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TwoBottles {
    
    // METADATA
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    constructor (){
        name = "TwoBottles";
        symbol = "TBS";
        decimals = 18;
        totalSupply = 1 * 10 ** uint256(decimals);

        BalanceOfAddress[msg.sender] = totalSupply;

        emit Transfer(address(0), msg.sender, totalSupply );
    }

    //connfiguration for making individual addresses hold tokens
    mapping(address => uint256) private BalanceOfAddress;

    // connfiguration for making the allowed address to hold the particular amount to spend
    mapping(address => mapping(address => uint)) private allowances; 


    event Transfer(address indexed from, address indexed to, uint value );
    event Approval(address indexed _owner, address indexed spender, uint value );

    // Checks the balance of the owner by passing a particular address as the function argument
    function balanceOf(address _owner) public view returns(uint256){
        return BalanceOfAddress[_owner];
    }

      //tranfers token from an account to another
    function transfer(address _to, uint256 _value) public returns(bool){
        require(BalanceOfAddress[msg.sender] >= _value, "Insufficient balance");

        BalanceOfAddress[msg.sender] = BalanceOfAddress[msg.sender] - _value;
        BalanceOfAddress[_to] = BalanceOfAddress[_to] + _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    // msg.sender calls the approve function and 
    // sets the value it wants the spender to be able to spend
    function approve(address spender,uint value) public returns(bool){
        allowances[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);

        return true;
    }

    // this just returns the allowed value aasociated to a particular spender
    function allowance(address owner,address spender) public view returns(uint){
        return allowances[owner][spender];
    }

    /* _from is the one that calls the aprove function giving access to the caller
    of the transferFrom to make a transfer from there account */
    function transferFrom(address _from, address _to, uint value) public returns(bool) {
        
        // So here i check if the _from actually have enough balance 
        require(BalanceOfAddress[_from] > 0, "Insufficient Funds");

        // msg.sender(spender) is the one calling the function
        require(allowances[_from][msg.sender] >= value, "not allowed to spend this ammount");

        BalanceOfAddress[_from] =  BalanceOfAddress[_from] - value;
        BalanceOfAddress[_to] =  BalanceOfAddress[_to] + value;

        allowances[_from][msg.sender] =  allowances[_from][msg.sender] - value;

        emit Transfer(_from, _to, value);
        return true;
    }

}