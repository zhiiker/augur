pragma solidity 0.5.4;

import "../libraries/token/IERC20.sol";
import "../reporting/IMarket.sol";
import "../libraries/token/IERC20.sol";
import "../reporting/IMarket.sol";
import "./Order.sol";


contract ICreateOrder {
    function publicCreateOrder(Order.Types, uint256, uint256, IMarket, uint256, bytes32, bytes32, bytes32, bool, IERC20) external returns (bytes32);
    function createOrder(address, Order.Types, uint256, uint256, IMarket, uint256, bytes32, bytes32, bytes32, bool, IERC20) external returns (bytes32);
}
