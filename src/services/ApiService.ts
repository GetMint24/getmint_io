import { CreateMintDto, MintDto } from "../common/dto/MintDto";
import { apiClient } from "../utils/api";
import { AccountDto } from "../common/dto/AccountDto";

class ApiService {
    async getAccount(): Promise<AccountDto> {
        const response = await apiClient.get('account');
        return response.data;
    }

    async createMint(image: File, data: CreateMintDto): Promise<MintDto> {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', data.name);
        formData.append('description', data.description ?? '');

        const response = await apiClient.post('mint', formData);
        return response.data;
    }
}

export default new ApiService();