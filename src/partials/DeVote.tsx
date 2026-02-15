import { useActiveAccount } from 'thirdweb/react';
import { useDeVoteContract } from '../hooks/useDeVoteContract';
import { CreateProposalForm } from '../components/CreateProposalForm';

// --- Constants ---
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
    hasOgNft, // New: Destructure hasOgNft
    hasFarmNft, // New: Destructure hasFarmNft
  } = useDeVoteContract();

  // --- Handlers ---
  const handleCreateProposal = async (title: string, description: string, rewardAmount: string) => {
    if (!account) return alert('Please connect your wallet.');
    // No need to check hasOgNft here, as button will be disabled
    if (!title || !description || !rewardAmount) return alert('Please fill all fields.');

    const reward = Number(rewardAmount);
    if (isNaN(reward) || reward <= 0) return alert('Reward must be a positive number.');

    try {
      await createProposal(title, description, rewardAmount);
      setStatus('idle');
    } catch (error) {
      console.error("Proposal creation failed:", error);
    }
  };

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-start">
        
        {/* Left Column: Info & Branding */}
        <aside className="lg:col-span-4 space-y-8 relative">
          {/* Network Badge */}
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
              
              {/* New: NFT Status Display */}
              <div className="flex flex-col space-y-2">
                <p className={`text-sm ${hasOgNft ? 'text-green-500' : 'text-red-500'}`}>
                  OG NFT Status: {hasOgNft ? 'Holder' : 'Not a Holder'}
                </p>
                <p className={`text-sm ${hasFarmNft ? 'text-green-500' : 'text-red-500'}`}>
                  FARM NFT Status: {hasFarmNft ? 'Holder' : 'Not a Holder'}
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

            {/* Actions / Links */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <a href={GALXE_LINK} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white font-bold transition">
                Galxe
              </a>
              <DisabledButton label="Badge" />
              <DisabledButton label="Reward" />
            </div>
          </div>
        </aside>

        {/* Right Column: Form */}
        <main className="lg:col-span-8 mt-10 lg:mt-0">
          <CreateProposalForm
            hashBalance={hashBalance}
            isCreatingProposalPending={isCreatingProposalPending}
            createProposal={handleCreateProposal}
            status={status}
            setStatus={setStatus}
            hasOgNft={hasOgNft} // New: Pass hasOgNft to CreateProposalForm
          />
        </main>
        
      </div>
    </div>
  );
}

// --- Sub-components (for cleaner JSX) ---
function CheckIcon() {
  return (
    <span className="mt-0.5 size-6 flex justify-center items-center rounded-lg border border-gray-700 text-white">
      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
      </svg>
    </span>
  );
}

function DisabledButton({ label }: { label: string }) {
  return (
    <button
      disabled
      className="px-4 py-2 rounded-lg border border-gray-500 text-gray-500 opacity-50 cursor-not-allowed text-sm font-medium"
    >
      {label}
    </button>
  );
}