pragma solidity ^0.4.23;

import "./Ownable.sol";

contract BallotFactory is Ownable {

  event NewBallot(uint _ballotId, uint _ballotOwnerId, string _ballotDescription, address _ballotOwner);
  event NewOption(uint _ballotId, string _description, uint _optionId);
  event NewVote(uint _ballotId, uint _voteId);

  struct Vote {
    address voter;
    uint ballotId;
    uint optionId;
  }

  struct Option {
    string optionText;
    uint ballotId;
  }

  struct Ballot {
    string description;
    uint timestamp;
//    Option[] options;
//    Vote[] votes;
  }

  Ballot[] public ballots;
  Option[] public options;
  address[] public ballotOwners;

  constructor() public {
  } 

  function newBallot(string _description) public {
    uint ballotOwnerId = ballotOwners.push(msg.sender) - 1;
    uint ballotId      = ballots.push(Ballot(_description, block.timestamp)) - 1;
    emit NewBallot(ballotId, ballotOwnerId, _description, msg.sender);
  }

  function addOption(string _optionText, uint _ballotId) public {
    uint newOptionId = options.push(Option(_optionText, _ballotId)); 
    emit NewOption(_ballotId, _optionText, newOptionId);
  }
  
//  function castVote() public {
//  }
}
