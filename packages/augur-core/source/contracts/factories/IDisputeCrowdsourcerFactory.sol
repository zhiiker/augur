pragma solidity 0.5.4;

import "../reporting/IDisputeCrowdsourcer.sol";
import "../IAugur.sol";


contract IDisputeCrowdsourcerFactory {
    function createDisputeCrowdsourcer(IAugur _augur, uint256 _size, bytes32 _payoutDistributionHash, uint256[] memory _payoutNumerators) public returns (IDisputeCrowdsourcer);
}
