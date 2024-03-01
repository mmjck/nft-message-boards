// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event newWave(address indexed from, uint256 timestamp, string message);
    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }


    Wave[] waves;
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("Hello, World!!!");
        seed = (block.timestamp + block.difficulty) % 100;
    }


    function wave(string memory _message) public payable {
       require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, 
       "Deve aguardar 30 segundos antes de mandar um tchauzinho novamente.");

        lastWavedAt[msg.sender] = block.timestamp;


        totalWaves += 1;
        console.log("%s deu tchauzinho!", msg.sender);
        
        waves.push(Wave(msg.sender, _message, block.timestamp));
        
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("# randomico gerado: %d", seed);

        if(seed <= 30){
            console.log("%s ganhou!", msg.sender);
        
            uint256 prizeAmount = 0.0001 ether;
            require(prizeAmount <= address(this).balance,
                    "Tentando sacar mais dinheiro que o contrato possui.");

            (bool success, ) = (msg.sender).call{value: prizeAmount }("");
            require(success, "Falhou em sacar dinheiro do contrato.");

        }
        emit newWave(msg.sender, block.timestamp, _message);

    }

    function getTotalWaves() public view returns (uint256) {
        console.log("Temos um total de %d tchauzinhos!", totalWaves);
        return totalWaves;
    }

    function getAllWaves()public view returns(Wave[] memory){
        return waves;
    }


   
}
