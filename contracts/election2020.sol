pragma solidity ^0.4.24;

contract Election {
    
    struct Candidate {
        string name;
        uint voteCount;
    }
    struct Voter {
        bool authorized;
        bool voted;
        uint vote;
    }
    address public owner;
    string public WYElection;
    
    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    uint public totalVotes;
    
    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }
    
    function Election2020(string _name) public {
        owner = msg.sender;
        WYElection = _name;
    }
    
    function addCandidate(string _name) ownerOnly public {
        candidates.push(Candidate(_name, 0));
    }
    
    function getNumCandidate() public view returns(uint) {
        return candidates.length;
    }
    
    function authorized(address _person) ownerOnly public {
        voters[_person].authorized = true;
    }
    function vote(uint _voteIndex) public {
        require(voters[msg.sender].voted);
        require(voters[msg.sender].authorized);
        
        voters[msg.sender].vote = _voteIndex;
        voters[msg.sender].voted = true;
        
        candidates[_voteIndex].voteCount += 1;
        totalVotes += 1;
    }
    
    function() ownerOnly public {
        selfdestruct(owner);
    }
}