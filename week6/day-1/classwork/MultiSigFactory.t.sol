// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/multisig.sol";
import "../src/multiSigFactory.sol";

contract MultiSigFactoryTest is Test {
    MultiSigFactory factory;

    address user1 = address(0x1);
    address user2 = address(0x2);
    address user3 = address(0x3);
    address user4 = address(0x4); // extra user for testing

    function setUp() public {
        factory = new MultiSigFactory();
    }

    /*----------------------------------------------------------*/
    /*         TEST: Factory Creates MultiSig Contract          */
    /*----------------------------------------------------------*/
    function testCreateMultiSigContract() public {
        vm.prank(user1);
        address newMS = factory.createMultiSig(user1, user2, user3);

        MultiSig deployed = MultiSig(newMS);

        // Check owners
        address[] memory owners = deployed.getOwners();
        assertEq(owners[0], user1);
        assertEq(owners[1], user2);
        assertEq(owners[2], user3);

        // Check deployedContracts array in factory
        MultiSig[] memory deployedContracts = factory.getDeployedContracts();
        assertEq(address(deployedContracts[0]), newMS);
    }

    /*----------------------------------------------------------*/
    /*       TEST: Only owners can create transactions         */
    /*----------------------------------------------------------*/
    function testOnlyOwnerCanCreateTransaction() public {
        vm.prank(user1);
        address newMS = factory.createMultiSig(user1, user2, user3);

        MultiSig deployed = MultiSig(newMS);

        // owner creates transaction
        vm.prank(user2);
        deployed.createTransaction(user4, 1 ether);

        MultiSig.Transaction memory txn = deployed.getTransaction(0);
        assertEq(txn.creator, user2);
        assertEq(txn.to, user4);
        assertEq(txn.amount, 1 ether);
        assertEq(txn.confirmations, 0);
        assertEq(txn.executed, false);

        // non-owner should fail
        vm.prank(user4);
        vm.expectRevert("Not owner");
        deployed.createTransaction(user4, 1 ether);
    }

    /*----------------------------------------------------------*/
    /*       TEST: Signing transaction executes after 2        */
    /*----------------------------------------------------------*/
    function testSignTransactionExecutes() public {
        vm.prank(user1);
        address newMS = factory.createMultiSig(user1, user2, user3);
        MultiSig deployed = MultiSig(newMS);

        // fund the multisig
        vm.deal(address(deployed), 5 ether);

        // owner1 creates transaction to user4
        vm.prank(user1);
        deployed.createTransaction(user4, 2 ether);

        // owner2 signs
        vm.prank(user2);
        deployed.signTransaction(0);

        // should not execute yet
        MultiSig.Transaction memory txn = deployed.getTransaction(0);
        assertEq(txn.executed, false);

        // owner3 signs
        vm.prank(user3);
        deployed.signTransaction(0);

        // now executed
        txn = deployed.getTransaction(0);
        assertEq(txn.executed, true);

        // Check balance of recipient
        assertEq(user4.balance, 2 ether);
    }

    /*----------------------------------------------------------*/
    /*        TEST: Creator cannot sign own transaction         */
    /*----------------------------------------------------------*/
    function testCreatorCannotSign() public {
        vm.prank(user1);
        address newMS = factory.createMultiSig(user1, user2, user3);
        MultiSig deployed = MultiSig(newMS);

        // fund
        vm.deal(address(deployed), 5 ether);

        // creator creates transaction
        vm.prank(user1);
        deployed.createTransaction(user4, 1 ether);

        // creator tries to sign → should revert
        vm.prank(user1);
        vm.expectRevert("Creator cannot sign");
        deployed.signTransaction(0);
    }

    /*----------------------------------------------------------*/
    /*        TEST: Cannot double sign                          */
    /*----------------------------------------------------------*/
    function testCannotDoubleSign() public {
        vm.prank(user1);
        address newMS = factory.createMultiSig(user1, user2, user3);
        MultiSig deployed = MultiSig(newMS);

        // fund
        vm.deal(address(deployed), 5 ether);

        // create transaction
        vm.prank(user1);
        deployed.createTransaction(user4, 1 ether);

        // owner2 signs
        vm.prank(user2);
        deployed.signTransaction(0);

        // owner2 tries to sign again
        vm.prank(user2);
        vm.expectRevert("Already signed");
        deployed.signTransaction(0);
    }
}