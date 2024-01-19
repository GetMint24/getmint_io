import { NextRequest } from "next/server";
import { BadRequest } from "../utils/responses";
import prisma from "../../../utils/prismaClient";

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

    const history = balanceLogs.map((log, index) => {
        const network = log.bridgeLog ? log.bridgeLog.previousChain : log.mintLog && index ? balanceLogs[index - 1].bridgeLog?.previousChain : currentNetwork;
        const targetNetwork = log.bridgeLog?.nextChain;

        return {
            type: log.type,
            chainNetwork: network,
            targetChainNetwork: targetNetwork,
            date: log.createdAt,
        };
    });

    return Response.json(history);
}