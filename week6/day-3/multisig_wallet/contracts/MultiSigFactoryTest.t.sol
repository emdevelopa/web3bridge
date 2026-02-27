// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "./multisig.sol";
import "./multiSigFactory.sol";

contract MultiSigFactoryTest is Test {
    MultiSigFactory factory;
    address user1 = address(0x1);
    address user2 = address(0x2);
    address user3 = address(0x3);

    function setUp() public {
        factory = new MultiSigFactory();
    }

    function testCreateMultiSig() public {
        // Deploy a new MultiSig contract via factory
        address multiSigAddress = factory.createMultiSig(user1, user2, user3);

        // Check that the deployed contract exists
        MultiSig multiSig = MultiSig(multiSigAddress);
        address[] memory users = multiSig.users();

        // Validate the users
        assertEq(users[0], user1);
        assertEq(users[1], user2);
        assertEq(users[2], user3);

        // Validate that the factory keeps track of the deployed contract
        MultiSig[] memory deployed = factory.getDeployedContracts();
        assertEq(address(deployed[0]), multiSigAddress);
    }

    function testMultipleDeployments() public {
        address multiSig1 = factory.createMultiSig(user1, user2, user3);
        address multiSig2 = factory.createMultiSig(address(0x4), address(0x5), address(0x6));

        MultiSig[] memory deployed = factory.getDeployedContracts();
        assertEq(deployed.length, 2);
        assertEq(address(deployed[0]), multiSig1);
        assertEq(address(deployed[1]), multiSig2);
    }
}