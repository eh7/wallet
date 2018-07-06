pragma solidity ^0.4.23;

import "./LottoPlay.sol";

contract LottoDraw is LottoPlay {

  event NewLottoDraw(uint lottoId, uint8[6] numbers); 
  event LottoWinner(uint lottoId, address winner, uint winnerLottoTurnId); 
  event LottoWinners(uint lottoId, address[] winners); 
  event ThisLottoTurn(uint lottoId, uint winnerTurnId, uint8[6] turnNumbers, uint turnCount); 

  mapping (uint => address[]) public winningTurns;
  mapping (uint => uint) public winningTurnCount;
  mapping (uint => uint) public lottoStatus;

/*
  function getTurn(uint _lottoId, uint _turnId) public {

    uint8[6] memory numbers;
    numbers = [uint8(3),uint8(2),uint8(3),uint8(4),uint8(5),uint8(6)];

    for(uint i=0; i<lottoTurns.length; i++) {
      if(lottoTurns[i].lottoId == _lottoId) {
        if(lottoTurns[i].numbers[0] == numbers[0] &&
           lottoTurns[i].numbers[1] == numbers[1] &&
           lottoTurns[i].numbers[2] == numbers[2] &&
           lottoTurns[i].numbers[3] == numbers[3] &&
           lottoTurns[i].numbers[4] == numbers[4] &&
           lottoTurns[i].numbers[5] == numbers[5]) {
          winningTurns[_lottoId].push(lottoTurns[i].player);
          emit ThisLottoTurn(_lottoId, i, lottoTurns[i].numbers, 1);
        }
      }
//      LottoWinnerChecks(lottoTurns[i]);
    }
//    LottoTurn memory thisLottoTurn = lottoTurns[_turnId]; 
//    emit ThisLottoTurn(_lottoId, _turnId, thisLottoTurn.numbers);
//    emit ThisLottoTurn(_lottoId, _turnId, lottoTurns[_turnId].numbers, lottoTurns.length);
  }
*/

  function doLottoDraw(uint _lottoId) public {

//    if(lottoStatus[_lottoId] != 1) {
    require(lottoStatus[_lottoId] != 1);

    lottoStatus[_lottoId] = 1;

    uint8[6] memory numbers;
    numbers = [uint8(3),uint8(2),uint8(3),uint8(4),uint8(5),uint8(6)];

    uint count = 0;

    for(uint i=0; i<lottoTurns.length; i++) {
      if(lottoTurns[i].lottoId == _lottoId) {
        if(lottoTurns[i].numbers[0] == numbers[0] &&
           lottoTurns[i].numbers[1] == numbers[1] &&
           lottoTurns[i].numbers[2] == numbers[2] &&
           lottoTurns[i].numbers[3] == numbers[3] &&
           lottoTurns[i].numbers[4] == numbers[4] &&
           lottoTurns[i].numbers[5] == numbers[5]) {
          winningTurns[_lottoId].push(lottoTurns[i].player);
          winningTurnCount[_lottoId]++;
          count++;
        }
      }
    }

    emit LottoWinners(_lottoId, winningTurns[_lottoId]);

    emit NewLottoDraw(_lottoId, numbers); 
//    }
  }

}

