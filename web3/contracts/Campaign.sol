// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
contract CampaignFactory {
    event CampaignCreated(address indexed owner, address campaign, string title, uint256 goal, uint256 deadline, string metaDataURI);

    address[] public campaigns;
    function createCampaign(string memory _title, uint256 _goalWei, uint64 _deadlineTs, string memory _metaDataURI) external returns (address addr) {
        require(_goalWei > 0, "Goal must be greater than 0");
        require(_deadlineTs > block.timestamp, "Deadline must be in the future");
        Campaign c = new Campaign(msg.sender, _title, _goalWei, _deadlineTs, _metaDataURI);
        addr = address(c);
        campaigns.push(addr);
        emit CampaignCreated(msg.sender, addr, _title, _goalWei, _deadlineTs, _metaDataURI);
    }
    function getCampaigns() external view returns (address[] memory) {
        return campaigns;
    }
}
contract Campaign is ReentrancyGuard {
    struct Request {
        string description;
        uint256 amount;
        address payable recipient;
        uint256 approvalCount;
        bool complete;
        mapping(address => bool) approvals;
    }
    event Contributed(address indexed from, uint256 value);
    event Refunded(address indexed to, uint256 value);
    event RequestCreated(uint256 indexed id, string description, uint256 amount, address recipient);
    event Approved(uint256 indexed id, address indexed voter, uint256 weight);
    event Finalized(uint256 indexed id);

    address public immutable owner;
    string public title;
    string public metaDataURI;
    uint256 public goalWei;
    uint64 public deadlineTs;
    uint256 public totalRaised;
    uint256 public contributorCount;

    mapping(address => uint256) public contributions;
    Request[] public requests;
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    constructor(address _owner, string memory _title, uint256 _goalWei, uint64 _deadlineTs, string memory _metaDataURI) {
        owner = _owner;
        title = _title;
        goalWei = _goalWei;
        deadlineTs = _deadlineTs;
        metaDataURI = _metaDataURI;
    }
    function contribute() external payable {
        require(block.timestamp < deadlineTs, "Campaign has ended");
        require(msg.value > 0, "Contribution must be greater than 0");
        if (contributions[msg.sender] == 0) {
            contributorCount++;
        }
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
        emit Contributed(msg.sender, msg.value);
    }
    function goalMet() public view returns (bool) {
        return totalRaised >= goalWei;
    }
    function isEnded() public view returns (bool) {
        return block.timestamp >= deadlineTs;
    }
    function refund() external nonReentrant {
        require(isEnded(), "Campaign is still ongoing");
        require(!goalMet(), "Campaign goal was met");
        uint256 bal = contributions[msg.sender];
        require(bal > 0, "No contributions to refund");
        contributions[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: bal}("");
        require(success, "Refund transfer failed");
        emit Refunded(msg.sender, bal);
    } 
    function createRequest(string memory _description, uint256 _amount, address payable _recipient) external onlyOwner() {
        require(_amount > 0, "Request amount must be greater than 0");
        requests.push();
        uint256 id = requests.length - 1;
        Request storage r = requests[id];
        r.description = _description;
        r.amount = _amount;
        r.recipient = _recipient;
        emit RequestCreated(id, _description, _amount, _recipient);
    }
    function approveRequest(uint256 _id) external {
        require(_id < requests.length, "Invalid request ID");
        Request storage r = requests[_id];
        require(contributions[msg.sender] > 0, "Only contributors can approve");
        require(!r.approvals[msg.sender], "You have already approved this request");
        require(!r.complete, "Request has already been finalized");
        r.approvals[msg.sender] = true;
        uint256 weight = contributions[msg.sender];
        unchecked {
            r.approvalCount += weight;
        }
        emit Approved(_id, msg.sender, weight);
    }
    function finalizeRequest(uint256 _id) external nonReentrant {
        require(_id < requests.length, "Invalid request ID");
        require(isEnded() && goalMet(), "Campaign must be successful and ended to finalize requests");
        Request storage r = requests[_id];
        require(!r.complete, "Request has already been finalized");
        require(r.amount <= address(this).balance, "Not enough balance to finalize this request");
        require(r.approvalCount > (totalRaised / 2), "Not enough approvals to finalize this request");
        r.complete = true;
        (bool success, ) = r.recipient.call{value: r.amount}("");
        require(success, "Transfer to recipient failed");
        emit Finalized(_id);
    }
    function getSummary() external view returns (address _owner, string memory _title, uint256 _goalWei, uint64 _deadlineTs, string memory _metaDataURI, uint256 _totalRaised, uint256 _contributorCount, uint256 _requestCount) {
        return (owner, title, goalWei, deadlineTs, metaDataURI, totalRaised, contributorCount, requests.length);
    }
    function getRequest(uint256 _id) external view returns (string memory description, uint256 amount, address recipient, uint256 approvalCount, bool complete) {
        require(_id < requests.length, "Invalid request ID");
        Request storage r = requests[_id];
        return (r.description, r.amount, r.recipient, r.approvalCount, r.complete);
    }
}

