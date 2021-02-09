pragma solidity =0.6.6;

interface IWhitelistingTool {
    function whitelistAll(address[] calldata _addrs) external;
    function unwhitelistAll(address[] calldata _addrs) external;
    function isWhitelisted(address _addr) external view returns (bool);
}
