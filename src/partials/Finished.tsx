import { useActiveAccount } from 'thirdweb/react';
import { ProposalsList } from '../components/ProposalsList';
import { useDeVoteContract } from '../hooks/useDeVoteContract';

export default function Finished() {
  const account = useActiveAccount();
  const {
    finishedProposals,
    isLoading,
    vote,
    claimReward,
    isVotingPending,
    isClaimingPending,
    hasFarmNft,
    hasOgNft
  } = useDeVoteContract();

  const handleVote = async (proposalId: bigint, voteType: 0 | 1 | 2) => {
    if (!account) return alert('Please connect your wallet.');
    await vote(proposalId, voteType);
  };

  const handleClaimReward = async (proposalId: bigint) => {
    if (!account) return alert('Please connect your wallet.');
    await claimReward(proposalId);
  };

  return (
    <div className="lg:col-span-8 mt-10 lg:mt-0">
      <ProposalsList
        title="Finished Proposals"
        proposals={finishedProposals}
        isLoading={isLoading}
        isVotingPending={isVotingPending}
        isClaimingPending={isClaimingPending}
        handleVote={handleVote}
        handleClaimReward={handleClaimReward}
        tokenSymbol="HASH"
        account={account}
        hasFarmNft={hasFarmNft}
        hasOgNft={hasOgNft}
        emptyMessage="No finished proposals found."
      />
    </div>
  );
}