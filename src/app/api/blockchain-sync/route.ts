import prisma from '../../../utils/prismaClient';
import { BadRequest } from '../utils/responses';
import {
  getChainNamesWithUnconfirmedNfts,
  getNftsByChainAndContract,
  getNftsForSync,
  getUnconfirmedNftsAndConfirmedTokenIds,
} from './helpers';

const contracts = [
  '0x991fc265f163fc33328fbd2b7c8aa9b77840ed42'.toLowerCase(), 
  '0x11b965675aaafb77ab738bc797663677278d16b2'.toLowerCase(), 
  '0x809E8c06e6110CD6a055a7d2044EF7e0B29Ce2e3'.toLowerCase(), 
  '0x7a9ed9A5EF8dF626Bf934AaCe84c66267b37842c'.toLowerCase(),
  '0x569aA521b05752D22de8B3DBb91D92f65baa7E6f'.toLowerCase()
]

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
    contracts,
    chainNamesWithUnconfirmedNfts
  );
  const nftsForSync = getNftsForSync(
    unconfirmedNfts,
    nftsFromBlockchain,
    confirmedNftTokenIdsByChainName
  );

  return Response.json(nftsForSync);
}
