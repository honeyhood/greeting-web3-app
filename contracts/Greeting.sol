// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Greeting {
    uint256 totalPosts;
    uint256 private seed;

    event NewPost(address indexed from, uint256 timestamp, string message);

    struct Post {
        address posted;
        string message;
        uint256 timestamp;
    }

    Post[] posts;

    mapping(address => uint256) public lastPostedAt;

    constructor() payable {
        console.log("We have been constructed!");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function post(string memory _message) public {
        require(
            lastPostedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        lastPostedAt[msg.sender] = block.timestamp;

        totalPosts += 1;
        console.log("%s has waved!", msg.sender);

        posts.push(Post(msg.sender, _message, block.timestamp));

        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than they contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewPost(msg.sender, block.timestamp, _message);
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getTotalPosts() public view returns (uint256) {
        return totalPosts;
    }
}
