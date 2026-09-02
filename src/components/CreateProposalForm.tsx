import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { Spinner } from './Spinner';
import { VoterType } from '../hooks/useDeVoteContract';

interface CreateProposalFormProps {
  hashBalance: bigint | undefined;
  isCreatingProposalPending: boolean;
  createProposal: (title: string, description: string, rewardAmount: string, vType: VoterType) => Promise<void>;
  status: 'idle' | 'pending' | 'success' | 'error';
  setStatus: (status: 'idle' | 'pending' | 'success' | 'error') => void;
  hasOgNft: boolean;
}

export function CreateProposalForm({
  hashBalance,
  isCreatingProposalPending,
  createProposal,
  hasOgNft,
}: CreateProposalFormProps) {
  const account = useActiveAccount();
  const [newProposalTitle, setNewProposalTitle] = useState('');
  const [newProposalDescription, setNewProposalDescription] = useState('');
  const [newProposalReward, setNewProposalReward] = useState('');
  const [voterType, setVoterType] = useState<VoterType>(VoterType.FARM);
  const [showTitleError, setShowTitleError] = useState(false);
  const [showDescriptionError, setShowDescriptionError] = useState(false);

  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 1000;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewProposalTitle(value);
    setShowTitleError(value.length > TITLE_MAX_LENGTH);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewProposalDescription(value);
    setShowDescriptionError(value.length > DESCRIPTION_MAX_LENGTH);
  };

  const handleCreateProposal = async () => {
    if (!account) return alert('Please connect your wallet.');
    if (!hasOgNft) return alert('You must hold an OG NFT to create proposals.');
    if (showTitleError || showDescriptionError || !newProposalTitle || !newProposalDescription || !newProposalReward) {
      alert('Please fill all fields correctly.');
      return;
    }

    try {
      await createProposal(newProposalTitle, newProposalDescription, newProposalReward, voterType);
      setNewProposalTitle('');
      setNewProposalDescription('');
      setNewProposalReward('');
      setShowTitleError(false);
      setShowDescriptionError(false);
    } catch (error) {
      console.error("Proposal creation failed in form handler:", error);
    }
  };

  const isButtonDisabled = isCreatingProposalPending || !account || !hasOgNft || !newProposalReward || Number(newProposalReward) <= 0 || showTitleError || showDescriptionError || newProposalTitle.length === 0 || newProposalDescription.length === 0;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-4">Create New Proposal</h2>
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 space-y-4">
        
        {/* Voter Type Selection */}
        <div className="flex p-1 bg-neutral-900 rounded-lg border border-neutral-700">
          <button
            onClick={() => setVoterType(VoterType.FARM)}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${voterType === VoterType.FARM ? 'bg-[#a5c2ff] text-black shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            FARM VOTERS
          </button>
          <button
            onClick={() => setVoterType(VoterType.OG)}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${voterType === VoterType.OG ? 'bg-[#a5c2ff] text-black shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            OG VOTERS
          </button>
        </div>

        <div>
          <input
            type="text"
            className={`w-full p-3 rounded-md bg-neutral-700 text-white border ${showTitleError ? 'border-red-500' : 'border-neutral-600'} focus:ring-[#a5c2ff] focus:border-[#a5c2ff] outline-none`}
            placeholder="Proposal Title"
            value={newProposalTitle}
            onChange={handleTitleChange}
          />
          <div className="text-xs mt-1 text-right">
            <span className={`${showTitleError ? 'text-red-500' : 'text-neutral-400'}`}>
              {newProposalTitle.length}/{TITLE_MAX_LENGTH}
            </span>
          </div>
        </div>

        <div>
          <textarea
            className={`w-full p-3 rounded-md bg-neutral-700 text-white border ${showDescriptionError ? 'border-red-500' : 'border-neutral-600'} focus:ring-[#a5c2ff] focus:border-[#a5c2ff] outline-none`}
            placeholder="Proposal Description (max 1000 characters)"
            rows={5}
            value={newProposalDescription}
            onChange={handleDescriptionChange}
          ></textarea>
          <div className="text-xs mt-1 text-right">
            <span className={`${showDescriptionError ? 'text-red-500' : 'text-neutral-400'}`}>
              {newProposalDescription.length}/{DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
        </div>

        <div className="relative">
          <input
            type="number"
            className="w-full p-3 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:ring-[#a5c2ff] focus:border-[#a5c2ff] no-spin-buttons outline-none"
            placeholder={`Reward Amount`}
            value={newProposalReward}
            onChange={(e) => setNewProposalReward(e.target.value)}
            min="0"
          />
          <div className="absolute right-3 top-3 text-neutral-500 text-sm font-bold">HASH</div>
          <p className="text-[10px] mt-1 text-neutral-500 ml-1">
            Balance: {hashBalance !== undefined ? (Number(hashBalance) / 10**18).toFixed(2) : '0.00'} HASH
          </p>
        </div>

        <button
          onClick={handleCreateProposal}
          disabled={isButtonDisabled}
          className="w-full py-4 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-lg border border-transparent bg-[#a5c2ff] text-black hover:bg-[#8eafef] disabled:opacity-30 transition-all shadow-lg shadow-blue-500/20 mt-2"
        >
          {isCreatingProposalPending ? <Spinner className="w-4 h-4 mr-2" /> : null}
          {isCreatingProposalPending ? 'Creating...' : 'Create Proposal'}
        </button>
        
        {!hasOgNft && account && (
          <p className="text-red-500 text-[11px] text-center font-bold bg-red-500/10 py-2 rounded-lg border border-red-500/20">
            ⚠️ ONLY OG NFT HOLDERS CAN CREATE PROPOSALS
          </p>
        )}
      </div>
    </div>
  );
}