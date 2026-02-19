// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

 import "./IERC20.sol";
 

contract SaveEtherAndToken {
    mapping(address => uint) private etherBalances;
    mapping(address => mapping(address => uint256)) private tokenBalances;



    function depositEther() external payable{

        require(msg.value > 0, "must send ether");

        etherBalances[msg.sender] = msg.value;

    }


    function getEtherBal(address user) public view returns(uint){
        return etherBalances[user];
    }

    function withdrawEther(uint _amount) external {
        require(etherBalances[msg.sender] >= _amount, "Insufficeint funds");

        etherBalances[msg.sender] -= _amount;

        (bool success,) = payable(msg.sender).call{value: _amount}("");

        require(success, "withdrawal failed");
    }

    // Token part

   function depositToken(address tokenAddress, uint256 amount) external {
    require(amount > 0, "Amount must be greater than 0");

    IERC20 token = IERC20(tokenAddress);

    bool success = token.transferFrom(msg.sender, address(this), amount);
    require(success, "Token transfer failed");

    tokenBalances[msg.sender][tokenAddress] += amount;
}


function withdrawToken(address tokenAddress, uint256 amount) external {
    require(tokenBalances[msg.sender][tokenAddress] >= amount, "Insufficient token balance");

    tokenBalances[msg.sender][tokenAddress] -= amount;

    IERC20 token = IERC20(tokenAddress);
    bool success = token.transfer(msg.sender, amount);
    require(success, "Token transfer failed");
}


function getTokenBalance(address user, address tokenAddress) external view returns (uint256) {
    return tokenBalances[user][tokenAddress];
}


}
