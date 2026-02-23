// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error Not_Owner();
error Property_Does_Not_Exist();
error Property_Not_For_sale();
error Owner_Can_Not_Buy_Property();

contract propMangement is AccessControl, ReentrancyGuard {
    struct Property {
        uint id;
        string name;
        uint price;
        address owner;
        bool for_sale;
        uint time_created;
    }

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    mapping(uint => Property) public Properties;
    uint[] private propertyIds;

    uint public propCount;

    IERC20 public immutable paymentToken;

    event PropertyCreated(uint id, string name, uint price, address owner);
    event PropertyDeleted(uint id);
    event PropertyPurchased(uint id, address oldOwner, address newOwner, uint price);
    event PropertyListed(uint id, uint price);

    constructor(address _token) {
        paymentToken = IERC20(_token);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    modifier onlyOwner(uint _id) {
        if (Properties[_id].owner != msg.sender) {
            revert Not_Owner();
        }
        _;
    }

    modifier PropertyExist(uint _id) {
        if (Properties[_id].id == 0) {
            revert Property_Does_Not_Exist();
        }
        _;
    }

    modifier PropertyForSale(uint _id) {
        if (!Properties[_id].for_sale) {
            revert Property_Not_For_sale();
        }
        _;
    }

    modifier ownerCanNotBuyThereProperty(uint _id) {
        if (Properties[_id].owner == msg.sender) {
            revert Owner_Can_Not_Buy_Property();
        }
        _;
    }

    function createProperty(string memory _name, uint _price) external onlyRole(MANAGER_ROLE) {
        require(_price > 0, "set a price higher than zero");

        propCount = propCount + 1;

        Property memory property = Property(
            propCount,
            _name,
            _price,
            msg.sender,
            true,
            block.timestamp
        );

        Properties[propCount] = property;
        propertyIds.push(propCount);

        // emit ProperrtyCreated(propCount, _name, )
        emit PropertyCreated(propCount, _name, _price, msg.sender);
    }

    function removeProperty(
        uint _id
    ) external onlyRole(MANAGER_ROLE) PropertyExist(_id) {
        // require(_id == Properties[_id].id, "Property does not exist");

        delete Properties[_id];

        for (uint i = 0; i < propertyIds.length; i++) {
            if (propertyIds[i] == _id) {
                propertyIds[i] = propertyIds[propertyIds.length - 1];
                propertyIds.pop();
                break;
            }
        }

        // emit ProprtyDeleted()
        emit PropertyDeleted(_id);
    }

    function listPropertyForSale(uint _id, uint _price)
        external
        onlyOwner(_id)
        PropertyExist(_id)
    {
        require(_price > 0, "invalid price");
        Properties[_id].price = _price;
        Properties[_id].for_sale = true;

        emit PropertyListed(_id, _price);
    }

    function BuyProperty(
        uint _id
    )
        external
        nonReentrant
        PropertyExist(_id)
        PropertyForSale(_id)
        ownerCanNotBuyThereProperty(_id)
    {
        Property storage property = Properties[_id];

        uint price = property.price;
        address oldOwner = property.owner;

        bool success = paymentToken.transferFrom(msg.sender, oldOwner, price);
        require(success, "payment failed");

        property.owner = msg.sender;
        property.for_sale = false;

        emit PropertyPurchased(_id, oldOwner, msg.sender, price);
    }

    function getPropertyById(uint _id) external view returns (Property memory) {
        return Properties[_id];
    }

    function getAllProperties() external view returns (Property[] memory) {
        Property[] memory allProperties = new Property[](propertyIds.length);

        for (uint i = 0; i < propertyIds.length; i++) {
            allProperties[i] = Properties[propertyIds[i]];
        }

        return allProperties;
    }
}