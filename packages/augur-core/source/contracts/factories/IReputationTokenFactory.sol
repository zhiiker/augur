pragma solidity 0.5.4;

import "../reporting/IV2ReputationToken.sol";
import "../reporting/IUniverse.sol";
import "../IAugur.sol";


contract IReputationTokenFactory {
    function createReputationToken(IAugur _augur, IUniverse _parentUniverse) public returns (IV2ReputationToken);
}
