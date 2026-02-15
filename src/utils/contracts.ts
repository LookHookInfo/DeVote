import { getContract } from 'thirdweb';
import { chain } from '../lib/thirdweb/chain';
import { client } from '../lib/thirdweb/client';

// ABIs
import erc20Abi from './erc20';
import { devoteAbi } from './devoteAbi';
import { minErc721Abi } from './minErc721Abi'; // New import


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
  address: '0x2Fd9c9C04b1BE92Fa166bd06B9F680683C5032cf',   // контракт 30 мин   14 вечер 0x38bb05CbBcB5249091aFc187E3EDa44B196b74d1
  abi: devoteAbi,
});

// New: OG NFT Contract
export const ogNftContract = getContract({
  client,
  chain: chain,
  address: '0xD5D2bEf311431F1b464E6637C4F2056EFEe1f82c',
  abi: minErc721Abi,
});

// New: FARM NFT Contract
export const farmNftContract = getContract({
  client,
  chain: chain,
  address: '0xFB284cA86D797DA6f9176E51cb7836C2794111e5',
  abi: minErc721Abi,
});

export const nameContract = getContract({
  client,
  chain,
  address: "0xA8e00E2ca8b183Edb7EbB6bD7EeBB90047416F95",
});