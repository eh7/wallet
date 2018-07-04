pragma solidity ^0.4.23;

import "./LottoSetup.sol";

contract LottoPlay is LottoSetup {

  event NewLottoPlay(uint lottoId, address player); 
    
  function playLotto(uint _lottoId, address _player, uint8[6] numbers) public {
/*
    uint timestamp = now;
    uint endTimestamp = timestamp + _duration;
    lottos[_lottoId].timestamp = timestamp;
    lottos[_lottoId].endTimestamp = endTimestamp;
    Lotto memory lotto = lottos[_lottoId];
    emit NewLottoGame(_lottoId, lotto.name, lotto.timestamp, endTimestamp); 
*/
  }

}

