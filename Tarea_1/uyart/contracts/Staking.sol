// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IUyArtNFT {
    function mint(address to, string memory tokenURI) external;
}

contract Staking {
    IERC20 public ortToken;
    IUyArtNFT public uyArtNFT;

    uint256 public deployBlock;
    uint256 public stakingDeadline = 1000;
    uint256 public totalStaked;
    uint256 public constant MAX_TOTAL_STAKED = 100000;
    uint256 public constant MIN_STAKE = 1000;

    mapping(address => uint256) public stakes;
    mapping(address => bool) public claimed;

    constructor(address _ortToken, address _uyArtNFT) {
        ortToken = IERC20(_ortToken);
        uyArtNFT = IUyArtNFT(_uyArtNFT);
        deployBlock = block.number;
    }

    // Permite hacer staking mientras no hayan pasado 1000 bloques
    function stake(uint256 amount) external {
        require(block.number <= deployBlock + stakingDeadline, "Staking period is over");
        require(amount >= MIN_STAKE, "Minimum stake is 1000 tokens");
        require(amount % MIN_STAKE == 0, "Amount must be multiple of 1000");
        require(totalStaked + amount <= MAX_TOTAL_STAKED, "Max staking limit reached");

        ortToken.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] += amount;
        totalStaked += amount;
    }

    // Una vez pasada la ventana de 1000 bloques, permite reclamar NFTs
    function claimNFTs() external {
        require(block.number > deployBlock + stakingDeadline, "Too early to claim");
        require(!claimed[msg.sender], "Already claimed");
        require(stakes[msg.sender] >= MIN_STAKE, "You have no stake");

        uint256 userStake = stakes[msg.sender];
        uint256 nftCount = userStake / MIN_STAKE;

        claimed[msg.sender] = true;

        for (uint256 i = 0; i < nftCount; i++) {
            // Mint con metadata básica o vacía, se puede mejorar con IPFS luego
            uyArtNFT.mint(msg.sender, string(abi.encodePacked("https://mi-nft.com/metadata/", uint2str(i))));
        }
    }

    // Utilidad interna para convertir números a string (usado para tokenURI)
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;

        while (j != 0) {
            length++;
            j /= 10;
        }

        bytes memory bstr = new bytes(length);
        uint256 k = length;

        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }

        str = string(bstr);
    }
}
