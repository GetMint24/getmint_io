interface HyperlaneWaypointInfo {
    timestamp: number,
    hash: string,
    from: string,
    blockHash: string,
    blockNumber: number,
    mailbox: string,
    nonce: number,
    to: string,
    gasLimit: number,
    gasPrice: number,
    effectiveGasPrice: number,
    gasUsed: number,
    cumulativeGasUsed: number,
    maxFeePerGas: number,
    maxPriorityPerGas: number
}

export interface HyperlaneTransactionInfo {
    status: string,
    message: string,
    result: {
        id: string,
        status: string,
        sender: string,
        recipient: string,
        originDomainId: number,
        destinationDomainId: number,
        nonce: number,
        body: string,
        origin: HyperlaneWaypointInfo,
        destination?: HyperlaneWaypointInfo,
        isPiMsg: false,
        totalGasAmount: string,
        totalPayment: string,
        numPayments: number
    }
}