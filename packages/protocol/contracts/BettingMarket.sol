// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BettingMarket is Ownable {
    string public marketTitle;
    uint256 public totalOptions;
    
    struct Option {
        uint256 totalShares;
        uint256 yesShares;
        uint256 noShares;
    }

    mapping(uint256 => Option) public options;

    mapping(address => mapping(uint256 => Option)) public userOptions;

    IERC20 public paymentToken; // ERC-20 token used for payments

    event MarketCreated(string _marketTitle, uint256 _totalOptions);
    event SharesPurchased(uint256 indexed _optionId, address indexed _buyer, uint256 _amount);
    event SharesSold(uint256 indexed _optionId, address indexed _seller, uint256 _amount);

    constructor(
        string memory _title,
        uint256 _numOptions,
        address _paymentTokenAddress // Address of the ERC-20 token
    ) {
        marketTitle = _title;
        totalOptions = _numOptions;
        paymentToken = IERC20(_paymentTokenAddress); // Initialize the ERC-20 token contract
        emit MarketCreated(_title, _numOptions);
    }

    modifier validOption(uint256 _optionId) {
        require(_optionId < totalOptions, "Invalid option ID");
        _;
    }

    function purchaseShares(uint256 _optionId, uint256 _amount, uint256 _outcome) external validOption(_optionId) {
        Option storage option = options[_optionId];
        Option storage userOption = userOptions[msg.sender][_optionId];
        require(_amount > 0, "Invalid share amount");

        // Transfer USDC tokens from the sender to the contract
        paymentToken.transferFrom(msg.sender, address(this), _amount);

        if (_outcome == 1) {
            option.yesShares += _amount;
            userOption.yesShares += _amount;
        } else if (_outcome == 0) {
            option.noShares += _amount;
            userOption.noShares += _amount;
        } else {
            revert("Invalid outcome");
        }
        option.totalShares += _amount;
        userOption.totalShares += _amount;

        emit SharesPurchased(_optionId, msg.sender, _amount);
    }

    function sellShares(uint256 _optionId, uint256 _amount, uint256 _outcome) external validOption(_optionId) {
        Option storage option = options[_optionId];
        Option storage userOption = userOptions[msg.sender][_optionId];
        require(_amount > 0, "Invalid share amount");
        require(_amount <= option.totalShares, "Insufficient shares");

        if (_outcome == 1) {
            require(_amount <= userOption.yesShares, "Insufficient shares");
            option.yesShares -= _amount;
            userOption.yesShares -= _amount;
        } else if (_outcome == 0) {
            require(_amount <= userOption.noShares, "Insufficient shares");
            option.noShares -= _amount;
            userOption.noShares -= _amount;
        } else {
            revert("Invalid outcome");
        }
        option.totalShares -= _amount;
        userOption.totalShares -= _amount;

        // Transfer USDC tokens from the contract to the sender
        paymentToken.transfer(msg.sender, _amount);

        emit SharesSold(_optionId, msg.sender, _amount);
    }

    function setPaymentToken(address _paymentTokenAddress) external onlyOwner {
        paymentToken = IERC20(_paymentTokenAddress);
    }

    function getOptionDetails(uint256 _optionId) external view validOption(_optionId) returns (uint256, uint256, uint256) {
        Option storage option = options[_optionId];
        return (option.totalShares, option.yesShares, option.noShares);
    }
}