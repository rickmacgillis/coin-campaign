pragma solidity ^0.6.6;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minContribution) public {
        Campaign newCampaign = new Campaign(minContribution, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    address public manager;
    uint public minimumContribution;
    uint public approversCount = 0;
    mapping(address => bool) public approvers;
    Request[] public requests;

    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    constructor (uint minContribution, address campaignManager) public {
        manager = campaignManager;
        minimumContribution = minContribution;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution, "Amount sent is less than the minimum contribution limit.");
        
        if (approvers[msg.sender] == false) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        require(value <= address(this).balance, "Not enough money to request that amount");

        Request memory request = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(request);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], "You are not an approver.");
        require(request.approvals[msg.sender] == false, "You have already voted on this request.");
        require(request.complete == false, "Request was already finalized.");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.complete == false, "Request was already finalized.");
        require(request.approvalCount > (approversCount / 2), "Not enough approvals.");

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }

    modifier restricted() {
        require(msg.sender == manager, "You are not the Queen of Blades.");
        _;
    }
}
