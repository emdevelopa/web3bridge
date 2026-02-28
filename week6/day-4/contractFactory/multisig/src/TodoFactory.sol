// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Todo.sol";

contract TodoFactory {

    Todo todo;

    Todo[] public list_of_Todos;

    function createTodoContract(address _owner) public {
        todo = new Todo(_owner);
        list_of_Todos.push(todo);
    }
}