// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./multisig.sol";

contract MultiSigFactory {
    MultiSig[] public deployedContracts;

    event MultiSigCreated(address indexed contractAddress, address user1, address user2, address user3);

    function createMultiSig(
        address _user1,
        address _user2,
        address _user3
    ) external returns (address) {
        MultiSig newMultiSig = new MultiSig(_user1, _user2, _user3);
        deployedContracts.push(newMultiSig);

        emit MultiSigCreated(address(newMultiSig), _user1, _user2, _user3);
        return address(newMultiSig);
    }

    function getDeployedContracts() external view returns (MultiSig[] memory) {
        return deployedContracts;
    }
}