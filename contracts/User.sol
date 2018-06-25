pragma solidity ^0.4.23;

import "./Ownable.sol";

contract User is Ownable {

  event NewUser(address sender, bytes32 hash);
  event UpdateUser(address sender, bytes32 hash);

  mapping (address => bytes32) public hash;  

  constructor() public {
  }
  
  function updateUser(string data) public {
    hash[msg.sender] = keccak256(data);
    emit UpdateUser(msg.sender, hash[msg.sender]);
  }
}
