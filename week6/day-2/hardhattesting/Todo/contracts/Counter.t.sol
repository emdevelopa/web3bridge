// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Todo} from "./Todo.sol";
import {Test} from "forge-std/src/Test.sol";

contract CounterTest is Test {
    Todo counter;

    event Increment(uint by);

    function setUp() public {
        counter = new Todo();
    }

    // // ─────────────────────────────────────────────
    // // Initial state
    // // ─────────────────────────────────────────────

    // function test_InitialValue() public view {
    //     assertEq(counter.x(), 0, "Initial value should be 0");
    // }

    // // ─────────────────────────────────────────────
    // // inc()
    // // ─────────────────────────────────────────────

    // function test_IncOnce() public {
    //     counter.inc();
    //     assertEq(counter.x(), 1, "Value should be 1 after one inc()");
    // }

    // function test_IncMultipleTimes() public {
    //     counter.inc();
    //     counter.inc();
    //     counter.inc();
    //     assertEq(counter.x(), 3, "Value should be 3 after three inc() calls");
    // }

    // function test_IncEmitsEvent() public {
    //     vm.expectEmit(false, false, false, true);
    //     emit Increment(1);
    //     counter.inc();
    // }

    // function testFuzz_Inc(uint8 x) public {
    //     for (uint8 i = 0; i < x; i++) {
    //         counter.inc();
    //     }
    //     assertEq(counter.x(), x, "Value after calling inc() x times should equal x");
    // }

    // // ─────────────────────────────────────────────
    // // incBy()
    // // ─────────────────────────────────────────────

    // function test_IncByPositiveAmount() public {
    //     counter.incBy(5);
    //     assertEq(counter.x(), 5, "Value should be 5 after incBy(5)");
    // }

    // function test_IncByAccumulates() public {
    //     counter.incBy(3);
    //     counter.incBy(7);
    //     assertEq(counter.x(), 10, "Value should accumulate across incBy() calls");
    // }

    // function test_IncByEmitsEvent() public {
    //     vm.expectEmit(false, false, false, true);
    //     emit Increment(10);
    //     counter.incBy(10);
    // }

    // function test_IncByZeroReverts() public {
    //     vm.expectRevert("incBy: increment should be positive");
    //     counter.incBy(0);
    // }

    // function testFuzz_IncBy(uint8 by, uint8 times) public {
    //     // Avoid zero since it reverts
    //     vm.assume(by > 0);
    //     vm.assume(times > 0);

    //     for (uint8 i = 0; i < times; i++) {
    //         counter.incBy(by);
    //     }

    //     assertEq(counter.x(), uint(by) * uint(times), "Value should be by * times");
    // }

    // // ─────────────────────────────────────────────
    // // Mixed usage
    // // ─────────────────────────────────────────────

    // function test_MixedIncAndIncBy() public {
    //     counter.inc();       // x = 1
    //     counter.incBy(4);    // x = 5
    //     counter.inc();       // x = 6
    //     counter.incBy(10);   // x = 16
    //     assertEq(counter.x(), 16, "Mixed calls should accumulate correctly");
    // }
}