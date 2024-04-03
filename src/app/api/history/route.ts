import { NextRequest } from "next/server";
import { BadRequest } from "../utils/responses";
import prisma from "../../../utils/prismaClient";
import { HyperlaneTransactionInfo } from "../../../common/dto/HyperlaneTransactionInfo";
import axios from "axios";
import { toDictionary } from "../../../utils/to-dictionary";
import { BalanceLog, BridgeLog, MintLog } from "@prisma/client";

interface BalanceMintBridgeLog extends BalanceLog {
    mintLog: MintLog | null,
    bridgeLog: BridgeLog | null,
}

const HYPERLANE_BASE_URL = 'https://explorer.hyperlane.xyz/api'

export async function GET(request: NextRequest) {
    const nftId = request.nextUrl.searchParams.get('nftId');
    const currentNetwork = request.nextUrl.searchParams.get('currentNetwork');

    if (!nftId || !currentNetwork) {
        return new BadRequest('Nft id and current chain network is required');
    }

    const mintLogs = await prisma.mintLog.findMany({ where: { nftId } });
    const bridgeLogs = await prisma.bridgeLog.findMany({ where: { nftId } });
    const balanceLogIds = mintLogs.map((log) => log.balanceLogId).concat(bridgeLogs.map((log) => log.balanceLogId));
    const balanceLogs = await prisma.balanceLog.findMany({
        where: { id: { in: balanceLogIds } },
        orderBy: { 'createdAt': 'desc' },
        include: { mintLog: true, bridgeLog: true },
    });

    const hyperlaneTransactionsByHash = await getHyperlaneTransactions(balanceLogs)

    const history = balanceLogs.map((log, index) => {
        const network = log.bridgeLog ? log.bridgeLog.previousChain : log.mintLog && index ? balanceLogs[index - 1].bridgeLog?.previousChain : currentNetwork;
        const targetNetwork = log.bridgeLog?.nextChain;

        return {
            type: log.type,
            chainNetwork: network,
            targetChainNetwork: targetNetwork,
            date: log.createdAt,
            transactionHash: log.bridgeLog?.transactionHash ? hyperlaneTransactionsByHash[log.bridgeLog.transactionHash].id : undefined
        };
    });

    return Response.json(history);
}

async function getHyperlaneTransactions(balanceLogs: BalanceMintBridgeLog[]) {
    const hyperlaneTransactionPromises = balanceLogs.reduce((promises: Promise<HyperlaneTransactionInfo['result']>[], log) => {
        if (log.bridgeLog?.transactionHash) {
            promises.push(getHyperlaneTransactionInfo(log.bridgeLog.transactionHash))
        }

        return promises
    }, [])

    const hyperlaneTransactions = await Promise.all(hyperlaneTransactionPromises)
    return toDictionary(hyperlaneTransactions.flat(), (t) => t.origin.hash)
}

async function getHyperlaneTransactionInfo(hash: string) {
    const response = await axios<HyperlaneTransactionInfo>(
        HYPERLANE_BASE_URL, 
        { 
            params: { 
                module: 'message', 
                action: 'get-messages',
                'origin-tx-hash': hash
            } 
        }
    );

    return response.data.result;
}