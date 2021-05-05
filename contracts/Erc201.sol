pragma solidity ^0.5.12;



interface Erc201 {
    function approve(address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);
}