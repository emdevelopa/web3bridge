// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Todo {
    // createTodo
    // deleteTodo
    // UpdateTodo
    // markTodoCompleted
    // markTodoUncompleted
    // getAllTodos

    struct TodoFields {
        uint8 id;
        string title;
        bool completed;
        uint timeCompleted;
    }

    TodoFields[] Todos;
    uint8 todoId;

    // uint[] nums = [1,2,3,4,5,6,9,10];

    // For testing Swap and Popu
    // function SwapItemAndPop() external returns(uint[] memory){
    //     nums[2] = nums[6];

    //     return nums;
    // }

    function getAllTodos() external view returns (TodoFields[] memory) {
        return Todos;
    }

    function createTodo(string memory _title) external {
        todoId = todoId + 1;

        /* need to create a struct first and then push  the struct to the array too store it in the blockchain state */
        TodoFields memory todo = TodoFields({
            id: todoId,
            title: _title,
            completed: false,
            timeCompleted: 0
        });

        Todos.push(todo);
    }

    function markCompleted(uint8 _id) external {
        // check is todo exists before marking completed for delete, mark, unmark and update..
        for (uint i = 0; i < Todos.length; i++) {
            require(Todos[i].id == _id, "Todo does not exist");
            if (Todos[i].id == _id) {
                Todos[i].completed = true;
                Todos[i].timeCompleted = block.timestamp;
                break;
            }
        }
    }
    function markUnCompleted(uint8 _id) external {
        for (uint i = 0; i < Todos.length; i++) {
            require(Todos[i].id == _id, "Todo does not exist");
            if (Todos[i].id == _id) {
                Todos[i].completed = false;
                Todos[i].timeCompleted = 0;
                break;
            }
        }
    }

    function deleteTodo(uint _id) external {
        for (uint i = 0; i < Todos.length; i++) {
            require(Todos[i].id == _id, "Todo does not exist");
            if (Todos[i].id == _id) {
                Todos[i] = Todos[Todos.length - 1];
                Todos.pop();
                break;
            }
        }
    }

    function updateTodo(uint _id, string memory _title) external {
        for (uint i = 0; i < Todos.length; i++) {
            if (Todos[i].id == _id) {
                require(Todos[i].id == _id, "Todo does not exist");
                require(
                    !Todos[i].completed,
                    "Todo completed, can't update it.."
                );
                Todos[i].title = _title;
                Todos[i].timeCompleted = 0;
                break;
            }
        }
    }
}
