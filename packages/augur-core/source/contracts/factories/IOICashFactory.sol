pragma solidity 0.5.4;

import "../trading/IOICash.sol";
import "../IAugur.sol";


contract IOICashFactory {
    function createOICash(IAugur _augur) public returns (IOICash);
}
