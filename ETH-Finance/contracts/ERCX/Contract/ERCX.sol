//SPDX-License-Identifier: un-licensed
pragma solidity ^0.8.0; 

import "../Interface/IERCX.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../Interface/IERCXReceiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ERCX is IERCX, ERC165Storage {
    using Strings for uint256;
    using SafeMath for uint256;
    using Address for address;
    using Counters for Counters.Counter;

    // Mapping from item ID to layer to owner
    mapping(uint256 => mapping(uint256 => address)) private _itemOwner;

    // Mapping from item ID to layer to approved address
    mapping(uint256 => mapping(uint256 => address)) private _transferApprovals;

    // Mapping from owner to layer to number of owned item
    mapping(address => mapping(uint256 => Counters.Counter)) private _ownedItemsCount;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Mapping from item ID to approved address of setting lien
    mapping(uint256 => address) private _lienApprovals;

    // Mapping from item ID to contract address of lien
    mapping(uint256 => address) private _lienAddress;

    // Mapping from item ID to approved address of setting tenant right agreement
    mapping(uint256 => address) private _tenantRightApprovals;

    // Mapping from item ID to contract address of TenantRight
    mapping(uint256 => address) private _tenantRightAddress;

    event TenantRightApprovalCleared(address, uint256);

    bytes4 private constant _InterfaceId_ERCX = type(IERCX).interfaceId;

    constructor() {
        // register the supported interfaces to conform to ERCX via ERC165
        _registerInterface(_InterfaceId_ERCX);
    }

    /**
   * @dev Gets the balance of the specified address
   * @param owner address to query the balance of
   * @return uint256 representing the amount of items owned by the passed address in the specified layer
   */
    function balanceOfOwner(address owner) public override view returns (uint256) {
        require(owner != address(0), "ERCX: owner is address zero");
        uint256 balance = _ownedItemsCount[owner][2].current();
        return balance;
    }

    /**
   * @dev Gets the balance of the specified address
   * @param user address to query the balance of
   * @return uint256 representing the amount of items owned by the passed address
   */
    function balanceOfUser(address user) public override view returns (uint256) {
        require(user != address(0), "ERCX: user is address zero");
        uint256 balance = _ownedItemsCount[user][1].current();
        return balance;
    }

    /**
   * @dev Gets the user of the specified item ID
   * @param itemId uint256 ID of the item to query the user of
   * @return owner address currently marked as the owner of the given item ID
   */
    function userOf(uint256 itemId) public override view returns (address) {
        require(_exists(itemId, 1), "ERCX: operator query for nonexistent token");
        address user = _itemOwner[itemId][1];
        require(user != address(0), "ERCX: user is address zero");
        return user;
    }

    /**
   * @dev Gets the owner of the specified item ID
   * @param itemId uint256 ID of the item to query the owner of
   * @return owner address currently marked as the owner of the given item ID
   */
    function ownerOf(uint256 itemId) public virtual override view returns (address) {
        require(_exists(itemId, 2), "ERCX: operator query for nonexistent token");
        address owner = _itemOwner[itemId][2];
        require(owner != address(0), "ERCX: owner is address zero");
        return owner;
    }

    /**
   * @dev Approves another address to transfer the user of the given item ID
   * The zero address indicates there is no approved address.
   * There can only be one approved address per item at a given time.
   * Can only be called by the item owner or an approved operator.
   * @param to address to be approved for the given item ID
   */
    function approveForUser(address to, uint256 itemId) public override {
        require(_exists(itemId, 1), "ERCX: operator query for nonexistent token");
        address user = userOf(itemId);
        address owner = ownerOf(itemId);

        require(to != owner && to != user, "ERCX: to is owner or user");
        require(
            msg.sender == user ||
                msg.sender == owner ||
                isApprovedForAll(user, msg.sender) ||
                isApprovedForAll(owner, msg.sender), "ERCX: caller is not owner or not approved for owner or user"
        );
        if (msg.sender == owner || isApprovedForAll(owner, msg.sender)) {
            require(getCurrentTenantRight(itemId) == address(0), "ERCX: tenant right is not address zero");
        }
        _transferApprovals[itemId][1] = to;
        emit ApprovalForUser(user, to, itemId);
    }

    /**
   * @dev Gets the approved address for the user of the item ID, or zero if no address set
   * Reverts if the item ID does not exist.
   * @param itemId uint256 ID of the item to query the approval of
   * @return address currently approved for the given item ID
   */
    function getApprovedForUser(uint256 itemId) public override view returns (address) {
        require(_exists(itemId, 1), "ERCX: operator query of nonexistent token");
        return _transferApprovals[itemId][1];
    }

    /**
   * @dev Approves another address to transfer the owner of the given item ID
   * The zero address indicates there is no approved address.
   * There can only be one approved address per item at a given time.
   * Can only be called by the item owner or an approved operator.
   * @param to address to be approved for the given item ID
   * @param itemId uint256 ID of the item to be approved
   */
    function approveForOwner(address to, uint256 itemId) public override {
        require(_exists(itemId, 2), "ERCX: operator query for nonexistent token");
        address owner = ownerOf(itemId);

        require(to != owner, "ERCX: approval to current owner");
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender), "ERCX: approve caller is not owner nor approved for all");
        _transferApprovals[itemId][2] = to;
        emit ApprovalForOwner(owner, to, itemId);

    }

    /**
   * @dev Gets the approved address for the of the item ID, or zero if no address set
   * Reverts if the item ID does not exist.
   * @param itemId uint256 ID of the item to query the approval o
   * @return address currently approved for the given item ID
   */
    function getApprovedForOwner(uint256 itemId) public override view returns (address) {
        require(_exists(itemId, 2), "ERCX: operator query for nonexistent token");
        return _transferApprovals[itemId][2];
    }

    /**
   * @dev Sets or unsets the approval of a given operator
   * An operator is allowed to transfer all items of the sender on their behalf
   * @param to operator address to set the approval
   * @param approved representing the status of the approval to be set
   */
    function setApprovalForAll(address to, bool approved) public virtual override  {
        require(to != msg.sender, "ERCX: caller cannot approve himself");
        _operatorApprovals[msg.sender][to] = approved;
    }

    /**
   * @dev Tells whether an operator is approved by a given owner
   * @param owner owner address which you want to query the approval of
   * @param operator operator address which you want to query the approval of
   * @return bool whether the given operator is approved by the given owner
   */
    function isApprovedForAll(address owner, address operator)
        public virtual override
        view
        returns (bool)
    {
        return _operatorApprovals[owner][operator];
    }

    /**
   * @dev Approves another address to set lien contract for the given item ID
   * The zero address indicates there is no approved address.
   * There can only be one approved address per item at a given time.
   * Can only be called by the item owner or an approved operator.
   * @param to address to be approved for the given item ID
   * @param itemId uint256 ID of the item to be approved
   */
    function approveLien(address to, uint256 itemId) public override {
        address owner = ownerOf(itemId);
        // require(to != owner);
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender), "ERCX: approve caller is not owner nor approved for all");
        _lienApprovals[itemId] = to;
        emit LienApproval(to, itemId);
    }

    /**
   * @dev Gets the approved address for setting lien for a item ID, or zero if no address set
   * Reverts if the item ID does not exist.
   * @param itemId uint256 ID of the item to query the approval of
   * @return address currently approved for the given item ID
   */
    function getApprovedLien(uint256 itemId) public override view returns (address) {
        require(_exists(itemId, 2), "ERCX: operator query for nonexistent token");
        return _lienApprovals[itemId];
    }
    /**
   * @dev Sets lien agreements to already approved address
   * The lien address is allowed to transfer all items of the sender on their behalf
   * @param itemId uint256 ID of the item
   */
    function setLien(uint256 itemId) public override {
        require(msg.sender == getApprovedLien(itemId), "ERCX: lien not approved");
        _lienAddress[itemId] = msg.sender;
        _clearLienApproval(itemId);
        emit LienSet(msg.sender, itemId, true);
    }

    /**
   * @dev Gets the current lien agreement address, or zero if no address set
   * Reverts if the item ID does not exist.
   * @param itemId uint256 ID of the item to query the lien address
   * @return address of the lien agreement address for the given item ID
   */
    function getCurrentLien(uint256 itemId) public override view returns (address) {
        require(_exists(itemId, 2), "ERCX: operator query for nonexistent token");
        return _lienAddress[itemId];
    }

    /**
   * @dev Revoke the lien agreements. Only the lien address can revoke.
   * @param itemId uint256 ID of the item
   */
    function revokeLien(uint256 itemId) public override {
        require(msg.sender == getCurrentLien(itemId), "ERCX: caller does not have current lien");
        _lienAddress[itemId] = address(0);
        emit LienSet(address(0), itemId, false);
    }

    /**
   * @dev Approves another address to set tenant right agreement for the given item ID
   * The zero address indicates there is no approved address.
   * There can only be one approved address per item at a given time.
   * Can only be called by the item owner or an approved operator.
   * @param to address to be approved for the given item ID
   * @param itemId uint256 ID of the item to be approved
   */
    function approveTenantRight(address to, uint256 itemId) public override {
        require(getCurrentTenantRight(itemId) == address(0), "ERCX: Tenant right exists");
        address owner = ownerOf(itemId);
        require(to != owner, "ERCX: to cannot be owner");
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender), "ERCX: caller is not owner nor approved");
        _tenantRightApprovals[itemId] = to;
        emit TenantRightApproval(to, itemId);
    }

    /**
   * @dev Gets the approved address for setting tenant right for a item ID, or zero if no address set
   * Reverts if the item ID does not exist.
   * @param itemId uint256 ID of the item to query the approval of
   * @return address currently approved for the given item ID
   */
    function getApprovedTenantRight(uint256 itemId)
        public override
        view
        returns (address)
    {
        require(_exists(itemId, 2));
        return _tenantRightApprovals[itemId];
    }
    /**
   * @dev Sets the tenant right agreement to already approved address
   * The lien address is allowed to transfer all items of the sender on their behalf
   * @param itemId uint256 ID of the item
   */
    function setTenantRight(uint256 itemId) public override {
        require(msg.sender == getApprovedTenantRight(itemId), "ERCX: caller does not have tenant rights");
        _tenantRightAddress[itemId] = msg.sender;
        _clearTenantRightApproval(itemId);
        _clearTransferApproval(itemId, 1); //Reset transfer approval
        emit TenantRightSet(msg.sender, itemId, true);
    }

    /**
   * @dev Sets the tenant right agreement to already approved address
   * The lien address is allowed to transfer all items of the sender on their behalf
   * @param itemId uint256 ID of the item
   * @param tenantAppoval flag for clearing tenant right approval
   */
    function setTenantRight(uint256 itemId, bool tenantAppoval) public {
        require(msg.sender == getApprovedTenantRight(itemId), "ERCX: caller does not have tenant rights");
        require(getCurrentTenantRight(itemId) == address(0), "error msg");
        _tenantRightAddress[itemId] = msg.sender;
        if(tenantAppoval) {
        _clearTenantRightApproval(itemId);
        }
        _clearTransferApproval(itemId, 1); //Reset transfer approval
        emit TenantRightSet(msg.sender, itemId, tenantAppoval);
    }

    function clearTenantRightApproval(uint256 itemId) public {
        require(msg.sender == getApprovedTenantRight(itemId), "ERCX: caller does not have tenant rights");
        _clearTenantRightApproval(itemId);

        emit TenantRightApprovalCleared(msg.sender, itemId);
    }

    

    /**
   * @dev Gets the current tenant right agreement address, or zero if no address set
   * Reverts if the item ID does not exist.
   * @param itemId uint256 ID of the item to query the tenant right address
   * @return address of the tenant right agreement address for the given item ID
   */
    function getCurrentTenantRight(uint256 itemId)
        public override
        view
        returns (address)
    {
        require(_exists(itemId, 2));
        return _tenantRightAddress[itemId];
    }

    /**
   * @dev Revoke the tenant right agreement. Only the lien address can revoke.
   * @param itemId uint256 ID of the item
   */
    function revokeTenantRight(uint256 itemId) public override {
        require(msg.sender == getCurrentTenantRight(itemId), "ERCX: caller does not have tenant right");
        _tenantRightAddress[itemId] = address(0);
        emit TenantRightSet(address(0), itemId, false);
    }

    /**
   * @dev Safely transfers the user of a given item ID to another address
   * If the target address is a contract, it must implement `onERCXReceived`,
   * which is called upon a safe transfer, and return the magic value
   * `bytes4(keccak256("onERCXReceived(address,address,uint256,bytes)"))`; otherwise,
   * the transfer is reverted.
   *
   * Requires the msg sender to be the owner, approved, or operator
   * @param from current owner of the item
   * @param to address to receive the ownership of the given item ID
   * @param itemId uint256 ID of the item to be transferred

  */
    function safeTransferUser(address from, address to, uint256 itemId) public override {
        // solium-disable-next-line arg-overflow
        safeTransferUser(from, to, itemId, "");
    }


    /**
   * @dev Safely transfers the user of a given item ID to another address
   * If the target address is a contract, it must implement `onERCXReceived`,
   * which is called upon a safe transfer, and return the magic value
   * `bytes4(keccak256("onERCXReceived(address,address,uint256,bytes)"))`; otherwise,
   * the transfer is reverted.
   * Requires the msg sender to be the owner, approved, or operator
   * @param from current owner of the item
   * @param to address to receive the ownership of the given item ID
   * @param itemId uint256 ID of the item to be transferred
   * @param data bytes data to send along with a safe transfer check
   */
    function safeTransferUser(
        address from,
        address to,
        uint256 itemId,
        bytes memory data
    ) public override {
        require(_isEligibleForTransfer(msg.sender, itemId, 1), "ERCX: user _isEligibleForTransfer error");
        _safeTransfer(from, to, itemId, 1, data);
    }

    /**
   * @dev Safely transfers the ownership of a given item ID to another address
   * If the target address is a contract, it must implement `onERCXReceived`,
   * which is called upon a safe transfer, and return the magic value
   * `bytes4(keccak256("onERCXReceived(address,address,uint256,bytes)"))`; otherwise,
   * the transfer is reverted.
   *
   * Requires the msg sender to be the owner, approved, or operator
   * @param from current owner of the item
   * @param to address to receive the ownership of the given item ID
   * @param itemId uint256 ID of the item to be transferred
  */
    function safeTransferOwner(address from, address to, uint256 itemId)
        public override
    {
        // solium-disable-next-line arg-overflow
        safeTransferOwner(from, to, itemId, "");
    }

    /**
   * @dev Safely transfers the ownership of a given item ID to another address
   * If the target address is a contract, it must implement `onERCXReceived`,
   * which is called upon a safe transfer, and return the magic value
   * `bytes4(keccak256("onERCXReceived(address,address,uint256,bytes)"))`; otherwise,
   * the transfer is reverted.
   * Requires the msg sender to be the owner, approved, or operator
   * @param from current owner of the item
   * @param to address to receive the ownership of the given item ID
   * @param itemId uint256 ID of the item to be transferred
   * @param data bytes data to send along with a safe transfer check
   */
    function safeTransferOwner(
        address from,
        address to,
        uint256 itemId,
        bytes memory data
    ) public override {
        require(_isEligibleForTransfer(msg.sender, itemId, 2), "ERCX: owner _isEligibleForTransfer error");
        _safeTransfer(from, to, itemId, 2, data);
    }

    /**
    * @dev Safely transfers the ownership of a given item ID to another address
    * If the target address is a contract, it must implement `onERCXReceived`,
    * which is called upon a safe transfer, and return the magic value
    * `bytes4(keccak256("onERCXReceived(address,address,uint256,bytes)"))`; otherwise,
    * the transfer is reverted.
    * Requires the msg.sender to be the owner, approved, or operator
    * @param from current owner of the item
    * @param to address to receive the ownership of the given item ID
    * @param itemId uint256 ID of the item to be transferred
    * @param layer uint256 number to specify the layer
    * @param data bytes data to send along with a safe transfer check
    */
    function _safeTransfer(
        address from,
        address to,
        uint256 itemId,
        uint256 layer,
        bytes memory data
    ) internal {
        _transfer(from, to, itemId, layer);
        require(
            _checkOnERCXReceived(from, to, itemId, layer, data),
            "ERCX: transfer to non ERCXReceiver implementer"
        );
    }

    /**
    * @dev Returns whether the given spender can transfer a given item ID.
    * @param spender address of the spender to query
    * @param itemId uint256 ID of the item to be transferred
    * @param layer uint256 number to specify the layer
    * @return bool whether the msg.sender is approved for the given item ID,
    * is an operator of the owner, or is the owner of the item
    */
    function _isEligibleForTransfer(
        address spender,
        uint256 itemId,
        uint256 layer
    ) internal view returns (bool) {
        require(_exists(itemId, layer), "ERCX: query of non-existent token");
        bool flag;
        if (layer == 1) {
            address user = userOf(itemId);
            address owner = ownerOf(itemId);
            require(
                spender == user ||
                    spender == owner ||
                    isApprovedForAll(user, spender) ||
                    isApprovedForAll(owner, spender) ||
                    spender == getApprovedForUser(itemId) ||
                    spender == getCurrentLien(itemId)
            , "ERCX: spender is not owner, nor have user/owner approval or lien");
            if (spender == owner || isApprovedForAll(owner, spender)) {
                require(getCurrentTenantRight(itemId) == address(0), "ERCX: current tenant right is not null");
            }
            flag = true;
        }

        if (layer == 2) {
            address owner = ownerOf(itemId);
            require(
                spender == owner ||
                    isApprovedForAll(owner, spender) ||
                    spender == getApprovedForOwner(itemId) ||
                    spender == getCurrentLien(itemId)
             , "ERCX: spender is not owner, nor have user approval or lien");
            flag = true;
        }
        return flag;
    }

    /**
   * @dev Returns whether the specified item exists
   * @param itemId uint256 ID of the item to query the existence of
   * @param layer uint256 number to specify the layer
   * @return whether the item exists
   */
    function _exists(uint256 itemId, uint256 layer)
        internal
        view
        returns (bool)
    {
        address owner = _itemOwner[itemId][layer];
        return owner != address(0);
    }

    /**
    * @dev Internal function to safely mint a new item.
    * Reverts if the given item ID already exists.
    * If the target address is a contract, it must implement `onERCXReceived`,
    * which is called upon a safe transfer, and return the magic value
    * `bytes4(keccak256("onERCXReceived(address,address,uint256,bytes)"))`; otherwise,
    * the transfer is reverted.
    * @param to The address that will own the minted item
    * @param itemId uint256 ID of the item to be minted
    */
    function _safeMint(address to, uint256 itemId) internal {
        _safeMint(to, itemId, "");
    }

    /**
    * @dev Internal function to safely mint a new item.
    * Reverts if the given item ID already exists.
    * If the target address is a contract, it must implement `onERCXReceived`,
    * which is called upon a safe transfer, and return the magic value
    * `bytes4(keccak256("onERCXReceived(address,address,uint256,bytes)"))`; otherwise,
    * the transfer is reverted.
    * @param to The address that will own the minted item
    * @param itemId uint256 ID of the item to be minted
    * @param data bytes data to send along with a safe transfer check
    */
    function _safeMint(address to, uint256 itemId, bytes memory data) internal {
        _mint(to, itemId);
        require(_checkOnERCXReceived(address(0), to, itemId, 1, data), "ERCX: transfer to non ERCXReceived implementer");
        require(_checkOnERCXReceived(address(0), to, itemId, 2, data), "ERCX: transfer to non ERCXReceived implementer");
    } 

    /**
    * @dev Internal function to mint a new item.
    * Reverts if the given item ID already exists.
    * A new item iss minted with all three layers.
    */
    function _mint(address to, uint256 itemId) internal virtual {
        require(to != address(0), "ERCX: mint to the zero address");
        require(!_exists(itemId, 1), "ERCX: item already minted");

        _itemOwner[itemId][1] = to;
        _itemOwner[itemId][2] = to;
        _ownedItemsCount[to][1].increment();
        _ownedItemsCount[to][2].increment();

        emit TransferUser(address(0), to, itemId, to);
        emit TransferOwner(address(0), to, itemId, to);

    }

    /**
    * @dev Internal function to burn a specific item.
    * Reverts if the item does not exist.
    * @param itemId uint256 ID of the item being burned
    */
    function _burn(uint256 itemId) internal virtual {
        address user = userOf(itemId);
        address owner = ownerOf(itemId);
        require((user == msg.sender && owner == msg.sender) || 
                (isApprovedForAll(owner, msg.sender) && user == owner), 
                "ERCX: caller is not owner nor approved");

        _clearTransferApproval(itemId, 1);
        _clearTransferApproval(itemId, 2);

        _ownedItemsCount[user][1].decrement();
        _ownedItemsCount[owner][2].decrement();
        _itemOwner[itemId][1] = address(0);
        _itemOwner[itemId][2] = address(0);

        emit TransferUser(user, address(0), itemId, msg.sender);
        emit TransferOwner(owner, address(0), itemId, msg.sender);
    }

    /**
    * @dev Internal function to transfer ownership of a given item ID to another address.
    * As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
    * @param from current owner of the item
    * @param to address to receive the ownership of the given item ID
    * @param itemId uint256 ID of the item to be transferred
    * @param layer uint256 number to specify the layer
    */
    function _transfer(address from, address to, uint256 itemId, uint256 layer)
        internal virtual
    {
        if (layer == 1) {
            require(userOf(itemId) == from, "ERCX: transfer from incorrect user");
        } else {
            require(ownerOf(itemId) == from, "ERCX: transfer from incorrect owner");
        }
        require(to != address(0), "ERCX: transfer to zero address");

        _clearTransferApproval(itemId, layer);

        if (layer == 2) {
            _clearLienApproval(itemId);
            _clearTenantRightApproval(itemId);
        }

        _ownedItemsCount[from][layer].decrement();
        _ownedItemsCount[to][layer].increment();

        _itemOwner[itemId][layer] = to;

        if (layer == 1) {
            emit TransferUser(from, to, itemId, msg.sender);
        } else {
            emit TransferOwner(from, to, itemId, msg.sender);
        }

    }

    /**
    * @dev Internal function to invoke {IERCXReceiver-onERCXReceived} on a target address.
    * The call is not executed if the target address is not a contract.
    *
    * This is an internal detail of the `ERCX` contract and its use is deprecated.
    * @param from address representing the previous owner of the given item ID
    * @param to target address that will receive the items
    * @param itemId uint256 ID of the item to be transferred
    * @param layer uint256 number to specify the layer
    * @param data bytes optional data to send along with the call
    * @return bool whether the call correctly returned the expected magic value
    */
    function _checkOnERCXReceived(
        address from,
        address to,
        uint256 itemId,
        uint256 layer,
        bytes memory data
    ) internal returns (bool) {
        if (to.isContract()) {
            try IERCXReceiver(to).onERCXReceived(msg.sender, from, itemId, layer, data) returns (bytes4 retval) {
                return retval == IERCXReceiver.onERCXReceived.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    /**
    * @dev Private function to clear current approval of a given item ID.
    * @param itemId uint256 ID of the item to be transferred
    * @param layer uint256 number to specify the layer
    */
    function _clearTransferApproval(uint256 itemId, uint256 layer) private {
        if (_transferApprovals[itemId][layer] != address(0)) {
            _transferApprovals[itemId][layer] = address(0);
        }
    }

    function _clearTenantRightApproval(uint256 itemId) private {
        if (_tenantRightApprovals[itemId] != address(0)) {
            _tenantRightApprovals[itemId] = address(0);
        }
    }

    function _clearLienApproval(uint256 itemId) private {
        if (_lienApprovals[itemId] != address(0)) {
            _lienApprovals[itemId] = address(0);
        }
    }
}