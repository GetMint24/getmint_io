import { ConfirmMintDto, CreateOptimisticMintDto, MintDto } from '../common/dto/MintDto';
import { apiClient } from '../utils/api';
import { AccountDto } from '../common/dto/AccountDto';
import { NFTDto } from '../common/dto/NFTDto';
import { BridgeDto } from '../common/dto/BridgeDto';
import { ChainDto } from '../common/dto/ChainDto';
import { CreateTweetDto } from '../common/dto/CreateTweetDto';
import { LeaderDto } from '../common/dto/LeaderDto';
import { RandomImageDto } from '../common/dto/RandomImageDto';
import { OperationHistoryDto } from '../common/dto/OperationHistoryDto';
import { BridgeType } from '../common/enums/BridgeType';
import axios from 'axios';
import { NftDataForSync } from '../common/dto/NFTsForSync';

class ApiService {
  async getAccount(): Promise<AccountDto> {
    const response = await apiClient.get('account');
    return response.data;
  }

  async getNft(id: string): Promise<NFTDto> {
    const response = await apiClient.get<NFTDto>('nft', { params: { id } });
    return response.data;
  }

  async createNFT(image: File, data: { name: string; description: string }) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', data.name);
    formData.append('description', data.description ?? '');

    const response = await apiClient.post('nft', formData);
    return response.data;
  }

  async deleteNft(id: string): Promise<MintDto> {
    const response = await apiClient.delete('nft', { params: { id } });
    return response.data;
  }

  async createOptimisticMint(data: CreateOptimisticMintDto): Promise<MintDto> {
    const response = await apiClient.post('mint/optimistic', data);
    return response.data;
  }

  async confirmMint(data: ConfirmMintDto): Promise<MintDto> {
    const response = await apiClient.post('mint/confirm', data);
    return response.data;
  }

  async bridgeNFT(data: BridgeDto) {
    await apiClient.post('bridge', data);
  }

  async getCollection(type = BridgeType.LayerZero) {
    const response = await apiClient.get<NFTDto[]>('collection', {
      params: { type },
    });
    return response.data;
  }

  async getChains() {
    const response = await apiClient.get<ChainDto[]>('chains');
    return response.data;
  }

  async disconnectTwitter() {
    const response = await apiClient.post<{ status: 'ok' | 'failed' }>('twitter/disconnect');
    return response.data;
  }

  async createTweet(data: CreateTweetDto) {
    const response = await apiClient.post<{ status: 'ok' | 'failed' }>(
      'twitter/create-tweet',
      data
    );
    return response.data;
  }

  async createIntentTweet(data: CreateTweetDto) {
    const response = await apiClient.post<{ status: 'ok' | 'failed' }>(
      'twitter/create-intent-tweet',
      data
    );
    return response.data;
  }

  async clearTwitter(userId: string) {
    const response = await apiClient.post<{ status: 'ok' | 'failed' }>('twitter/clear', { userId });
    return response.data;
  }

  async followTwitter(userId: string) {
    const response = await apiClient.post<{ status: 'ok' | 'failed' }>('twitter/follow', {
      userId,
    });
    return response.data;
  }

  async getLeaders() {
    const response = await apiClient.get<LeaderDto[]>('leaders');
    return response.data;
  }

  async getCurrentUserStat() {
    const response = await apiClient.get<LeaderDto>('leaders/current');
    return response.data;
  }

  async getRandomImage() {
    const response = await apiClient.get<RandomImageDto>('cloud/random-image');
    return response.data;
  }

  async deleteFileFromCloud(key: string) {
    const response = await apiClient.post<{ status: 'ok' | 'failed' }>('cloud/delete', { key });
    return response.data;
  }

  async deleteNftImageFromPinata(imageHash: string) {
    const response = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${imageHash}`, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    });
    return response.data;
  }

  async getNftHistory(nftId: string, currentNetwork: string, bridgeType: BridgeType) {
    const response = await apiClient.get<OperationHistoryDto[]>('history', {
      params: { nftId, currentNetwork, bridgeType },
    });
    return response.data;
  }

  async syncNftsWithBlockchain() {
    const response = await apiClient.post<NftDataForSync>('blockchain-sync');

    if (response.data.forUpdate.length) {
      await Promise.allSettled(response.data.forUpdate.map((nft) => this.confirmMint(nft)));
    }

    if (response.data.forDelete.length) {
      await Promise.allSettled(
        response.data.forDelete.map(({ id, pinataImageHash }) =>
          Promise.allSettled([this.deleteNft(id), this.deleteNftImageFromPinata(pinataImageHash)])
        )
      );
    }

    return !!(response.data.forUpdate.length || response.data.forDelete.length);
  }
}

export default new ApiService();
