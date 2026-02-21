// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ER20{
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
    uint256 constant TotalSupply = 2*10**18;

    function name() external view returns(string memory){
        return TokenName;
    }

    function symbol() external view returns(string memory){
        return TokenSymbol;
    }

    function decimal() external view returns(uint8){
        return TokenDecimal;
    }

    function totallSupply() external view returns(uint){
        return TotalSupply;
    }

    // funct
}