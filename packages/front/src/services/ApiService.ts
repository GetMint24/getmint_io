import { CreateMintDto, MintDto } from "../common/MintDto";
import { apiClient } from "../utils/api";

class ApiService {
    async createMint(image: File, data: CreateMintDto): Promise<MintDto> {
        const formData = new FormData();
        formData.append('image', image);

        Object.keys(data).forEach(key  => {
            formData.append(key, `${data[key as keyof CreateMintDto]}`);
        });

        const response = await apiClient.post('mint', data);
        return response.data;
    }
}

export default new ApiService();