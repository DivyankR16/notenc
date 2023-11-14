// SPDX-License-Identifier: Unlicensed

pragma solidity >0.7.0 <=0.9.0;

contract NoteFactory {
    address[] public deployedNotes;

    event NoteCreated(
        string title,
        uint requiredAmount,
        address indexed owner,
        address NoteAddress,
        string imgURI,
        uint indexed timestamp,
        string indexed category
    );

    function createNote(
        string memory NoteTitle, 
        uint requiredCampaignAmount, 
        string memory imgURI, 
        string memory category,
        string memory storyURI) public
    {

        Note newNote = new Note(
            NoteTitle, requiredCampaignAmount, imgURI, storyURI, msg.sender);
        

        deployedNotes.push(address(newNote));

        emit NoteCreated(
            NoteTitle, 
            requiredCampaignAmount, 
            msg.sender, 
            address(newNote),
            imgURI,
            block.timestamp,
            category
        );

    }
}


contract Note {
    string public title;
    uint public requiredAmount;
    string public image;
    string public story;
    address payable public owner;
    uint public receivedAmount;

    event donated(address indexed donar, uint indexed amount, uint indexed timestamp);

    constructor(
        string memory NoteTitle, 
        uint requiredCampaignAmount, 
        string memory imgURI,
        string memory storyURI,
        address NoteOwner
    ) {
        title = NoteTitle;
        requiredAmount = requiredCampaignAmount;
        image = imgURI;
        story = storyURI;
        owner = payable(NoteOwner);
    }

    function donate() public payable {
        require(requiredAmount > receivedAmount, "required amount fullfilled");
        owner.transfer(msg.value);
        receivedAmount += msg.value;
        emit donated(msg.sender, msg.value, block.timestamp);
    }
}

