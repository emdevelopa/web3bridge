// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/TodoFactory.sol";
import "../src/Todo.sol";

contract TodoFactoryTest is Test {
    TodoFactory public todoFactory;
    address user1 = address(1);

    function setUp() public {
        todoFactory = new TodoFactory();
    }

    // function testGetUserTodos() public {
    //     assertEq(todoFactory.getUserTodos(user1).length, 0);
    // }

    function testCreateTodoContract() public {
        vm.prank(user1);
        todoFactory.createTodoContract(user1);

        // assertEq(todoFactory.getUserTodos(user1).length, 1);
    }
}
