// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

error Not_Owner();
error Property_Does_Not_Exist();
error Property_Not_For_sale();
error Owner_Can_Not_Buy_Property();

contract propMangement {
    struct Property {
        uint id;
        string name;
        uint price;
        address owner;
        bool for_sale;
        uint time_created;
    }

    mapping(uint => Property) Properties;

    uint propCount;

    modifier onlyOwner(uint _id) {
        if (Properties[_id].owner != msg.sender) {
            revert Not_Owner();
        }
        _;
    }

    modifier PropertyExist(uint _id) {
        if (_id != Properties[_id].id) {
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
        if (!Properties[_id].for_sale) {
            revert Owner_Can_Not_Buy_Property();
        }
        _;
    }

    function createProperty(string memory _name, uint _price) external {
        require(_price > 0, "set a price higher than zero");
        propCount = propCount + 1;
        Property memory property = Property(
            propCount,
            _name,
            _price,
            msg.sender,
            false,
            block.timestamp
        );

        Properties[propCount] = property;

        // emit ProperrtyCreated(propCount, _name, )
    }

    function removeProperty(
        uint _id
    ) external onlyOwner(_id) PropertyExist(_id) {
        // require(_id == Properties[_id].id, "Property does not exist");

        // delete Properties[_id];

        // emit ProprtyDeleted()
        
    }

    function BuyProperty(
        uint _id
    )
        external
        PropertyExist(_id)
        PropertyForSale(_id)
        ownerCanNotBuyThereProperty(_id)
    {}

    function getPropertyById(uint _id) external view returns (Property memory) {
        return Properties[_id];
    }
}
