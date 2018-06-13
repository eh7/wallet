pragma solidity ^0.4.23;

import "./Ownable.sol";

contract BallotFactory is Ownable {

  event NewBallot(uint _ballotId, string _description, uint _ballotOwnerId, address _owner);
  event NewVote(uint _ballotId, uint _voteId);
/*
  struct Option {
    uint ballotId;
    uint option;
  }
*/
  struct Ballot {
    string description;
    uint timestamp;
  }

  Ballot[] public ballots;
//  Option[] public options;
  address[] public ballotOwners;

  constructor() public {
  } 

  function newBallot(string _description) public {
    uint ballotOwnerId = ballotOwners.push(msg.sender) - 1;
    uint id = ballots.push(Ballot(_description, block.timestamp)) - 1;
    emit NewBallot(id, _description, ballotOwnerId, msg.sender);
  }
  
  function castVote() public {
  }
}
