import { useActiveAccount } from 'thirdweb/react';
import { useDeVoteContract } from '../hooks/useDeVoteContract';
import { useRewardClaim } from '../hooks/useRewardClaim';
import { CreateProposalForm } from '../components/CreateProposalForm';
import { Spinner } from '../components/Spinner';

import FarmImg from '../assets/FARM.webp';
import EarlyImg from '../assets/Early.webp';
import GalxeImg from '../assets/Galxe.webp';

const GALXE_LINK = "https://app.galxe.com/quest/bAFdwDecXS6NRWsbYqVAgh";
const LOGO_URL = "https://bafkreihhahivg6cou6qwlbloy25vxsdqxar3donvl7l2u377tircflnoje.ipfs.dweb.link/";

const FEATURES = [
  { label: "OG NFT holders", action: "submit proposals" },
  { label: "FARM NFT holders", action: "cast their votes" },
  { label: "Earn HASH tokens", action: "for active participation", highlightFirst: true },
];

export default function DeVote() {
  const account = useActiveAccount();
  const {
    hashBalance,
    status,
    setStatus,
    createProposal,
    isCreatingProposalPending,
    hasOgNft,
    hasFarmNft: hasFarmNftGovernance,
  } = useDeVoteContract();

  const {
    hasFarmNft,
    hasEarlyBird,
    hasGalxeVote,
    canClaim,
    hasClaimed,
    rewardAmount,
    poolRewardBalance,
    isClaiming,
    handleClaim,
    isLoading: isRewardLoading,
  } = useRewardClaim();

  const handleCreateProposal = async (title: string, description: string, rewardAmount: string, vType: number) => {
    if (!account) return alert('Please connect your wallet.');
    try {
      await createProposal(title, description, rewardAmount, vType);
      setStatus('idle');
    } catch (error) {
      console.error("Proposal creation failed:", error);
    }
  };

  const getRewardTooltip = () => {
    const poolInfo = `Pool: ${poolRewardBalance} HASH`;
    
    if (hasClaimed) return `Already claimed • ${poolInfo}`;
    if (canClaim) return `Claim ${rewardAmount} HASH! • ${poolInfo}`;
    if (!account) return `Connect wallet • ${poolInfo}`;
    
    const missing = [];
    if (!hasFarmNft) missing.push("FARM");
    if (!hasEarlyBird) missing.push("Early Bird");
    if (!hasGalxeVote) missing.push("Galxe Vote");
    
    return missing.length > 0 
      ? `Missing: ${missing.join(", ")} • ${poolInfo}` 
      : `Checking... • ${poolInfo}`;
  };

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-start">
        
        <aside className="lg:col-span-4 space-y-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gray-800 to-gray-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
            Base
          </div>

          <div className="space-y-4">
            <h2 className="font-bold text-3xl lg:text-4xl text-gray-300 flex items-center">
              <img src={LOGO_URL} alt="Logo" className="rounded-xl w-16 h-16 mr-3" />
              Governance
            </h2>

            <div className="text-gray-400 space-y-4">
              <p>DeVote is a governance hub designed to empower the community.</p>
              
              <div className="flex flex-col space-y-2 border-l-2 border-gray-700 pl-4">
                <p className={`text-sm ${hasOgNft ? 'text-green-500 font-bold' : 'text-red-500'}`}>
                  • OG NFT: {hasOgNft ? 'Holder' : 'Not a Holder'}
                </p>
                <p className={`text-sm ${hasFarmNftGovernance ? 'text-green-500 font-bold' : 'text-red-500'}`}>
                  • FARM NFT: {hasFarmNftGovernance ? 'Holder' : 'Not a Holder'}
                </p>
              </div>

              <ul className="space-y-3">
                {FEATURES.map((f, i) => (
                  <li key={i} className="flex gap-x-3 items-start">
                    <CheckIcon />
                    <span className="text-sm sm:text-base">
                      <span className="font-bold text-gray-300">{f.label}</span> {f.action}
                    </span>
                  </li>
                ))}
              </ul>

              <p>It’s an ecosystem where your influence converts directly into rewards.</p>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
              <EligibilityIndicator tooltip="FARM NFT" status={hasFarmNft} icon={FarmImg} />
              <EligibilityIndicator tooltip="Early Bird NFT" status={hasEarlyBird} icon={EarlyImg} />
              <EligibilityIndicator tooltip="Galxe Vote NFT" status={hasGalxeVote} icon={GalxeImg} />
              
              <a 
                href={GALXE_LINK} 
                target="_blank" 
                rel="noreferrer" 
                className="px-4 h-12 flex items-center justify-center rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-white text-xs font-bold transition bg-gray-800/30 hover:bg-gray-800 shadow-sm"
              >
                Galxe
              </a>
            </div>

            <div className="pt-2 flex justify-center">
              <div className="relative group w-full max-w-[280px]">
                <button
                  onClick={handleClaim}
                  disabled={!canClaim || isClaiming || hasClaimed || isRewardLoading}
                  className={`w-full py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${
                    canClaim && !hasClaimed
                      ? 'border-green-500 text-green-500 hover:bg-green-500/10 cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                      : 'border-gray-700 text-gray-500 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isRewardLoading ? (
                    <div className="flex justify-center"><Spinner className="w-5 h-5" /></div>
                  ) : isClaiming ? (
                    'Claiming...'
                  ) : hasClaimed ? (
                    'Claimed'
                  ) : (
                    `Claim ${rewardAmount} HASH`
                  )}
                </button>
                
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 border border-gray-700 pointer-events-none">
                  {getRewardTooltip()}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-8 mt-10 lg:mt-0">
          <CreateProposalForm
            hashBalance={hashBalance}
            isCreatingProposalPending={isCreatingProposalPending}
            createProposal={handleCreateProposal}
            status={status}
            setStatus={setStatus}
            hasOgNft={hasOgNft} 
          />
        </main>
        
      </div>
    </div>
  );
}

function EligibilityIndicator({ tooltip, status, icon }: { tooltip: string; status: boolean; icon: string }) {
  return (
    <div className="relative group flex items-center">
      <div className="relative">
        <div className={`w-12 h-12 rounded-xl border-2 transition-all duration-200 flex items-center justify-center overflow-hidden bg-gray-800 ${status ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'border-gray-700 grayscale opacity-60'}`}>
          <img src={icon} alt={tooltip} className="w-full h-full object-cover" />
        </div>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${status ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`}></div>
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 border border-gray-700">
        {tooltip}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="mt-0.5 size-6 flex justify-center items-center rounded-lg border border-gray-700 text-white">
      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
      </svg>
    </span>
  );
}