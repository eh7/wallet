pragma solidity ^0.4.23;

import "./Ownable.sol";

contract BallotFactory is Ownable {

  event NewBallot(uint ballotId, string _description, address _ballotOwner, uint _timestamp, uint count);
  event NewOption(uint _ballotId, string _description, uint _optionId);
  event BallotOption(uint _ballotId, uint count, string _description);
  event NewVote(uint _ballotId, uint _voteId);

  struct Ballot {
    address owner;
    string description;
    uint32 timestamp;
    uint32 count;
  }

  Ballot[] public ballots;

  // votes[uint ballotId][address voterAddress]
  mapping(uint => mapping(address => uint)) public votes;

  // options[uint ballotId][uint id]
  mapping(uint => mapping(uint => string)) public options;

//  Option[] public options;
//  address[] public ballotOwners;

  constructor() public {
  } 

  function newBallot(string _description) public {
//    uint ballotOwnerId = ballotOwners.push(msg.sender) - 1;
    uint ballotId = ballots.push(Ballot(msg.sender, _description, uint32(block.timestamp), 0)) - 1;
    emit NewBallot(ballotId, _description, msg.sender, block.timestamp, 0);
  }

  function addOption(string _optionText, uint _ballotId) public {
    uint count = ballots[_ballotId].count;
    options[_ballotId][count] = _optionText;
    emit NewOption(_ballotId, _optionText, count);
    count++;
    ballots[_ballotId].count = uint32(count);
  }

  function getOption(uint _ballotId, uint _count) public view returns (string) {
    emit BallotOption(_ballotId, _count , options[_ballotId][_count]);
    return options[_ballotId][_count];
  }
  
  function castVote(uint _ballotId, uint _optionId) public {
    emit NewVote(_ballotId, votes[_ballotId][msg.sender]);
    votes[_ballotId][msg.sender] = _optionId;
    emit NewVote(_ballotId, _optionId);
  }
}
