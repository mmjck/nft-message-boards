// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    event newWave(address indexed from, uint256 timestamp, string message);
    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }


    Wave[] waves;


    function wave(string memory _message) public payable {
        totalWaves += 1;
        console.log("%s deu tchauzinho!", msg.sender);
        
        waves.push(Wave(msg.sender, _message, block.timestamp));
        
        emit newWave(msg.sender, block.timestamp, _message);

        uint256 prizeAmount = 0.0001 ether;
        require(prizeAmount <= address(this).balance,
                "Tentando sacar mais dinheiro que o contrato possui.");

        (bool success, ) = (msg.sender).call{value: prizeAmount }("");
        require(success, "Falhou em sacar dinheiro do contrato.");
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("Temos um total de %d tchauzinhos!", totalWaves);
        return totalWaves;
    }

    function getAllWaves()public view returns(Wave[] memory){
        return waves;
    }


    constructor() payable {
        console.log("Hello, World!!!");
    }
}
