import prisma from '../../../utils/prismaClient';
import { BadRequest } from '../utils/responses';
import {
  getChainNamesWithUnconfirmedNfts,
  getNftsByChainAndContract,
  getNftsForSync,
  getUnconfirmedNftsAndConfirmedTokenIds,
} from './helpers';

/**
 * list of contracts for which the NFT is being searched in the blockchain
 * You should be add contract here if you change some contract in LZ_CONTRACT_ADDRESS and HYPERLANE_CONTRACT_ADDRESS
 */
const ALL_CONTRACTS_FOR_SYNC = [
  '0x991fc265f163fc33328fbd2b7c8aa9b77840ed42',
  '0x11b965675aaafb77ab738bc797663677278d16b2',
  '0x809E8c06e6110CD6a055a7d2044EF7e0B29Ce2e3',
  '0x7a9ed9A5EF8dF626Bf934AaCe84c66267b37842c',
  '0x569aA521b05752D22de8B3DBb91D92f65baa7E6f',
].map((contract) => contract.toLowerCase());

/**
 * backend and blockchain synchronize action
 */
export async function POST(request: Request) {
  const metamaskWalletAddress = request.headers.get('X-Metamask-Address');

  if (!metamaskWalletAddress) {
    return new BadRequest('Metamask account not provided');
  }

  const user = await prisma.user.findFirst({
    where: { metamaskWalletAddress },
  });

  if (!user) {
    return new BadRequest('User not found');
  }

  const nfts = await prisma.nft.findMany({
    where: {
      userId: user.id,
    },
    include: { chain: true },
  });

  const { unconfirmedNfts, confirmedNftTokenIdsByChainName } =
    getUnconfirmedNftsAndConfirmedTokenIds(nfts);

  if (!unconfirmedNfts.length) {
    return Response.json({
      forDelete: [],
      forUpdate: [],
    });
  }
  
  const chainNamesWithUnconfirmedNfts = getChainNamesWithUnconfirmedNfts(unconfirmedNfts);
  const nftsFromBlockchain = await getNftsByChainAndContract(
    metamaskWalletAddress,
    ALL_CONTRACTS_FOR_SYNC,
    chainNamesWithUnconfirmedNfts
  );
  
  const nftsForSync = getNftsForSync(
    unconfirmedNfts,
    nftsFromBlockchain,
    confirmedNftTokenIdsByChainName
  );

  return Response.json(nftsForSync);
}
