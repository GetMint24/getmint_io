import { LeaderDto } from "../../../../common/dto/LeaderDto";
import { BalanceLogType } from "../../../../common/enums/BalanceLogType";
import { BalanceOperation } from "../../../../common/enums/BalanceOperation";
import prisma from "../../../../utils/prismaClient";
import { BadRequest } from "../../utils/responses";

export async function GET(request: Request) {
    const metamaskWalletAddress = request.headers.get('X-Metamask-Address');

    if (!metamaskWalletAddress) {
        return new BadRequest('Metamask account not provided');
    }

    const user = await prisma.user.findFirst({ where: { metamaskWalletAddress } });

    if (!user) {
        return new BadRequest('Incorrect metamask address');
    }

    const leaders = await prisma.balanceLog.groupBy({
        by: ['userId'],
        where: { operation: BalanceOperation.Debit, type : { in: [ BalanceLogType.Mint, BalanceLogType.Bridge ] } },
        orderBy: { _sum: { amount: 'desc' } },
        _sum: { amount: true },
    });
    let position = leaders.findIndex((log) => log.userId === user.id) + 1;

    if (position === 0){
        position = leaders.length + 1;
    }

    const total = await prisma.balanceLog.aggregate({
        where: { userId: user.id, operation: BalanceOperation.Debit, type : { in: [ BalanceLogType.Mint, BalanceLogType.Bridge ] } },
        _sum: { amount: true }
    });
    const mints = await prisma.balanceLog.aggregate({
        where: {
            userId: user.id,
            operation: BalanceOperation.Debit,
            type: BalanceLogType.Mint,
        },
        _count: { amount: true }
    });
    const bridges = await prisma.balanceLog.aggregate({
        where: {
            userId: user.id,
            operation: BalanceOperation.Debit,
            type: BalanceLogType.Bridge,
        },
        _count: { amount: true }
    });

    const result: LeaderDto = {
        id: user.id,
        login: user.twitterLogin || `${metamaskWalletAddress.slice(0, 1)}х${metamaskWalletAddress.slice(2, 6)}...${metamaskWalletAddress.slice(-5)}`,
        avatar: user.avatar || undefined,
        position: position,
        mintCount: mints._count.amount,
        bridgeCount: bridges._count.amount,
        total: total._sum.amount || 0,
    };

    return Response.json(result);
}