// SPDX-License-Identifier: Unlicensed

pragma solidity >0.7.0 <=0.9.0;

contract NoteFactory {
    address[] public deployedNotes;

    event NoteCreated(
        string title,
        address NoteAddress,
        address indexed owner,
        string imgURI,
        uint indexed timestamp,
        string storyURI,
        string indexed category
    );

    function createNote(
        string memory NoteTitle, 
        string memory imgURI, 
        string memory category,
        string memory storyURI) public
    {

        Note newNote = new Note(
            NoteTitle, imgURI, storyURI, msg.sender);
        

        deployedNotes.push(address(newNote));

        emit NoteCreated(
            NoteTitle, 
            address(newNote),
            msg.sender, 
            imgURI,
            block.timestamp,
            storyURI,
            category
        );

    }
}


contract Note {
    string public title;
    string public image;
    string public story;
    address public owner;

    constructor(
        string memory NoteTitle, 
        string memory imgURI,
        string memory storyURI,
        address NoteOwner
    ) {
        title = NoteTitle;
        image = imgURI;
        story = storyURI;
        owner = NoteOwner;
    }
}

