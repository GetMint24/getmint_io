import { ChainDto } from "../../common/dto/ChainDto";

export interface SuccessfulBridgeData {
    nftId: string;
    previousChain: ChainDto;
    nextChain: ChainDto;
}