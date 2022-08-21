pragma solidity ^0.4.25;

contract TrackingFactory {
    address[] public deployedTrackings;


    function createTracking(string item,
        string fromWhom, string postalAddressRecipient, address ethAddressRecipient,
        string observations) public {

        address newTracking = new Tracking(item,
            fromWhom, postalAddressRecipient, ethAddressRecipient,
            observations, block.timestamp, msg.sender);

        deployedTrackings.push(newTracking);

    }


    function getDeployedTrackings() public view returns(address[]) {
        return deployedTrackings;
    }

}


contract Tracking {
    struct Milestone {
        string name;
        string location;
        address subjectAddress;
        bool complete;
        string observations;
        uint256 when;
    }

    Milestone[] public milestones;

    address public manager;
    string public item;
    string public fromWhom;
    string public postalAddressRecipient;
    address public ethAddressRecipient;
    string public observations;
    uint256 public when;
    bool public complete;

    function Tracking(string anItem,
        string _fromWhom, string _postalAddressRecipient, address _ethAddressRecipient,
        string _observations, uint256 _when, address creator) public {
        manager = creator;
        item = anItem;
        fromWhom = _fromWhom;
        postalAddressRecipient = _postalAddressRecipient;
        postalAddressRecipient = _postalAddressRecipient;
        ethAddressRecipient = _ethAddressRecipient;
        observations = _observations;
        when = _when;
        complete = false;
    }

   // modifier restricted() {
   //     require(msg.sender == manager);
   //     _;
   // }

    modifier trackingNotCompleted() {
        require(complete == false);
        _;
    }


    function createMilestone (string name, string location, address subjectAddress, string theObservations) public trackingNotCompleted {
        Milestone memory newMilestone = Milestone({
            name: name,
            location: location,
            subjectAddress: subjectAddress,
            complete: false,
            observations: theObservations,
            when: block.timestamp
        });

        milestones.push(newMilestone);


        if (ethAddressRecipient == subjectAddress) {
            complete = true;
        }
    }


    function getSummary() public view 
    returns (address, string, string, string, address, string, uint256, bool) {
        return (
          manager,
          item,
          fromWhom,
          postalAddressRecipient,
          ethAddressRecipient,
          observations,
          when,
          complete
        );
    }

    function getMilestoneLength() public view returns(uint) {
        return milestones.length;
    }

}