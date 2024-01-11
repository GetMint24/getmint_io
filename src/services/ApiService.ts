import { CreateMintDto, MintDto } from "../common/dto/MintDto";
import { apiClient } from "../utils/api";
import { AccountDto } from "../common/dto/AccountDto";
import { NFTDto } from "../common/dto/NFTDto";
import { BridgeDto } from "../common/dto/BridgeDto";
import { ChainDto } from "../common/dto/ChainDto";
import { CreateTweetDto } from "../common/dto/CreateTweetDto";

class ApiService {
    async getAccount(): Promise<AccountDto> {
        const response = await apiClient.get('account');
        return response.data;
    }

    async checkExistedNFT(image: File, data: { name: string; description: string }) {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', data.name);
        formData.append('description', data.description ?? '');

        const response = await apiClient.post('nft', formData);
        return response.data;
    }

    async createMint(image: File, data: CreateMintDto): Promise<MintDto> {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', data.name);
        formData.append('description', data.description ?? '');
        formData.append('tokenId', `${data.tokenId}`);
        formData.append('chainNetwork', data.chainNetwork);
        formData.append('transactionHash', data.transactionHash);

        const response = await apiClient.post('mint', formData);
        return response.data;
    }

    async bridgeNFT(data: BridgeDto) {
        await apiClient.post('bridge', data);
    }

    async getCollection() {
        const response = await apiClient.get<NFTDto[]>('collection');
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
        const response = await apiClient.post<{ status: 'ok' | 'failed' }>('twitter/create-tweet', data);
        return response.data;
    }

    async clearTwitter(userId: string) {
        const response = await apiClient.post<{ status: 'ok' | 'failed' }>('twitter/clear', { userId });
        return response.data;
    }

    async followTwitter(userId: string) {
        const response = await apiClient.post<{ status: 'ok' | 'failed' }>('twitter/follow', { userId });
        return response.data;
    }
}

export default new ApiService();