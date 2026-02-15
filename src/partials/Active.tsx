import { useActiveAccount } from 'thirdweb/react';
import { ActiveProposalsList } from '../components/ActiveProposalsList';
import { useDeVoteContract } from '../hooks/useDeVoteContract';
import { Spinner } from '../components/Spinner';

export default function Active() {
  const account = useActiveAccount();
  const {
    activeProposals,
    isLoading,
    vote,
    claimReward,
    isVotingPending,
    isClaimingPending,
    hasFarmNft, // New: Destructure hasFarmNft
  } = useDeVoteContract();

  const handleVote = async (proposalId: bigint, voteType: 0 | 1 | 2) => {
    if (!account) {
      alert('Please connect your wallet.');
      return;
    }
    // No explicit FARM_NFT check here yet, will be handled by UI disabled state
    await vote(proposalId, voteType);
  };

  const handleClaimReward = async (proposalId: bigint) => {
    if (!account) {
      alert('Please connect your wallet.');
      return;
    }
    await claimReward(proposalId);
  };

  return (
    <div className="lg:col-span-8 mt-10 lg:mt-0">
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner className="w-8 h-8 text-blue-500" />
        </div>
      ) : (
        <ActiveProposalsList
          activeProposals={activeProposals}
          isLoading={isLoading}
          isVotingPending={isVotingPending}
          isClaimingPending={isClaimingPending}
          handleVote={handleVote}
          handleClaimReward={handleClaimReward}
          tokenSymbol="HASH"
          account={account} // Correctly pass account
          hasFarmNft={hasFarmNft} // New: Pass hasFarmNft
        />
      )}
    </div>
  );
}