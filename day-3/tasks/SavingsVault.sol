// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

 
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract SavingsVault {

    // Ether balances
    mapping(address => uint256) private etherBalances;

    // ERC20 balance(user => token => amount)
    mapping(address => mapping(address => uint256)) private tokenBalances;

    

    // Deposit Ether
    function depositEther() external payable {
        require(msg.value > 0, "Must send Ether");
        etherBalances[msg.sender] += msg.value;
    }

    // Check Ether balance
    function getEtherBalance(address user) external view returns (uint256) {
        return etherBalances[user];
    }

    // Withdraw Ether
    function withdrawEther(uint256 amount) external {
        require(etherBalances[msg.sender] >= amount, "Insufficient balance");

        etherBalances[msg.sender] -= amount;

        payable(msg.sender).transfer(amount);
    }
 

    // Deposit ERC20 token
    function depositToken(address tokenAddress, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        IERC20 token = IERC20(tokenAddress);

        // Transfer token from user to this contract
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        tokenBalances[msg.sender][tokenAddress] += amount;
    }

    // Check ERC20 balance
    function getTokenBalance(address user, address tokenAddress)
        external
        view
        returns (uint256)
    {
        return tokenBalances[user][tokenAddress];
    }

    // Withdraw ERC20 token
    function withdrawToken(address tokenAddress, uint256 amount) external {
        require(
            tokenBalances[msg.sender][tokenAddress] >= amount,
            "Insufficient token balance"
        );

        tokenBalances[msg.sender][tokenAddress] -= amount;

        IERC20(tokenAddress).transfer(msg.sender, amount);
    }
}
