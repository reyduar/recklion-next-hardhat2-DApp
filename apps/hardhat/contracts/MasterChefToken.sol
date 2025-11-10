// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./ReyRewardToken.sol"; // Token principal
import "./DamcStakedToken.sol"; // Token de recompensa

/* Address para el deploy */
// damcToken address: 0x4815A8Ba613a3eB21A920739dE4cA7C439c7e1b1
// reyToken address: 0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8

contract MasterChefToken {
    // Declaraciones iniciales
    string public name = "Master Chef Token";
    address public owner;
    ReyRewardToken public reyToken;
    DamcStakedToken public damcToken;

    // Estructuras de datos
    address[] public stakers; // para almacenar todas la persona que hacen staking
    mapping(address => uint) public stakingBalance; // balance de la persona que hace staking
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking; //saber si esta haciendo stking

    // Constructor
    constructor(DamcStakedToken _damcToken, ReyRewardToken _reyToken) {
        damcToken = _damcToken;
        reyToken = _reyToken;
        owner = msg.sender;
    }

    // Stake de tokens
    function stakeTokens(uint _amount) public {
        // Se require una cantidad superior a 0
        require(_amount > 0, "La cantidad no puede ser menor a 0");
        // Transferir tokens JAM al Smart Contract principal
        damcToken.transferFrom(msg.sender, address(this), _amount);
        // Actualizar el saldo del staking
        stakingBalance[msg.sender] += _amount;
        // Guardar el staker
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        // Actualizar el estado del staking
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Quitar el staking de los tokens
    function unstakeTokens() public {
        // Saldo del staking de un usuario
        uint balance = stakingBalance[msg.sender];
        // Se require una cantidad superior a 0
        require(balance > 0, "El balance del staking es 0");
        // Transferencia de los tokens al usuario
        damcToken.transfer(msg.sender, balance);
        // Resetea el balance de staking del usuario
        stakingBalance[msg.sender] = 0;
        // Actualizar el estado del staking
        isStaking[msg.sender] = false;
    }

    // Emision de Tokens (recompensas)
    function issueTokens() public {
        // Unicamente ejecutable por el owner
        require(msg.sender == owner, "No eres el owner");
        // Emitir tokens a todos los stakers
        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0) {
                reyToken.transfer(recipient, balance);
            }
        }
    }
}
