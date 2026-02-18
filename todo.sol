// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Todo {

    struct Task {
        uint256 id;
        string title;
        bool isCompleted;
        uint256 timeCompleted;
    }

    Task[] public tasks;
    uint256 private todoId;

    function createTodo(string memory _title) external {
        todoId++;

        Task memory task = Task({
            id: todoId,
            title: _title,
            isCompleted: false,
            timeCompleted: 0
        });

        tasks.push(task);
    }

    function getAllTodos() external view returns (Task[] memory) {
        return tasks;
    }

    function markCompleted(uint256 _id) external {
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                tasks[i].isCompleted = true;
                tasks[i].timeCompleted = block.timestamp;
                break;
            }
        }
    }

    function deleteTodo(uint256 _id) external {
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                tasks[i] = tasks[tasks.length - 1];
                tasks.pop();
                break;
            }
        }
    }

    function updateTodo(uint256 _id, string memory _title) external {
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                tasks[i].title = _title;
                break;
            }
        }
    }
}
