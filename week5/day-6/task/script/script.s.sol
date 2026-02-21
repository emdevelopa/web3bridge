// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {SchoolManagement} from "../src/schoolManagement.sol";

contract TBSScript is Script {
    SchoolManagement public twoBottles;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        twoBottles = new SchoolManagement();

        vm.stopBroadcast();
    }
}