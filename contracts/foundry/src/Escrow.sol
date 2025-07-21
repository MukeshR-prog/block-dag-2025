// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Escrow {
    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE, DISPUTED }

    address public buyer;
    address public seller;
    address public arbiter;
    uint256 public amount;
    State public currentState;

    constructor(address _seller, address _arbiter) payable {
        buyer = msg.sender;
        seller = _seller;
        arbiter = _arbiter;
        amount = msg.value;
        currentState = State.AWAITING_PAYMENT;
    }

    function deposit() external payable {
        require(currentState == State.AWAITING_PAYMENT, "Already funded");
        require(msg.sender == buyer, "Only buyer can deposit");
        require(msg.value == amount, "Incorrect amount");
        currentState = State.AWAITING_DELIVERY;
    }

    function confirmDelivery() external {
        require(msg.sender == buyer, "Only buyer can confirm");
        require(currentState == State.AWAITING_DELIVERY, "Not awaiting delivery");
        currentState = State.COMPLETE;
        payable(seller).transfer(amount);
    }

    function raiseDispute() external {
        require(msg.sender == buyer || msg.sender == seller, "Only buyer or seller");
        require(currentState == State.AWAITING_DELIVERY, "Not disputable");
        currentState = State.DISPUTED;
    }

    function resolveDispute(bool releaseToSeller) external {
        require(msg.sender == arbiter, "Only arbiter");
        require(currentState == State.DISPUTED, "Not in dispute");
        currentState = State.COMPLETE;
        if (releaseToSeller) {
            payable(seller).transfer(amount);
        } else {
            payable(buyer).transfer(amount);
        }
    }
}
