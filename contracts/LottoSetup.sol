pragma solidity ^0.4.23;

import "./LottoFactory.sol";

contract LottoSetup is LottoFactory {

  event NewLottoSetup(uint lottoId, string name, uint timestamp, uint endTime); 
    
//  mapping (uint => address) public lottoGames;

  function lottoSetup(uint _lottoId, uint _duration) public {
    uint timestamp = now;
    uint endTimestamp = timestamp + _duration;
    lottos[_lottoId].timestamp = timestamp;
    lottos[_lottoId].endTimestamp = endTimestamp;
    Lotto memory lotto = lottos[_lottoId];
    emit NewLottoSetup(_lottoId, lotto.name, lotto.timestamp, endTimestamp); 
  }

}

