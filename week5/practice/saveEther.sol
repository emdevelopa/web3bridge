// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {IERC20} from "./IERC20.sol";

contract SaveEther {
    // deposit ether
    // withdraw ether
    // getBalnce
    // get Contract balance

    mapping(address => uint) balance;

    // owner=>spender=>token
    // contract address for this 
    mapping(address => mapping(address => uint)) balanceERC20;

    event Deposit(address indexed from, address indexed to, uint value );
    event widrawalSuccessful(address indexed receiver, uint _amount);
    function depositEther() external payable {
        // require(,"");

        balance[msg.sender] = balance[msg.sender] + msg.value;

        emit Deposit(address(0),msg.sender, msg.value);
    }

    function withdrawEther(uint _amount) external {
        require(balance[msg.sender] >= _amount, "insufficient balance");
        // require();

        balance[msg.sender] = balance[msg.sender] - _amount;

        (bool result, ) = payable(msg.sender).call{value: _amount}("");

        require(result, "withdrawaal fails");

        emit widrawalSuccessful(msg.sender,_amount);

    }

    function getBalanceEther() external view returns(uint){
        return balance[msg.sender];
    }


    function getContractBalanceEther() external view returns(uint){
        return address(this).balance;
    }





    // ERC20

    function depositToken(address token_address, uint amount) external {

        require(IERC20(token_address).balanceOf(msg.sender) >= amount, "insufficient token balance");

        balanceERC20[msg.sender][token_address] = balanceERC20[msg.sender][token_address] + amount;

        require(IERC20(token_address).transferFrom(msg.sender, address(this), amount), "transfer of token failed");


        emit Deposit(address(this), msg.sender, amount);
        
    }

    function withdrawERC20(address token_address,uint _amount) external {
        require(balanceERC20[msg.sender][token_address] >= _amount, "withdrawal failed: insufficient token balance");

        balanceERC20[msg.sender][token_address] = balanceERC20[msg.sender][token_address] - _amount;

        require(IERC20(token_address).transfer(msg.sender, _amount), "Withdrawal failed");

        emit widrawalSuccessful(msg.sender, _amount);

    }

    // spender here is the vault(saveAsset) contract address
    function getBalanceERC20(address token_address) external view returns(uint){
        return balanceERC20[msg.sender][token_address];
    }


    function getContractBalanceER20(address token_address) external view returns(uint){
        return balanceERC20[msg.sender][token_address];
    }

    receive() external payable {}
    fallback() external {}
}
