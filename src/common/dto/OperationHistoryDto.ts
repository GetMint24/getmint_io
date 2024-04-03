export interface OperationHistoryDto {
    type: 'mint' | 'bridge';
    chainNetwork: string;
    targetChainNetwork?: string;
    date: Date;
    transactionHash: string | undefined
}