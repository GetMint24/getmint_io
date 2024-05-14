import { Chain, Nft } from '@prisma/client';
import { NftBlockchainDataForSync } from './types';
import { NftDataForSync } from '../../../../common/dto/NFTsForSync';

interface NftWithChain extends Nft {
  chain: Chain;
}

const ONE_MINUTE_IN_MILLISECONDS = 60 * 1000;

export function getNftsForSync(
  unconfirmedNfts: NftWithChain[],
  nftsFromBlockchainByChainName: Record<string, NftBlockchainDataForSync[]>,
  confirmedNftTokenIdsByChainName: Record<string, number[]>
) {
  const confirmedNftTokenIdsByChainNameCopy = JSON.parse(
    JSON.stringify(confirmedNftTokenIdsByChainName)
  );

  const nftsDataForSync = unconfirmedNfts.reduce(
    (res: NftDataForSync, nft) => {
      const nftsFromBlockchain = nftsFromBlockchainByChainName[nft.chain.name];
      const alreadyConfirmedTokenIds = confirmedNftTokenIdsByChainNameCopy[nft.chain.name];

      if (!nftsFromBlockchain) {
        return res;
      }

      const nftDataForSync = findClosestNftByTime(
        nftsFromBlockchain,
        nft.createdAt.valueOf(),
        alreadyConfirmedTokenIds || []
      );

      if (nftDataForSync) {
        res.forUpdate.push({
          id: nft.id,
          tokenId: nftDataForSync.tokenId,
          transactionHash: nftDataForSync.transactionHash,
        });

        if (alreadyConfirmedTokenIds) {
          alreadyConfirmedTokenIds.push(nftDataForSync.tokenId);
        }
      } else {
        // we give 10 minutes for the transaction to be displayed on the blockchain
        if (new Date().valueOf() - nft.createdAt.valueOf() > ONE_MINUTE_IN_MILLISECONDS) {
          res.forDelete.push({
            id: nft.id,
            pinataImageHash: nft.pinataImageHash,
          });
        }
      }

      return res;
    },
    {
      forDelete: [],
      forUpdate: [],
    }
  );

  return nftsDataForSync;
}

function findClosestNftByTime(
  nfts: NftBlockchainDataForSync[],
  backendMintTime: number,
  alreadyConfirmedTokenIds: number[]
): NftBlockchainDataForSync | null {
  // blockchain mint time should be greater then backend mint time because first of all we save nft in backend
  const nftsFromBlockchainAfterMintTime = nfts.filter((nft) => backendMintTime < nft.mintTime).sort((a, b) => b.mintTime - a.mintTime);
  return findClosestNft(nftsFromBlockchainAfterMintTime, backendMintTime, alreadyConfirmedTokenIds);
}

function findClosestNft(
  nfts: NftBlockchainDataForSync[],
  backendMintTime: number,
  alreadyConfirmedTokenIds: number[]
): NftBlockchainDataForSync | null {
  if (!nfts.length) {
    return null;
  }

  let closestNft: NftBlockchainDataForSync | null = null;
  let closestNftIdx = 0;
  let minDiff = Infinity;

  nfts.forEach((nft, idx) => {
    const diff = nft.mintTime - backendMintTime;

    if (diff < minDiff) {
      minDiff = diff;
      closestNft = nft;
      closestNftIdx = idx;
    }
  });

  closestNft = closestNft as NftBlockchainDataForSync | null;

  if (closestNft && alreadyConfirmedTokenIds.includes(closestNft.tokenId)) {
    nfts.splice(closestNftIdx, 1);

    return findClosestNft(nfts, backendMintTime, alreadyConfirmedTokenIds);
  }

  return closestNft;
}
