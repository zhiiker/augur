pragma solidity 0.5.4;

import "../reporting/IInitialReporter.sol";
import "../reporting/IMarket.sol";
import "../reporting/IInitialReporter.sol";
import "../IAugur.sol";
import "../libraries/CloneFactory.sol";







/**
 * @title Initial Reporter Factory
 * @notice A Factory contract to create Initial Reporter delegate contracts
 * @dev Should not be used directly. Only intended to be used by Market contracts
 */
contract InitialReporterFactory is CloneFactory {
    function createInitialReporter(IAugur _augur, address _designatedReporter) public returns (IInitialReporter) {
        IMarket _market = IMarket(msg.sender);
        IInitialReporter _initialReporter = IInitialReporter(createClone(_augur.lookup("InitialReporter")));
        _initialReporter.initialize(_augur, _market, _designatedReporter);
        return _initialReporter;
    }
}
