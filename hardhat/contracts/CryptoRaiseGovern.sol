// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract CryptoRaiseGovern is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {
    constructor(ERC20Votes _token)
        Governor("CryptoRaiseGovern")
        GovernorSettings(2 /* 1 block */, 20 , 1)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
    {}

      // The following functions are overrides required by Solidity.

      function votingDelay()
          public
          view
          override(IGovernor, GovernorSettings)
          returns (uint256)
      {
          return super.votingDelay();
      }

      function votingPeriod()
          public
          view
          override(IGovernor, GovernorSettings)
          returns (uint256)
      {
          return super.votingPeriod();
      }

      function quorum(uint256 blockNumber)
          public
          view
          override(IGovernor, GovernorVotesQuorumFraction)
          returns (uint256)
      {
          return super.quorum(blockNumber);
      }

      function proposalThreshold()
          public
          view
          override(Governor, GovernorSettings)
          returns (uint256)
      {
          return super.proposalThreshold();
      }
}
