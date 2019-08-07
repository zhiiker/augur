pragma solidity 0.5.4;

import "../reporting/IDisputeWindow.sol";
import "../IAugur.sol";


contract IDisputeWindowFactory {
    function createDisputeWindow(IAugur _augur, uint256 _disputeWindowId, uint256 _windowDuration, uint256 _startTime) public returns (IDisputeWindow);
}
