pragma solidity ^0.4.23;

import "./LottoSetup.sol";

contract LottoDraw is LottoSetup {

  event NewLottoDraw(uint lottoId, uint8[6] numbers); 
    
  function doLottoDraw(uint _lottoId) public {
    uint8[6] memory numbers;
    numbers = [uint8(1),uint8(2),uint8(3),uint8(4),uint8(5),uint8(6)];
    emit NewLottoDraw(_lottoId, numbers); 
/*
    uint timestamp = now;
    uint endTimestamp = timestamp + _duration;
    Lotto memory lotto = lottos[_lottoId];
    emit NewLottoGame(_lottoId, lotto.name, lotto.timestamp, endTimestamp); 
*/
  }

}

