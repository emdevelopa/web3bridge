// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../src/Todo.sol";
import "../lib/forge-std/src/Test.sol";

contract TodoTest is Test {
    Todo public todo;

     address user1 = address(1);

    function setUp() public {
        todo = new Todo(user1); 
    }

    function testGetAllTodo() public {
        // todo.getAllTodos();
        
        assertEq(todo.getAllTodos().length, 0);
    }

    function testCreateTodo() public {
        vm.prank(user1);

        todo.createTodo("laundry");

        assertEq(todo.getAllTodos()[0].title, "laundry");
    }

    function testMarkCompleted()public {
        vm.prank(user1);
        todo.createTodo("laundry");
        vm.prank(user1);

        todo.markCompleted(1);

        assertEq(todo.getAllTodos()[0].completed, true);
    }

     function testDeleteTodo()public {
        vm.prank(user1);
        todo.createTodo("laundry");
        vm.prank(user1);
        todo.deleteTodo(1);
        vm.prank(user1);

        todo.markCompleted(1);
    }
    

    // testGetAllTodo()
}