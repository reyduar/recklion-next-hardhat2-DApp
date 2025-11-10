// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// Persona 1 (Owner): 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// Persona 2 (Receptor): 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
// Persona 3 (Operador): 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
contract ReyRewardToken {
    // Declaraciones
    string public name = "Rey Token";
    string public symbol = "REY";
    uint256 public totalSupply = 1000000000000000000000000; // 1 millon de tokens
    uint8 public decimals = 18;

    // Evento para la transferencia de tokens de un usuario
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // Evento para la aprobacion de un operador
    event Approval(
        address indexed _owner,
        address indexed _spender, // son los operarios a quien se le asigna un token
        uint256 _value
    );

    // Estructuras de datos
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance; // saber la cantidad de token que maneja ese spender

    // Constructor
    constructor() {
        balanceOf[msg.sender] = totalSupply; // la asignacion inicial del total de token al owner creador del smart contract
    }

    // Transferencia de tokens de un usuario
    function transfer(
        address _to,
        uint256 _value
    ) public payable returns (bool success) {
        require(balanceOf[msg.sender] >= _value); // verificar si tiene la cantidad a enviar
        balanceOf[msg.sender] -= _value; // decrementa la cantidad del owner
        balanceOf[_to] += _value; // aumenta la cantidad del que se le envia
        emit Transfer(msg.sender, _to, _value); // ejecutamos la tranferencia
        return true; // retornamos la confirmacion que se envio
    }

    // Aprobacion de una cantidad para ser gastada por un operador
    // Esta funcion se implenta la cantidad de tokens que pueden gastar un operador de nuestros tokens
    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value; // actualizamos el balance del operador
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Transferencia de tokens especificando el emisor
    // Esta funcion no permite enviarno token desde otra persona,
    // Owner (20 tokens) -> Operador (5 Tokens) = 15 Tokens
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value; // decrementamos el balance desde el emisor
        balanceOf[_to] += _value; // aumentamos nuestro balance
        allowance[_from][msg.sender] -= _value; // decrementamos los token que manejaba el operador de nuestros tokens
        emit Transfer(_from, _to, _value); // ejecutamos la transferencia
        return true;
    }
}
