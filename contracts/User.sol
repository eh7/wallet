pragma solidity ^0.4.23;

import "./Ownable.sol";

contract User is Ownable {

  event NewUser(address sender, bytes32 hash);
  event UpdateUser(address sender, bytes32 hash);

  mapping (address => bytes32) public hash;  

  constructor() public {
  }
  
  function updateUser(string _data) public {
    hash[msg.sender] = keccak256(_data);
    emit UpdateUser(msg.sender, hash[msg.sender]);
  }

  function validateUserData(string _data, bytes32 _hash) public pure returns (bool) {

    if(keccak256(_data) == _hash) {
      return true;
    } else {
      return false;
    }
  }

}
