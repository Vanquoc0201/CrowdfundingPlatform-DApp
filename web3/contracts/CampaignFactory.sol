// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Campaign.sol"; 

contract CampaignFactory {
    event CampaignCreated(address indexed owner, address campaign, string title, uint256 goal, uint256 deadline, string metaDataURI);

    address[] public campaigns;
    function createCampaign(
        string memory _title,
        uint256 _goalWei,
        uint64 _deadlineTs,
        string memory _metaDataURI,
        uint256 _minimumContribution 
    ) external returns (address addr) {
        require(_goalWei > 0, "Goal must be greater than 0");
        require(_deadlineTs > block.timestamp, "Deadline must be in the future");
        Campaign c = new Campaign(msg.sender, _title, _goalWei, _deadlineTs, _metaDataURI, _minimumContribution);
        addr = address(c);
        campaigns.push(addr);
        emit CampaignCreated(msg.sender, addr, _title, _goalWei, _deadlineTs, _metaDataURI);
    }

    function getCampaigns() external view returns (address[] memory) {
        return campaigns;
    }
}