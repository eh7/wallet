pragma solidity ^0.4.23;

import "./Ownable.sol";

contract LottoFactory is Ownable {

  event NewLotto(uint lottoId, string name, uint timestamp, uint count, uint8 number); 

  uint8 lottoNumber = 6;
    
  struct Lotto {
    string name;
    uint timestamp;
    uint endTimestamp;
    uint8 number;
  }

  Lotto[] public lottos;

  mapping (uint => address) public lottoOwner;
  mapping (address => uint) public lottoCount; 

  function newLotto(string _name) public {
    uint timestamp = now;
    uint id = lottos.push(Lotto(_name, timestamp, 0, lottoNumber)) - 1;
    lottoCount[msg.sender]++;
    lottoOwner[id] = msg.sender;
    emit NewLotto(id, _name, timestamp, lottoCount[msg.sender], lottoNumber); 
  }

}

