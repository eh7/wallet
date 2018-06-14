pragma solidity ^0.4.23;

import "./Ownable.sol";

contract BallotFactory is Ownable {

//  event NewBallot(uint _ballotId, uint _ballotOwnerId, string _ballotDescription, address _ballotOwner);
  event NewBallot(uint ballotId, string _description, address _ballotOwner, uint _timestamp);
  event NewOption(uint _ballotId, string _description, uint _optionId);
  event BallotOption(uint _ballotId, uint count);
  event NewVote(uint _ballotId, uint _voteId);

/*
  struct Vote {
    address voter;
    uint ballotId;
    uint optionId;
  }

  struct Option {
    string optionText;
    uint ballotId;
  }
*/

  struct Ballot {
    address owner;
    string description;
    uint timestamp;
    uint count;
//    Option[] options;
//    Vote[] votes;
  }

  Ballot[] public ballots;

  // votes[uint ballotId][address voterAddress]
  mapping(uint => mapping(address => uint)) votes;

  // options[uint ballotId][uint id]
  mapping(uint => mapping(uint => string)) options;

//  Option[] public options;
//  address[] public ballotOwners;

  constructor() public {
  } 

  function newBallot(string _description) public {
//    uint ballotOwnerId = ballotOwners.push(msg.sender) - 1;
    uint ballotId = ballots.push(Ballot(msg.sender, _description, block.timestamp, 0)) - 1;
    emit NewBallot(ballotId, _description, msg.sender, block.timestamp);
  }

  function addOption(string _optionText, uint _ballotId) public {
    uint count = ballots[_ballotId].count;
    options[_ballotId][count] = _optionText;
    emit NewOption(_ballotId, _optionText, count);
    count++;
    ballots[_ballotId].count = count;
  }

  function getOptions(uint _ballotId) public view returns (string) {
    uint count = ballots[_ballotId].count;
    emit BallotOption(_ballotId, count);
  }
  
//  function castVote() public {
//  }
}
