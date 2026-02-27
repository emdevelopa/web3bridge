// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Todo.sol";

contract TodoFactory {

    // Store all deployed Todo contracts
    address[] public allTodos;

    // Map user => their Todo contracts
    mapping(address => address[]) public userTodos;

    event TodoCreated(address indexed owner, address todoAddress);

    function createTodoContract() external {
        // Deploy new Todo contract
        Todo newTodo = new Todo(msg.sender);

        address todoAddress = address(newTodo);

        // Store globally
        allTodos.push(todoAddress);

        // Store per user
        userTodos[msg.sender].push(todoAddress);

        emit TodoCreated(msg.sender, todoAddress);
    }

    function getUserTodos(address _user)
        external
        view
        returns (address[] memory)
    {
        return userTodos[_user];
    }

    function getAllTodos() external view returns (address[] memory) {
        return allTodos;
    }
}