pragma solidity ^0.4.23;

import "./LottoSetup.sol";

contract LottoPlay is LottoSetup {

  event NewLottoPlay(address player, uint lottoId, uint8[6] numbers, uint turnId); 

  struct LottoTurn {
    address player;
    uint lottoId;
    uint8[6] numbers; 
  }

  LottoTurn[] public lottoTurns;

  function playLotto(uint _lottoId, uint8[6] _numbers) public {
    uint id = lottoTurns.push(LottoTurn(msg.sender, _lottoId, _numbers)) - 1;
    emit NewLottoPlay(msg.sender, _lottoId, _numbers, id);
  }

}

