import { getContract } from 'thirdweb';
import { chain } from '../lib/thirdweb/chain';
import { client } from '../lib/thirdweb/client';

// ABIs
import erc20Abi from './erc20';
import { devoteAbi } from './devoteAbi';
import { minErc721Abi } from './minErc721Abi';
import { rewardAbi } from './rewardAbi';
import { communityRegistryAbi } from './communityRegistryAbi';


// --- CORE TOKENS ---

export const hashcoinContract = getContract({
  client,
  chain: chain,
  address: '0xA9B631ABcc4fd0bc766d7C0C8fCbf866e2bB0445',
  abi: erc20Abi,
});

// --- STAKING & TOOLS ---

export const devoteContract = getContract({
  client,
  chain: chain,
  address: '0xeC655d008c76Eb606D7c79e8a3405c7EB247b653',
  abi: devoteAbi,
});

// OG NFT Contract
export const ogNftContract = getContract({
  client,
  chain: chain,
  address: '0xB494698522Ad959cAA50A0e82107771711fd5A49',
  abi: minErc721Abi,
});

// FARM NFT Contract
export const farmNftContract = getContract({
  client,
  chain: chain,
  address: '0xFB284cA86D797DA6f9176E51cb7836C2794111e5',
  abi: minErc721Abi,
});

// EARLY NFT Contract
export const earlyBirdContract = getContract({
  client,
  chain: chain,
  address: '0xe6dc0fe06c141329050a1b2f3e9c4a7f944450b0',
  abi: minErc721Abi,
});

// GALXE VOTE NFT Contract
export const galxeVoteNftContract = getContract({
  client,
  chain: chain,
  address: '0x52ab3d4ed15f71b8ec153222daa9e13353e36bb3',
  abi: minErc721Abi,
});

// MultiNFTReward Contract
export const multiNFTRewardContract = getContract({
  client,
  chain: chain,
  address: '0x14FA3fa097FcfF7439c7378D8deaa40C8d1E6b15',
  abi: rewardAbi,
});

// Community Registry (Avatar) Contract
export const communityRegistryContract = getContract({
  client,
  chain: chain,
  address: '0xb517B91D950ba0649bab120Cc9e2b235d78acD8C',
  abi: communityRegistryAbi,
});

export const nameContract = getContract({
  client,
  chain,
  address: "0xA8e00E2ca8b183Edb7EbB6bD7EeBB90047416F95",
});