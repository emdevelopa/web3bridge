// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/TodoFactory.sol";
import "../src/Todo.sol";

contract TodoFactoryTest is Test {

    TodoFactory factory;

    address user1 = address(1);
    address user2 = address(2);

    function setUp() public {
        factory = new TodoFactory();
    }

    /* ---------------------------------------------------------- */
    /*                  TEST: Create Todo Contract                */
    /* ---------------------------------------------------------- */

    function testCreateTodoContract() public {

        vm.prank(user1);
        factory.createTodoContract();

        address[] memory userTodos = factory.getUserTodos(user1);

        assertEq(userTodos.length, 1);
    }

    /* ---------------------------------------------------------- */
    /*          TEST: Owner is Set Correctly on Deployment       */
    /* ---------------------------------------------------------- */

    function testOwnerIsCorrect() public {

        vm.prank(user1);
        factory.createTodoContract();

        address[] memory userTodos = factory.getUserTodos(user1);

        Todo deployedTodo = Todo(userTodos[0]);

        assertEq(deployedTodo.owner(), user1);
    }

    /* ---------------------------------------------------------- */
    /*          TEST: Multiple Users Create Contracts             */
    /* ---------------------------------------------------------- */

    function testMultipleUsers() public {

        vm.prank(user1);
        factory.createTodoContract();

        vm.prank(user2);
        factory.createTodoContract();

        address[] memory user1Todos = factory.getUserTodos(user1);
        address[] memory user2Todos = factory.getUserTodos(user2);

        assertEq(user1Todos.length, 1);
        assertEq(user2Todos.length, 1);

        assertTrue(user1Todos[0] != user2Todos[0]);
    }

    /* ---------------------------------------------------------- */
    /*      TEST: Interact With Deployed Todo Contract            */
    /* ---------------------------------------------------------- */

    function testInteractWithDeployedTodo() public {

        vm.prank(user1);
        factory.createTodoContract();

        address[] memory userTodos = factory.getUserTodos(user1);

        Todo deployedTodo = Todo(userTodos[0]);

        vm.prank(user1);
        deployedTodo.createTodo("Learn Factory Pattern");

        Todo.TodoFields[] memory allTodos = deployedTodo.getAllTodos();

        assertEq(allTodos.length, 1);
        assertEq(allTodos[0].title, "Learn Factory Pattern");
        assertEq(allTodos[0].completed, false);
    }

    /* ---------------------------------------------------------- */
    /*              TEST: AllTodos Global Storage                 */
    /* ---------------------------------------------------------- */

    function testAllTodosStorage() public {

        vm.prank(user1);
        factory.createTodoContract();

        vm.prank(user2);
        factory.createTodoContract();

        address[] memory all = factory.getAllTodos();

        assertEq(all.length, 2);
    }
}