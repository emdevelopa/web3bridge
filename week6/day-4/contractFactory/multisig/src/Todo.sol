// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Todo {

    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    struct TodoFields {
        uint8 id;
        string title;
        bool completed;
        uint timeCompleted;
    }

    TodoFields[] private Todos;
    uint8 private todoId;

    function getAllTodos() external view returns (TodoFields[] memory) {
        return Todos;
    }

    function createTodo(string memory _title) external onlyOwner {
        todoId++;

        Todos.push(
            TodoFields({
                id: todoId,
                title: _title,
                completed: false,
                timeCompleted: 0
            })
        );
    }

    function markCompleted(uint8 _id) external onlyOwner {
        for (uint i = 0; i < Todos.length; i++) {
            if (Todos[i].id == _id) {
                Todos[i].completed = true;
                Todos[i].timeCompleted = block.timestamp;
                return;
            }
        }
        revert("Todo does not exist");
    }

    function deleteTodo(uint _id) external onlyOwner {
        for (uint i = 0; i < Todos.length; i++) {
            if (Todos[i].id == _id) {
                Todos[i] = Todos[Todos.length - 1];
                Todos.pop();
                return;
            }
        }
        revert("Todo does not exist");
    }
}