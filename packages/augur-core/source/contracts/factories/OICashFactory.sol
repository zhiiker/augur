pragma solidity 0.5.4;

import "../trading/IOICash.sol";
import "../reporting/IUniverse.sol";
import "../trading/IOICash.sol";
import "../IAugur.sol";
import "../libraries/CloneFactory.sol";








/**
 * @title OI Cash Factory
 * @notice A Factory contract to create OI Cash Token contracts
 * @dev Should not be used directly. Only intended to be used by Universe contracts
 */
contract OICashFactory is CloneFactory {
    function createOICash(IAugur _augur) public returns (IOICash) {
        IUniverse _universe = IUniverse(msg.sender);
        IOICash _openInterestCash = IOICash(createClone(_augur.lookup("OICash")));
        _openInterestCash.initialize(_augur, _universe, _augur.lookup("ERC1820Registry"));
        return _openInterestCash;
    }
}
